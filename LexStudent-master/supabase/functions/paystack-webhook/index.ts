import { getServiceClient, corsHeaders, errorResponse, jsonResponse } from '../_shared/supabase-client.ts'

// Verify Paystack webhook signature using HMAC SHA-512
async function verifyPaystackSignature(body: string, signature: string): Promise<boolean> {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
  if (!secret) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return expected === signature
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Paystack webhooks are always POST
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature') || ''

    // Verify webhook signature
    const isValid = await verifyPaystackSignature(rawBody, signature)
    if (!isValid) {
      console.error('[paystack-webhook] Invalid signature')
      return errorResponse('Invalid signature', 401)
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event
    const data = event.data

    console.log(`[paystack-webhook] Received event: ${eventType}`)

    const db = getServiceClient()

    // Extract user_id from metadata
    const userId = data.metadata?.user_id
    if (!userId) {
      console.error('[paystack-webhook] No user_id in metadata')
      // Still return 200 to acknowledge receipt
      return jsonResponse({ received: true })
    }

    // Log the event
    await db.from('subscription_events').insert({
      user_id: userId,
      event_type: eventType,
      paystack_reference: data.reference || data.subscription_code,
      amount: data.amount,
      currency: data.currency || 'NGN',
      metadata: data,
    })

    // Handle different event types
    switch (eventType) {
      case 'charge.success': {
        // Payment successful — activate subscription
        const planType = data.metadata?.plan_type || 'monthly'
        const expiresAt = planType === 'yearly'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        await db.from('profiles').update({
          subscription_status: 'active',
          subscription_plan: planType,
          paystack_customer_code: data.customer?.customer_code || null,
          subscription_started_at: new Date().toISOString(),
          subscription_expires_at: expiresAt.toISOString(),
          ai_messages_limit: 999999, // Unlimited for premium
          updated_at: new Date().toISOString(),
        }).eq('id', userId)

        console.log(`[paystack-webhook] Activated subscription for user ${userId}`)
        break
      }

      case 'subscription.create': {
        // Subscription plan created/assigned
        await db.from('profiles').update({
          paystack_subscription_code: data.subscription_code,
          paystack_email_token: data.email_token,
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        break
      }

      case 'subscription.not_renew':
      case 'subscription.disable': {
        // Subscription cancelled or disabled
        await db.from('profiles').update({
          subscription_status: eventType === 'subscription.disable' ? 'expired' : 'cancelled',
          ai_messages_limit: 5, // Revert to free tier
          updated_at: new Date().toISOString(),
        }).eq('id', userId)

        console.log(`[paystack-webhook] Subscription ${eventType} for user ${userId}`)
        break
      }

      case 'invoice.payment_failed': {
        // Payment failed — mark as past_due
        await db.from('profiles').update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('id', userId)

        console.log(`[paystack-webhook] Payment failed for user ${userId}`)
        break
      }

      default:
        console.log(`[paystack-webhook] Unhandled event: ${eventType}`)
    }

    // Always return 200 to acknowledge webhook
    return jsonResponse({ received: true })
  } catch (err) {
    console.error('[paystack-webhook] Error:', err.message)
    // Return 200 even on error to prevent Paystack retries
    return jsonResponse({ received: true, error: err.message })
  }
})
