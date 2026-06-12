import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabase'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  supabaseReady: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }

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
  const syncSupabaseAuth = useCallback(async (email: string, password: string, name?: string) => {
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
    } catch (e: any) {
      console.warn('[auth] Supabase sync error:', e.message)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user: u, token } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(u)

      // Sync Supabase (non-blocking)
      syncSupabaseAuth(email, password, u.name)
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }, [syncSupabaseAuth])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { user: u, token } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(u)

      // Create Supabase account (non-blocking)
      syncSupabaseAuth(email, password, name)
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed'
      setError(message)
      throw new Error(message)
    }
  }, [syncSupabaseAuth])

  const logout = useCallback(async () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setError(null)
    try { await supabase.auth.signOut() } catch {}
    setSupabaseReady(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error, supabaseReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
