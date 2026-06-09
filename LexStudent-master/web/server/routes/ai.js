import { Router } from 'express'
import OpenAI from 'openai'
import { getDb } from '../db.js'
import { hybridSearch } from '../helpers/hybridSearch.js'
import { getIndexStatusForTopic } from '../helpers/indexingPipeline.js'

const router = Router()

router.get('/status/:topicId', (req, res) => {
  const index = getIndexStatusForTopic(req.params.topicId)
  res.json({
    available: index?.status === 'completed',
    index_status: index?.status || 'not_indexed',
    total_chunks: index?.total_chunks || 0,
  })
})

router.post('/chat', async (req, res) => {
  const { topicId, message, conversationId } = req.body
  if (!topicId || !message) return res.status(400).json({ error: 'topicId and message required' })

  const db = getDb()

  let convId = conversationId
  if (!convId) {
    const result = db.prepare(
      "INSERT INTO ai_conversations (topic_id, user_id, title) VALUES (?, 1, ?)"
    ).run(topicId, message.slice(0, 100))
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
    'SELECT role, content FROM ai_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 10'
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

    res.write(`data: ${JSON.stringify({ type: 'done', conversationId: convId, sources: contextRefs })}\n\n`)
    res.end()
  } catch (err) {
    console.error('[ai] Chat error:', err.message)
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`)
    res.end()
  }
})

router.get('/conversations/:topicId', (req, res) => {
  const db = getDb()
  const conversations = db.prepare(
    'SELECT * FROM ai_conversations WHERE topic_id = ? AND user_id = 1 ORDER BY updated_at DESC'
  ).all(req.params.topicId)
  res.json(conversations)
})

router.get('/messages/:conversationId', (req, res) => {
  const db = getDb()
  const messages = db.prepare(
    'SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC'
  ).all(req.params.conversationId)
  res.json(messages)
})

router.delete('/conversations/:id', (req, res) => {
  const db = getDb()
  db.prepare('DELETE FROM ai_messages WHERE conversation_id = ?').run(req.params.id)
  db.prepare('DELETE FROM ai_conversations WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
