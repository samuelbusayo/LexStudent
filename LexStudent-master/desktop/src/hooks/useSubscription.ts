import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

interface SubscriptionState {
  status: string
  plan: string | null
  isPremium: boolean
  isSuperuser?: boolean
  messagesUsed: number
  messagesLimit: number
  expiresAt: string | null
  daysUntilReset: number
}

export default function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    status: 'free',
    plan: null,
    isPremium: false,
    messagesUsed: 0,
    messagesLimit: 5,
    expiresAt: null,
    daysUntilReset: 30,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const { data, error: fnError } = await supabase.functions.invoke('subscription-status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (fnError) throw fnError
      setSubscription(data as SubscriptionState)
      setError(null)
    } catch (err: any) {
      console.error('[useSubscription] Error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const onFocus = () => fetchStatus()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchStatus])

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchStatus()
  }, [fetchStatus])

  return {
    ...subscription,
    loading,
    error,
    refresh,
  }
}
