import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initDbConnection, getCurrentUser, loginUser, registerUser } from '../services/db'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    // Initialize local database and auto-login the local user
    initDbConnection()
      .then(() => getCurrentUser())
      .then(u => { if (u) setUser(u) })
      .catch(err => console.error('DB init error', err))
      .finally(() => setLoading(false))

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseReady(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseReady(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sync Supabase auth alongside local auth
  const syncSupabaseAuth = useCallback(async (email, password, name) => {
    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
      if (signInErr) {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || '' } },
        })
        if (signUpErr) console.warn('[auth] Supabase sync failed:', signUpErr.message)
      }
      setSupabaseReady(true)
    } catch (e) {
      console.warn('[auth] Supabase sync error:', e.message)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const result = await loginUser(email, password)
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)

      // Sync Supabase (non-blocking)
      syncSupabaseAuth(email, password, result.user?.name)

      return result.user
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }, [syncSupabaseAuth])

  const register = useCallback(async (name, email, password) => {
    setError(null)
    try {
      const result = await registerUser(name, email, password)
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)

      // Create Supabase account (non-blocking)
      syncSupabaseAuth(email, password, name)

      return result.user
    } catch (err) {
      const message = err.message || 'Registration failed'
      setError(message)
      throw new Error(message)
    }
  }, [syncSupabaseAuth])

  const logout = useCallback(async () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setError(null)
    try { await supabase.auth.signOut() } catch {}
    setSupabaseReady(false)
  }, [])

  const isAuthenticated = user !== null

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAuthenticated, supabaseReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
