import { getServiceClient, getUser, corsHeaders, errorResponse, jsonResponse } from '../_shared/supabase-client.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { plan, callbackUrl } = await req.json()
    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return errorResponse('plan must be "monthly" or "yearly"')
    }

    const db = getServiceClient()

    // Get user profile
    const { data: profile } = await db
      .from('profiles')
      .select('email, name, paystack_customer_code')
      .eq('id', user.id)
      .single()

    if (!profile) return errorResponse('Profile not found', 404)

    // Already active subscription?
    const { data: activeProfile } = await db
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    if (activeProfile?.subscription_status === 'active') {
      return errorResponse('You already have an active subscription', 400)
    }

    // Map plan to Paystack plan code
    const planCode = plan === 'monthly'
      ? Deno.env.get('PAYSTACK_MONTHLY_PLAN_CODE')
      : Deno.env.get('PAYSTACK_YEARLY_PLAN_CODE')

    if (!planCode) {
      return errorResponse('Payment plan not configured', 500)
    }

    const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!secretKey) return errorResponse('Payment gateway not configured', 500)

    // Initialize Paystack transaction
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.email || user.email,
        plan: planCode,
        callback_url: callbackUrl || 'http://localhost:5173/subscription/callback',
        metadata: {
          user_id: user.id,
          plan_type: plan,
          custom_fields: [
            { display_name: 'User', variable_name: 'user_name', value: profile.name },
            { display_name: 'Plan', variable_name: 'plan_type', value: plan },
          ],
        },
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackData.status) {
      return errorResponse('Failed to initialize payment: ' + (paystackData.message || 'Unknown error'), 500)
    }

    return jsonResponse({
      authorizationUrl: paystackData.data.authorization_url,
      accessCode: paystackData.data.access_code,
      reference: paystackData.data.reference,
    })
  } catch (err) {
    console.error('[paystack-init] Error:', err.message)
    return errorResponse(err.message, 500)
  }
})
