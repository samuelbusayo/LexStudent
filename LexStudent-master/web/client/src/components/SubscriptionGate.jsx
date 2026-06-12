import useSubscription from '../hooks/useSubscription'

/**
 * Wraps premium features. Shows upgrade prompt if user isn't premium.
 *
 * Usage:
 *   <SubscriptionGate feature="AI Chat">
 *     <AiChatPanel ... />
 *   </SubscriptionGate>
 */
export default function SubscriptionGate({ children, feature = 'This feature' }) {
  const { isPremium, loading, status } = useSubscription()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        Loading...
      </div>
    )
  }

  if (isPremium) return children

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-amber-600 text-3xl">workspace_premium</span>
      </div>
      <h3 className="font-h3 text-lg text-on-surface mb-2">Premium Feature</h3>
      <p className="text-sm text-on-surface-variant mb-4">
        {feature} is available for Premium subscribers. Upgrade to unlock unlimited access.
      </p>
      {status === 'expired' && (
        <p className="text-xs text-error mb-3">Your subscription has expired. Renew to continue.</p>
      )}
      {status === 'cancelled' && (
        <p className="text-xs text-amber-600 mb-3">Your subscription was cancelled. Resubscribe to continue.</p>
      )}
      <a
        href="/subscription"
        className="px-6 py-3 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Upgrade to Premium
      </a>
      <p className="text-[10px] text-on-surface-variant mt-3">Starting at ₦1,500/month</p>
    </div>
  )
}
