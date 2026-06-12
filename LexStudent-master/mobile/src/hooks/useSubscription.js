import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export default function useSubscription() {
  const [subscription, setSubscription] = useState({
    status: 'free',
    plan: null,
    isPremium: false,
    messagesUsed: 0,
    messagesLimit: 5,
    expiresAt: null,
    daysUntilReset: 30,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      setSubscription(data)
      setError(null)
    } catch (err) {
      console.error('[useSubscription] Error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
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
