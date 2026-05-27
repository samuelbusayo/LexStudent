import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30">
        <div className="text-center mb-stack-lg">
          <h1 className="font-h1 text-h1 text-primary mb-unit">LexScholar</h1>
          <p className="font-body-md text-on-surface-variant">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
              className="w-full px-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full px-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password"
              className="w-full px-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          {error && <p className="font-body-md text-error flex items-center gap-2"><span className="material-symbols-outlined text-lg">error</span>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 font-button text-button bg-primary-container text-white rounded-xl hover:brightness-110 disabled:opacity-50 transition-all">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center font-body-md text-on-surface-variant">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
