import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function PaystackCheckout({ onSuccess, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const plans = {
    monthly: { label: 'Monthly', price: '₦1,500', period: '/month', savings: null },
    yearly: { label: 'Yearly', price: '₦12,000', period: '/year', savings: 'Save 33%' },
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Please sign in first')

      const callbackUrl = `${window.location.origin}/subscription/callback`

      const { data, error: fnErr } = await supabase.functions.invoke('paystack-init', {
        body: { plan: selectedPlan, callbackUrl },
      })

      if (fnErr) throw fnErr
      if (data?.error) throw new Error(data.error)

      // Redirect to Paystack checkout
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <span className="material-symbols-outlined text-primary-container text-4xl mb-2">workspace_premium</span>
        <h2 className="font-h2 text-xl text-on-surface mb-1">Upgrade to Premium</h2>
        <p className="text-sm text-on-surface-variant">Unlock unlimited AI chat and advanced features</p>
      </div>

      {/* Plan selection */}
      <div className="space-y-3 mb-6">
        {Object.entries(plans).map(([key, plan]) => (
          <button
            key={key}
            onClick={() => setSelectedPlan(key)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              selectedPlan === key
                ? 'border-primary-container bg-primary-container/5'
                : 'border-outline-variant/30 hover:border-outline-variant/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === key ? 'border-primary-container' : 'border-outline-variant'
              }`}>
                {selectedPlan === key && (
                  <div className="w-3 h-3 rounded-full bg-primary-container" />
                )}
              </div>
              <div className="text-left">
                <span className="font-bold text-sm text-on-surface">{plan.label}</span>
                {plan.savings && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                    {plan.savings}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-on-surface">{plan.price}</span>
              <span className="text-xs text-on-surface-variant">{plan.period}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Features list */}
      <div className="bg-surface-container rounded-xl p-4 mb-6">
        <p className="text-xs font-bold text-on-surface-variant mb-2">Premium includes:</p>
        <ul className="space-y-1.5">
          {[
            'Unlimited AI chat messages',
            'Live lecture recording (Desktop)',
            'Priority response speed',
            'Advanced study insights',
          ].map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-on-surface">
              <span className="material-symbols-outlined text-green-600 text-[14px]">check_circle</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="text-xs text-error bg-error-container/20 rounded-lg px-3 py-2 mb-4 border border-error/20">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            Processing...
          </>
        ) : (
          <>
            Pay {plans[selectedPlan].price}{plans[selectedPlan].period}
          </>
        )}
      </button>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-on-surface-variant text-sm hover:text-on-surface transition-colors"
        >
          Maybe later
        </button>
      )}

      <p className="text-[10px] text-center text-on-surface-variant mt-4">
        Secure payment powered by Paystack. Cancel anytime.
      </p>
    </div>
  )
}
