import { useNavigate } from 'react-router-dom'
import useSubscription from '../hooks/useSubscription'
import PaystackCheckout from '../components/PaystackCheckout'

export default function Subscription() {
  const navigate = useNavigate()
  const { isPremium, status, plan, expiresAt, messagesUsed, messagesLimit, loading } = useSubscription()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-2xl text-on-surface-variant">progress_activity</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-h2 text-lg text-on-surface">Subscription</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto py-6 px-4">
        {isPremium ? (
          /* Active subscription view */
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-4xl">verified</span>
            </div>
            <h2 className="font-h2 text-xl text-on-surface mb-2">Premium Active</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              You have full access to all premium features.
            </p>

            <div className="bg-surface-container rounded-xl p-4 text-left space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Plan</span>
                <span className="font-bold text-on-surface capitalize">{plan || 'Premium'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Status</span>
                <span className="font-bold text-green-600 capitalize">{status}</span>
              </div>
              {expiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Renews on</span>
                  <span className="font-bold text-on-surface">
                    {new Date(expiresAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">AI messages used</span>
                <span className="font-bold text-on-surface">{messagesUsed} (unlimited)</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant">
              To manage your subscription, visit your Paystack dashboard or contact support.
            </p>
          </div>
        ) : (
          /* Upgrade view */
          <PaystackCheckout onClose={() => navigate(-1)} />
        )}
      </div>
    </div>
  )
}
