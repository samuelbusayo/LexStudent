import { getServiceClient, getUser, corsHeaders, errorResponse, jsonResponse } from '../_shared/supabase-client.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const db = getServiceClient()

    const { data: profile } = await db
      .from('profiles')
      .select(
        'subscription_status, subscription_plan, subscription_started_at, subscription_expires_at, ai_messages_used, ai_messages_limit, usage_reset_at, is_superuser'
      )
      .eq('id', user.id)
      .single()

    if (!profile) return errorResponse('Profile not found', 404)

    // Check if monthly reset is needed
    const resetAt = new Date(profile.usage_reset_at)
    const daysSinceReset = (Date.now() - resetAt.getTime()) / (1000 * 60 * 60 * 24)
    let messagesUsed = profile.ai_messages_used

    if (daysSinceReset >= 30) {
      await db.from('profiles').update({
        ai_messages_used: 0,
        usage_reset_at: new Date().toISOString(),
      }).eq('id', user.id)
      messagesUsed = 0
    }

    // Superusers always have full access
    if (profile.is_superuser) {
      return jsonResponse({
        status: 'active',
        plan: 'superuser',
        isPremium: true,
        isSuperuser: true,
        startedAt: null,
        expiresAt: null,
        messagesUsed: 0,
        messagesLimit: 999999,
        daysUntilReset: 0,
      })
    }

    // Check if subscription has expired
    const isPremium = profile.subscription_status === 'active'
    if (isPremium && profile.subscription_expires_at) {
      const expiresAt = new Date(profile.subscription_expires_at)
      if (expiresAt < new Date()) {
        // Expired — downgrade
        await db.from('profiles').update({
          subscription_status: 'expired',
          ai_messages_limit: 5,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id)
        profile.subscription_status = 'expired'
      }
    }

    return jsonResponse({
      status: profile.subscription_status,
      plan: profile.subscription_plan,
      isPremium: profile.subscription_status === 'active',
      startedAt: profile.subscription_started_at,
      expiresAt: profile.subscription_expires_at,
      messagesUsed,
      messagesLimit: profile.subscription_status === 'active' ? 999999 : (profile.ai_messages_limit || 5),
      daysUntilReset: Math.max(0, 30 - daysSinceReset),
    })
  } catch (err) {
    console.error('[subscription-status] Error:', err.message)
    return errorResponse(err.message, 500)
  }
})
