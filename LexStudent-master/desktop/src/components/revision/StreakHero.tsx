interface StreakHeroProps {
  streak: number
  bestStreak?: number
}

export default function StreakHero({ streak, bestStreak = 0 }: StreakHeroProps) {
  return (
    <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
      </div>
      <div className="relative z-10">
        <span className="text-[10px] font-bold tracking-wider bg-secondary-fixed/20 px-2 py-0.5 rounded text-secondary-fixed">
          STUDY STREAK
        </span>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-6xl font-h1 leading-none">{streak}</span>
          <span className="text-lg text-white/60 pb-1">{streak === 1 ? 'day' : 'days'}</span>
        </div>
        <p className="text-sm text-white/60 mt-2">
          {streak > 0 ? "Keep it going! You're building great study habits." : "Start studying to begin your streak!"}
        </p>
        {bestStreak > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
            <span className="material-symbols-outlined text-[14px]">emoji_events</span>
            Personal best: {bestStreak} days
          </div>
        )}
      </div>
    </div>
  )
}
