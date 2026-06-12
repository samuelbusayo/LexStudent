import { Router } from 'express'
import jwt from 'jsonwebtoken'
import OpenAI from 'openai'
import { getDb } from '../db.js'
import { hybridSearch } from '../helpers/hybridSearch.js'
import { getIndexStatusForTopic } from '../helpers/indexingPipeline.js'
import { safeEvaluate } from '../services/badgeEvaluator.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'lexstudent-dev-secret-key-change-in-production'

// Middleware to verify local JWT auth token
function authenticateLocal(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const db = getDb()
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Helper: check and reset monthly AI usage counter
function getUserUsage(db, userId) {
  const user = db.prepare('SELECT ai_messages_used, ai_messages_limit, usage_reset_at FROM users WHERE id = ?').get(userId)
  if (!user) return { used: 0, limit: 5, isPremium: false, resetAt: new Date() }

  const resetAt = new Date(user.usage_reset_at || new Date())
  const now = new Date()
  const daysSinceReset = (now.getTime() - resetAt.getTime()) / (1000 * 60 * 60 * 24)

  if (daysSinceReset >= 30) {
    db.prepare("UPDATE users SET ai_messages_used = 0, usage_reset_at = datetime('now') WHERE id = ?").run(userId)
    return { used: 0, limit: user.ai_messages_limit || 5, isPremium: false, resetAt: new Date() }
  }

  return { used: user.ai_messages_used || 0, limit: user.ai_messages_limit || 5, isPremium: false, resetAt }
}

router.get('/status/:topicId', authenticateLocal, (req, res) => {
  const db = getDb()
  const usage = getUserUsage(db, req.user.id)
  const index = getIndexStatusForTopic(req.params.topicId)

  res.json({
    available: index?.status === 'completed',
    indexStatus: index?.status || 'not_indexed',
    totalChunks: index?.total_chunks || 0,
    isPremium: false,
    messagesUsed: usage.used,
    messagesLimit: usage.limit,
  })
})

router.post('/chat', authenticateLocal, async (req, res) => {
  const { topicId, message, conversationId } = req.body
  if (!topicId || !message) return res.status(400).json({ error: 'topicId and message required' })

  const db = getDb()
  const userId = req.user.id

  // Check usage limit
  const usage = getUserUsage(db, userId)
  if (usage.used >= usage.limit) {
    return res.status(403).json({
      error: `Free tier limit reached (${usage.limit} messages/month). Upgrade to Premium for unlimited access.`,
    })
  }

  let convId = conversationId
  if (!convId) {
    const result = db.prepare(
      "INSERT INTO ai_conversations (topic_id, user_id, title) VALUES (?, ?, ?)"
    ).run(topicId, userId, message.slice(0, 100))
    convId = result.lastInsertRowid
  }

  let contextChunks = []
  try {
    contextChunks = await hybridSearch(Number(topicId), message, { topK: 6 })
  } catch (err) {
    console.error('[ai] Hybrid search failed:', err.message)
  }

  db.prepare(
    'INSERT INTO ai_messages (conversation_id, role, content) VALUES (?, ?, ?)'
  ).run(convId, 'user', message)

  const history = db.prepare(
    "SELECT role, content FROM ai_messages WHERE conversation_id = ? AND role IN ('user', 'assistant') ORDER BY id DESC LIMIT 10"
  ).all(convId).reverse()

  const topic = db.prepare('SELECT t.name, c.name as course_name FROM topics t JOIN courses c ON c.id = t.course_id WHERE t.id = ?').get(topicId)

  const contextText = contextChunks.map((c, i) =>
    `[Source ${i + 1}, Page ${c.pageNumber}]\n${c.content}`
  ).join('\n\n---\n\n')

  const systemPrompt = `You are a knowledgeable study assistant for Nigerian law students. The student is studying "${topic?.name || 'a legal topic'}" in ${topic?.course_name || 'their course'}.

${contextChunks.length > 0 ? `Use the following excerpts from their study material to answer. Cite page numbers when referencing specific content (e.g. "According to the material on page 5...").

STUDY MATERIAL EXCERPTS:
${contextText}

If the excerpts don't contain relevant information, say so and provide general guidance.` : 'No study material excerpts are available for this topic. Provide general guidance based on your knowledge of Nigerian law.'}`

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Conversation-Id', String(convId))
  res.flushHeaders()

  try {
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    const stream = await client.chat.completions.create({
      model: 'deepseek/deepseek-v4-flash',
      messages,
      stream: true,
      max_tokens: 1500,
      temperature: 0.3,
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullResponse += content
        res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`)
      }
    }

    const contextRefs = contextChunks.map(c => ({
      chunkId: c.id, pageNumber: c.pageNumber, snippet: c.content.slice(0, 100),
    }))

    db.prepare(
      'INSERT INTO ai_messages (conversation_id, role, content, context_chunks) VALUES (?, ?, ?, ?)'
    ).run(convId, 'assistant', fullResponse, JSON.stringify(contextRefs))

    db.prepare("UPDATE ai_conversations SET updated_at = datetime('now') WHERE id = ?").run(convId)

    // Increment usage counter
    db.prepare('UPDATE users SET ai_messages_used = ai_messages_used + 1 WHERE id = ?').run(userId)

    // Lifetime AI question counter for badge tracking (separate from the
    // monthly ai_messages_used quota which resets every 30 days).
    db.prepare(
      `INSERT INTO activity_log (user_id, type, amount, created_at)
       VALUES (?, 'ai_question', 1, datetime('now'))`
    ).run(userId)

    const newlyEarned = safeEvaluate(db, userId)

    res.write(`data: ${JSON.stringify({ type: 'done', conversationId: convId, sources: contextRefs, newlyEarnedBadges: newlyEarned })}\n\n`)
    res.end()
  } catch (err) {
    console.error('[ai] Chat error:', err.message)
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`)
    res.end()
  }
})

router.get('/subscription', authenticateLocal, (req, res) => {
  const db = getDb()
  const usage = getUserUsage(db, req.user.id)

  res.json({
    status: 'free',
    plan: null,
    isPremium: false,
    isSuperuser: false,
    messagesUsed: usage.used,
    messagesLimit: usage.limit,
    daysUntilReset: Math.max(0, 30 - Math.floor((Date.now() - new Date(usage.resetAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))),
  })
})

router.get('/conversations/:topicId', authenticateLocal, (req, res) => {
  const db = getDb()
  const conversations = db.prepare(
    'SELECT * FROM ai_conversations WHERE topic_id = ? AND user_id = ? ORDER BY updated_at DESC'
  ).all(req.params.topicId, req.user.id)
  res.json(conversations)
})

router.get('/messages/:conversationId', authenticateLocal, (req, res) => {
  const db = getDb()
  const messages = db.prepare(
    'SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC'
  ).all(req.params.conversationId)
  res.json(messages)
})

router.delete('/messages/:id', authenticateLocal, (req, res) => {
  const db = getDb()
  db.prepare('DELETE FROM ai_messages WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

router.delete('/conversations/:id', authenticateLocal, (req, res) => {
  const db = getDb()
  db.prepare('DELETE FROM ai_messages WHERE conversation_id = ?').run(req.params.id)
  db.prepare('DELETE FROM ai_conversations WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
