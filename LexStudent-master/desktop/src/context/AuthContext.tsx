import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import api from '../services/api'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user: u, token } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(u)
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { user: u, token } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(u)
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
