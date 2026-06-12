import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

const getLocalToken = () => localStorage.getItem('auth_token') || null
const getApiUrl = (path) => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  return `${base}${path}`
}

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
      // Try Supabase first
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data, error: fnError } = await supabase.functions.invoke('subscription-status', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (fnError) throw fnError
        setSubscription(data)
        setError(null)
        setLoading(false)
        return
      }

      // Fallback to local API
      const localToken = getLocalToken()
      if (localToken) {
        const res = await fetch(getApiUrl('/ai/subscription'), {
          headers: { Authorization: `Bearer ${localToken}` },
        })
        if (res.ok) {
          const data = await res.json()
          setSubscription({
            status: data.status || 'free',
            plan: data.plan || null,
            isPremium: data.isPremium || false,
            messagesUsed: data.messagesUsed || 0,
            messagesLimit: data.messagesLimit || 5,
            expiresAt: data.expiresAt || null,
            daysUntilReset: data.daysUntilReset || 30,
          })
          setError(null)
        }
      }
    } catch (err) {
      console.error('[useSubscription] Error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()

    // Refresh on window focus (user might have just completed payment)
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
