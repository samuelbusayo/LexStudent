import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('No email found. Please restart the reset process.')
      return
    }
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSuccess(true)
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1b1c1c] flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/30">
        <div className="text-center mb-stack-lg">
          <span className="material-symbols-outlined text-4xl text-primary dark:text-primary-fixed mb-unit">verified_user</span>
          <h1 className="font-h2 text-h2 text-primary dark:text-primary-fixed mb-unit">Enter Reset Code</h1>
          <p className="font-body-md text-on-surface-variant">A 6-digit code was sent to {email || 'your email'}</p>
        </div>
        {success ? (
          <div className="text-center space-y-stack-md">
            <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
            <p className="font-body-lg text-on-surface dark:text-on-primary-fixed">Password reset successful!</p>
            <p className="font-body-md text-on-surface-variant">Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Reset Code</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">key</span>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full pl-10 pr-4 py-2.5 font-body-md bg-surface-container-low dark:bg-surface-container-highest border border-outline-variant rounded-xl text-on-surface dark:text-on-primary-fixed placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-center tracking-[0.5em]"
                />
              </div>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">lock</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 font-body-md bg-surface-container-low dark:bg-surface-container-highest border border-outline-variant rounded-xl text-on-surface dark:text-on-primary-fixed placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-unit">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">lock</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
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
              Reset Password
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
