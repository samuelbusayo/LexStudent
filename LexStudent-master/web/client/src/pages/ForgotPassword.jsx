import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setSent(true)
    setTimeout(() => navigate('/reset-password?email=' + encodeURIComponent(email.trim())), 1500)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1b1c1c] flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/30">
        <div className="text-center mb-stack-lg">
          <span className="material-symbols-outlined text-4xl text-primary dark:text-primary-fixed mb-unit">lock_reset</span>
          <h1 className="font-h2 text-h2 text-primary dark:text-primary-fixed mb-unit">Reset Password</h1>
          <p className="font-body-md text-on-surface-variant">Enter your email to receive a reset code</p>
        </div>
        {sent ? (
          <div className="text-center space-y-stack-md">
            <span className="material-symbols-outlined text-5xl text-secondary">mark_email_read</span>
            <p className="font-body-lg text-on-surface dark:text-on-primary-fixed">Check your email for a 6-digit reset code</p>
            <p className="font-body-md text-on-surface-variant">Redirecting to reset page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 font-body-md bg-surface-container-low dark:bg-surface-container-highest border border-outline-variant rounded-xl text-on-surface dark:text-on-primary-fixed placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
            {error && (
              <p className="font-body-md text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 font-button text-button bg-primary-container text-white rounded-xl hover:brightness-110 active:brightness-90 transition-all duration-200"
            >
              Send Reset Code
            </button>
            <p className="text-center">
              <Link to="/login" className="font-body-md text-primary dark:text-primary-fixed hover:underline">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
