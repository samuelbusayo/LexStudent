import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code.trim()) return setError('Please enter the reset code')
    if (code.trim().length < 6) return setError('Reset code must be 6 digits')
    if (!password) return setError('Please enter a new password')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    if (password !== confirmPassword) return setError('Passwords do not match')

    setSuccess(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30">
        <div className="text-center mb-stack-lg">
          <span className="material-symbols-outlined text-4xl text-primary mb-unit">password</span>
          <h1 className="font-h2 text-h2 text-primary mb-unit">New Password</h1>
          <p className="font-body-md text-on-surface-variant">
            Enter the code sent to {emailParam || 'your email'}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-stack-md">
            <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
            <p className="font-body-lg text-on-surface">Password reset successfully!</p>
            <p className="font-body-md text-on-surface-variant">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Reset Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-center tracking-[0.5em] text-lg placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-2.5 font-body-md bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
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
              Reset Password
            </button>

            <p className="text-center">
              <Link to="/login" className="font-body-md text-primary hover:underline">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
