import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30">
        <div className="text-center mb-stack-lg">
          <h1 className="font-h1 text-h1 text-primary mb-unit">LexScholar</h1>
          <p className="font-body-md text-on-surface-variant">Juris Doctor Program</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">mail</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">lock</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
          </div>
          {error && (
            <p className="font-body-md text-error flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>{error}
            </p>
          )}
          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 font-button text-button bg-primary-container text-white rounded-xl hover:brightness-110 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
          </button>
          <p className="text-center font-body-md text-on-surface-variant">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-semibold">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
