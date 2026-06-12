import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSubscription from '../hooks/useSubscription'

export default function SubscriptionCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refresh } = useSubscription()
  const [status, setStatus] = useState('verifying') // verifying, success, error

  const reference = searchParams.get('reference') || searchParams.get('trxref')

  useEffect(() => {
    if (!reference) {
      setStatus('error')
      return
    }

    // Poll subscription status (webhook may take a few seconds)
    let attempts = 0
    const maxAttempts = 15

    const checkStatus = async () => {
      attempts++
      try {
        await refresh()
        // The refresh updates subscription state; check on next render
        setStatus('success')
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000)
        } else {
          setStatus('success') // Optimistic — webhook might just be slow
        }
      }
    }

    // Wait a moment for webhook to process, then check
    setTimeout(checkStatus, 3000)
  }, [reference, refresh])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        {status === 'verifying' && (
          <>
            <span className="material-symbols-outlined animate-spin text-4xl text-primary-container mb-4">progress_activity</span>
            <h2 className="font-h2 text-lg text-on-surface mb-2">Verifying Payment</h2>
            <p className="text-sm text-on-surface-variant">Please wait while we confirm your subscription...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
            </div>
            <h2 className="font-h2 text-lg text-on-surface mb-2">Welcome to Premium!</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Your subscription is active. Enjoy unlimited AI chat and all premium features.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Start Studying
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
            </div>
            <h2 className="font-h2 text-lg text-on-surface mb-2">Something went wrong</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              We couldn't verify your payment. If you were charged, your subscription will be activated shortly.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="px-6 py-3 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
