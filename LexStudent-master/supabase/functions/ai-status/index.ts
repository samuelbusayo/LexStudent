import { getServiceClient, getUser, corsHeaders, errorResponse, jsonResponse } from '../_shared/supabase-client.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const url = new URL(req.url)
    const topicId = url.searchParams.get('topicId')
    if (!topicId) return errorResponse('topicId query param is required')

    const db = getServiceClient()

    // Get profile for subscription info
    const { data: profile } = await db
      .from('profiles')
      .select('subscription_status, ai_messages_used, ai_messages_limit, usage_reset_at, is_superuser')
      .eq('id', user.id)
      .single()

    const isPremium = profile?.is_superuser || profile?.subscription_status === 'active'

    // Check monthly reset
    if (profile) {
      const resetAt = new Date(profile.usage_reset_at)
      const daysSinceReset = (Date.now() - resetAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceReset >= 30) {
        await db.from('profiles').update({
          ai_messages_used: 0,
          usage_reset_at: new Date().toISOString(),
        }).eq('id', user.id)
        profile.ai_messages_used = 0
      }
    }

    // Get indexing status for topic
    const { data: indices } = await db
      .from('topic_material_indices')
      .select('index_id, material_indices(id, status, total_chunks)')
      .eq('user_id', user.id)
      .eq('topic_id', Number(topicId))

    let indexStatus = 'not_indexed'
    let totalChunks = 0

    if (indices && indices.length > 0) {
      const allCompleted = indices.every(
        (i: any) => i.material_indices?.status === 'completed'
      )
      const anyProcessing = indices.some(
        (i: any) => i.material_indices?.status === 'processing'
      )
      totalChunks = indices.reduce(
        (sum: number, i: any) => sum + (i.material_indices?.total_chunks || 0), 0
      )

      if (allCompleted) indexStatus = 'completed'
      else if (anyProcessing) indexStatus = 'processing'
      else indexStatus = 'pending'
    }

    return jsonResponse({
      available: indexStatus === 'completed',
      indexStatus,
      totalChunks,
      isPremium,
      messagesUsed: profile?.ai_messages_used || 0,
      messagesLimit: isPremium ? 999999 : (profile?.ai_messages_limit || 5),
    })
  } catch (err) {
    console.error('[ai-status] Error:', err.message)
    return errorResponse(err.message, 500)
  }
})
