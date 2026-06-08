import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initDbConnection, getCurrentUser, loginUser, registerUser } from '../services/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize local database and auto-login the local user
    initDbConnection()
      .then(() => getCurrentUser())
      .then(u => { if (u) setUser(u) })
      .catch(err => console.error('DB init error', err))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const result = await loginUser(email, password)
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)
      return result.user
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setError(null)
    try {
      const result = await registerUser(name, email, password)
      localStorage.setItem('auth_token', result.token)
      setUser(result.user)
      return result.user
    } catch (err) {
      const message = err.message || 'Registration failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setError(null)
  }, [])

  const isAuthenticated = user !== null

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
