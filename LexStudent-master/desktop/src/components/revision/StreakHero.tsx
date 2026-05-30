interface StreakHeroProps {
  streak?: {
    streak?: number
    badge?: string
    ringPercent?: number
  }
}

export default function StreakHero({ streak }: StreakHeroProps) {
  const days = streak?.streak ?? 0
  const badge = streak?.badge ?? ''
  const ringPercent = streak?.ringPercent ?? 0

  const circumference = 2 * Math.PI * 40
  const offset = circumference - (ringPercent / 100) * circumference

  return (
    <section className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="font-label-caps text-secondary uppercase tracking-widest">Active Streak</p>
        <h2 className="font-h1 text-primary-container">{days} Days</h2>
        {badge && (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            <span className="text-body-md font-medium text-on-surface-variant">Badge: {badge}</span>
          </div>
        )}
      </div>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-primary-container/10" />
          <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-secondary transition-all" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-h3 text-primary-container">{ringPercent}%</span>
        </div>
      </div>
    </section>
  )
}
