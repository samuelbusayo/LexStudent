import { getServiceClient, getUser, corsHeaders, errorResponse } from '../_shared/supabase-client.ts'
import OpenAI from 'https://esm.sh/openai@4.58.1'

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate user
    const user = await getUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const db = getServiceClient()
    const { topicId, message, conversationId, requestId: clientRequestId } = await req.json()

    if (!topicId || !message) {
      return errorResponse('topicId and message are required')
    }

    const requestId = clientRequestId || crypto.randomUUID()

    // 2. Check subscription / usage limits
    const { data: profile } = await db
      .from('profiles')
      .select('subscription_status, ai_messages_used, ai_messages_limit, usage_reset_at, is_superuser')
      .eq('id', user.id)
      .single()

    if (!profile) return errorResponse('Profile not found', 404)

    // Reset monthly counter if needed
    const resetAt = new Date(profile.usage_reset_at)
    const now = new Date()
    const daysSinceReset = (now.getTime() - resetAt.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceReset >= 30) {
      await db.from('profiles').update({
        ai_messages_used: 0,
        usage_reset_at: now.toISOString(),
      }).eq('id', user.id)
      profile.ai_messages_used = 0
    }

    const isPremium = profile.is_superuser || profile.subscription_status === 'active'
    if (!isPremium && profile.ai_messages_used >= profile.ai_messages_limit) {
      return errorResponse(
        `Free tier limit reached (${profile.ai_messages_limit} messages/month). Upgrade to Premium for unlimited access.`,
        403
      )
    }

    // 3. Create or get conversation
    let convId = conversationId
    if (!convId) {
      const { data: conv, error: convErr } = await db
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          title: message.slice(0, 100),
        })
        .select('id')
        .single()
      if (convErr) return errorResponse('Failed to create conversation: ' + convErr.message, 500)
      convId = conv.id
    }

    // 4. Save user message
    await db.from('ai_messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
      status: 'completed',
    })

    // 5. Create placeholder assistant message (worker pattern)
    const { data: assistantMsg, error: assistErr } = await db
      .from('ai_messages')
      .insert({
        conversation_id: convId,
        role: 'assistant',
        content: '',
        status: 'processing',
        request_id: requestId,
      })
      .select('id')
      .single()

    if (assistErr) return errorResponse('Failed to create message: ' + assistErr.message, 500)
    const assistantMsgId = assistantMsg.id

    // 6. Run hybrid search (pgvector + FTS via RPC)
    let contextChunks: Array<{ chunk_id: number; chunk_content: string; chunk_page_number: number }> = []

    // Generate query embedding for semantic search
    let queryEmbedding: number[] | null = null
    try {
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: Deno.env.get('OPENROUTER_API_KEY'),
      })
      const embResponse = await openai.embeddings.create({
        model: 'qwen/qwen3-embedding-8b',
        input: message,
      })
      queryEmbedding = embResponse.data[0].embedding
    } catch (e) {
      console.error('[ai-chat] Embedding failed:', e.message)
    }

    if (queryEmbedding) {
      try {
        // Format embedding as pgvector string
        const embString = `[${queryEmbedding.join(',')}]`
        const { data, error } = await db.rpc('hybrid_search', {
          query_text: message,
          query_embedding: embString,
          p_topic_id: Number(topicId),
          p_user_id: user.id,
          match_count: 6,
          rrf_k: 60,
        })
        if (!error && data) contextChunks = data
      } catch (e) {
        console.error('[ai-chat] Hybrid search failed:', e.message)
      }
    }

    // 7. Build chat messages
    const { data: history } = await db
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .eq('status', 'completed')
      .order('id', { ascending: false })
      .limit(10)

    const pastMessages = (history || []).reverse().slice(0, -1) // Exclude the user message we just added

    const contextText = contextChunks.map((c, i) =>
      `[Source ${i + 1}, Page ${c.chunk_page_number}]\n${c.chunk_content}`
    ).join('\n\n---\n\n')

    const systemPrompt = `You are a knowledgeable study assistant for Nigerian law students.

${contextChunks.length > 0
      ? `Use the following excerpts from their study material to answer. Cite page numbers when referencing specific content (e.g. "According to the material on page 5...").

STUDY MATERIAL EXCERPTS:
${contextText}

If the excerpts don't contain relevant information, say so and provide general guidance.`
      : 'No study material excerpts are available for this topic. Provide general guidance based on your knowledge of Nigerian law.'}`

    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...pastMessages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // 8. Stream LLM response (SSE)
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: Deno.env.get('OPENROUTER_API_KEY'),
          })

          const llmStream = await openai.chat.completions.create({
            model: 'deepseek/deepseek-v4-flash',
            messages: chatMessages,
            stream: true,
            max_tokens: 1500,
            temperature: 0.3,
          })

          let fullResponse = ''
          let tokenCount = 0

          for await (const chunk of llmStream) {
            // Check for cancellation every 10 tokens
            if (tokenCount % 10 === 0) {
              const { data: cancelled } = await db
                .from('ai_cancellations')
                .select('request_id')
                .eq('request_id', requestId)
                .maybeSingle()

              if (cancelled) {
                // Save partial response as cancelled
                await db.from('ai_messages').update({
                  content: fullResponse || '(Cancelled)',
                  status: 'cancelled',
                }).eq('id', assistantMsgId)

                // Cleanup cancellation signal
                await db.from('ai_cancellations').delete().eq('request_id', requestId)

                controller.enqueue(encoder.encode(
                  `data: ${JSON.stringify({ type: 'cancelled', content: fullResponse })}\n\n`
                ))
                controller.close()
                return
              }
            }

            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullResponse += content
              tokenCount++
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'content', content })}\n\n`
              ))
            }
          }

          // 9. Save completed response
          const contextRefs = contextChunks.map(c => ({
            chunkId: c.chunk_id,
            pageNumber: c.chunk_page_number,
            snippet: c.chunk_content.slice(0, 100),
          }))

          await db.from('ai_messages').update({
            content: fullResponse,
            status: 'completed',
            context_chunks: contextRefs,
          }).eq('id', assistantMsgId)

          // Update conversation timestamp
          await db.from('ai_conversations').update({
            updated_at: new Date().toISOString(),
          }).eq('id', convId)

          // Increment usage counter
          await db.from('profiles').update({
            ai_messages_used: profile.ai_messages_used + 1,
          }).eq('id', user.id)

          // Send done event
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: 'done',
              conversationId: convId,
              messageId: assistantMsgId,
              sources: contextRefs,
            })}\n\n`
          ))
          controller.close()
        } catch (err) {
          console.error('[ai-chat] Streaming error:', err.message)

          // Save error status
          await db.from('ai_messages').update({
            status: 'error',
            error_message: err.message,
          }).eq('id', assistantMsgId)

          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`
          ))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Conversation-Id': String(convId),
        'X-Request-Id': requestId,
      },
    })
  } catch (err) {
    console.error('[ai-chat] Error:', err.message)
    return errorResponse(err.message, 500)
  }
})
