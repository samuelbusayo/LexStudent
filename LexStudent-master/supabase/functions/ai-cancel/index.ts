import { getServiceClient, getUser, corsHeaders, errorResponse, jsonResponse } from '../_shared/supabase-client.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { requestId } = await req.json()
    if (!requestId) return errorResponse('requestId is required')

    const db = getServiceClient()

    // Verify the request belongs to this user's conversation
    const { data: msg } = await db
      .from('ai_messages')
      .select('id, conversation_id')
      .eq('request_id', requestId)
      .eq('status', 'processing')
      .maybeSingle()

    if (!msg) {
      return jsonResponse({ cancelled: false, reason: 'No active request found' })
    }

    // Verify conversation ownership
    const { data: conv } = await db
      .from('ai_conversations')
      .select('user_id')
      .eq('id', msg.conversation_id)
      .single()

    if (!conv || conv.user_id !== user.id) {
      return errorResponse('Not authorized to cancel this request', 403)
    }

    // Insert cancellation signal
    await db.from('ai_cancellations').upsert({
      request_id: requestId,
      cancelled_at: new Date().toISOString(),
    })

    return jsonResponse({ cancelled: true, requestId })
  } catch (err) {
    console.error('[ai-cancel] Error:', err.message)
    return errorResponse(err.message, 500)
  }
})
