import { useState, useMemo } from 'react'
import { useBadges, useBadgeAchievements } from '../hooks/useBadges'

const CATEGORIES = [
  { id: 'reading',     label: 'Reading',     icon: 'auto_stories' },
  { id: 'consistency', label: 'Consistency', icon: 'local_fire_department' },
  { id: 'quiz',        label: 'Quiz',        icon: 'quiz' },
  { id: 'engagement',  label: 'Engagement',  icon: 'edit_note' },
  { id: 'ai_chat',     label: 'AI Chat',     icon: 'smart_toy' },
  { id: 'goals',       label: 'Goals',       icon: 'flag' },
  { id: 'special',     label: 'Bar Special', icon: 'gavel' },
]

const TABS = [{ id: 'all', label: 'All', icon: 'apps' }, ...CATEGORIES]

const ACHIEVEMENT_META: Record<string, { label: string; icon: string; suffix?: string }> = {
  totalPagesRead:    { label: 'Pages Read',      icon: 'menu_book' },
  totalQuizzes:      { label: 'Quizzes Taken',   icon: 'quiz' },
  avgQuizScore:      { label: 'Avg Quiz Score',  icon: 'percent', suffix: '%' },
  longestStreak:     { label: 'Longest Streak',  icon: 'local_fire_department', suffix: 'd' },
  highlightsCreated: { label: 'Highlights',      icon: 'highlight' },
  topicsCompleted:   { label: 'Topics Done',     icon: 'task_alt' },
  aiRequests:        { label: 'AI Requests',     icon: 'smart_toy' },
  daysActive:        { label: 'Days Active',     icon: 'calendar_today' },
}

function AchievementStrip({ data }: { data: any }) {
  if (!data) return null
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
      {Object.entries(ACHIEVEMENT_META).map(([key, meta]) => (
        <div key={key} className="bg-white rounded-xl p-3 border border-[#E0E0D0] text-center">
          <span className="material-symbols-outlined text-secondary text-xl block mb-1"
            style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
          <p className="font-bold text-primary-container text-lg tabular-nums leading-none">
            {data[key] ?? 0}{meta.suffix || ''}
          </p>
          <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">{meta.label}</p>
        </div>
      ))}
    </div>
  )
}

function BadgeCard({ badge }: { badge: any }) {
  const isEarned = badge.earned
  const percent = badge.percent || 0
  const radius = 20
  const circ = 2 * Math.PI * radius
  const dashOffset = circ - (percent / 100) * circ

  return (
    <div className={`rounded-2xl p-4 border transition-all ${
      isEarned
        ? 'bg-gradient-to-br from-secondary-container/30 to-white border-secondary/30'
        : 'bg-white border-[#E0E0D0] opacity-80'
    }`}>
      <div className="flex items-start gap-3">
        {!isEarned && badge.target > 1 ? (
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor"
                strokeWidth="3" className="text-primary-container/10" />
              <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor"
                strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dashOffset}
                strokeLinecap="round" className="text-secondary transition-all" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{badge.icon}</span>
            </div>
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isEarned ? 'bg-secondary-container/50' : 'bg-surface-container'
          }`}>
            <span className="material-symbols-outlined text-[22px] text-primary-container"
              style={isEarned ? { fontVariationSettings: "'FILL' 1" } : {}}>{badge.icon}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-primary-container text-sm">{badge.name}</p>
            {isEarned
              ? <span className="text-[10px] font-bold bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Earned</span>
              : percent >= 50
                ? <span className="text-[10px] font-bold bg-secondary-container/30 text-on-surface-variant px-2 py-0.5 rounded-full">Almost</span>
                : null
            }
          </div>
          <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">{badge.description}</p>
          {!isEarned && badge.target > 1 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex-1 h-1 bg-primary-container/10 rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-[10px] tabular-nums text-on-surface-variant">
                {badge.progress}/{badge.target}
              </span>
            </div>
          )}
          {isEarned && badge.earnedAt && (
            <p className="text-[10px] text-on-surface-variant mt-1">
              {new Date(badge.earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoryOverviewCard({ category, badges, onOpen }: { category: any; badges: any[]; onOpen: () => void }) {
  const earned = badges.filter((b: any) => b.earned)
  const total = badges.length
  const percent = total > 0 ? Math.round((earned.length / total) * 100) : 0
  const nextUp = badges.filter((b: any) => !b.earned).sort((a: any, b: any) => (b.percent || 0) - (a.percent || 0))[0]

  return (
    <button onClick={onOpen}
      className="text-left bg-white rounded-2xl p-5 border border-[#E0E0D0] hover:border-secondary/40 hover:shadow-md transition-all group w-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-container/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container">{category.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-base text-primary-container leading-tight">{category.label}</h3>
            <p className="text-xs text-on-surface-variant tabular-nums mt-0.5">
              <span className="font-bold text-primary-container">{earned.length}</span>
              <span className="opacity-60"> / {total} earned</span>
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary transition-all text-[20px]">
          arrow_forward
        </span>
      </div>
      <div className="h-1.5 bg-primary-container/10 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>
      {earned.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {earned.slice(0, 8).map((b: any) => (
            <div key={b.code} title={b.name}
              className="w-7 h-7 rounded-lg bg-secondary-container/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
            </div>
          ))}
          {earned.length > 8 && (
            <div className="w-7 h-7 rounded-lg bg-primary-container/5 flex items-center justify-center text-[10px] font-bold text-primary-container">
              +{earned.length - 8}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-3 text-xs text-on-surface-variant italic">No badges earned yet</div>
      )}
      {nextUp && (
        <div className="pt-3 border-t border-[#E0E0D0]">
          <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Next up</div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]">{nextUp.icon}</span>
            <span className="text-xs font-semibold text-primary-container truncate flex-1">{nextUp.name}</span>
            <span className="text-[10px] tabular-nums text-on-surface-variant flex-shrink-0">
              {nextUp.progress}/{nextUp.target}
            </span>
          </div>
        </div>
      )}
    </button>
  )
}

export default function Badges() {
  const [activeTab, setActiveTab] = useState('all')
  const { data: badges, isLoading } = useBadges()
  const { data: achievements } = useBadgeAchievements()

  const grouped = useMemo(() => {
    if (!badges) return {} as Record<string, any[]>
    const out: Record<string, any[]> = Object.fromEntries(CATEGORIES.map(c => [c.id, []]))
    for (const b of (badges as any[])) {
      if (out[b.category]) out[b.category].push(b)
    }
    return out
  }, [badges])

  const almostThere = useMemo(() => {
    if (!badges) return []
    return (badges as any[])
      .filter(b => !b.earned && b.percent >= 50)
      .sort((a, b) => (b.percent || 0) - (a.percent || 0))
      .slice(0, 3)
  }, [badges])

  const recentlyEarned = useMemo(() => {
    if (!badges) return []
    return (badges as any[])
      .filter(b => b.earned && b.earnedAt)
      .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
      .slice(0, 3)
  }, [badges])

  const stats = useMemo(() => {
    const total = (badges as any[])?.length || 0
    const earned = (badges as any[])?.filter(b => b.earned).length || 0
    return { total, earned, percent: total ? Math.round((earned / total) * 100) : 0 }
  }, [badges])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-5 pt-8">
        <div className="animate-pulse text-on-surface-variant py-20 text-center">Loading badges...</div>
      </div>
    )
  }

  const filteredCategoryBadges = activeTab === 'all' ? [] : (grouped[activeTab] || [])

  return (
    <div className="max-w-7xl mx-auto px-5 pt-6 space-y-6 pb-8">
      {/* HEADER */}
      <section className="flex justify-between items-end mb-2">
        <div>
          <h1 className="font-h1 text-h1 text-primary-container">Badges & Achievements</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {stats.earned} of {stats.total} earned · {stats.percent}% complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                className="text-primary-container/10" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                strokeDasharray={`${stats.percent * 0.942} 100`} strokeLinecap="round"
                className="text-secondary transition-all" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-primary-container">
              {stats.percent}%
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
        </div>
      </section>

      {/* ACHIEVEMENT STRIP */}
      <AchievementStrip data={achievements} />

      {/* CATEGORY TABS */}
      <section className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map(tab => {
          const active = activeTab === tab.id
          const count = tab.id === 'all'
            ? (badges as any[])?.length || 0
            : (grouped[tab.id] || []).length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-primary-container text-white'
                  : 'bg-white border border-[#E0E0D0] text-primary-container hover:bg-cream'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
              <span className={`ml-1 text-[10px] font-bold tabular-nums ${active ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </section>

      {activeTab === 'all' ? (
        <>
          {/* RECENT + ALMOST THERE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="bg-gradient-to-br from-primary-container to-primary text-white rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary-container">history</span>
                <h2 className="font-semibold text-white">Recent unlocks</h2>
              </div>
              {recentlyEarned.length === 0 ? (
                <p className="text-white/60 text-sm">No badges earned yet — start studying to unlock your first one.</p>
              ) : (
                <div className="space-y-2.5">
                  {recentlyEarned.map((b: any) => (
                    <div key={b.code} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary-container text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate text-sm">{b.name}</p>
                        <p className="text-[11px] text-white/60">
                          {new Date(b.earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-secondary-container/10 rounded-2xl p-5 border border-secondary-container/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
                <h2 className="font-semibold text-primary-container">Almost there</h2>
              </div>
              {almostThere.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No badges close to unlock yet. Keep going!</p>
              ) : (
                <div className="space-y-2.5">
                  {almostThere.map((b: any) => (
                    <div key={b.code} className="bg-white rounded-xl p-3 border border-[#E0E0D0]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-secondary text-[20px]">{b.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-primary-container truncate text-sm">{b.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-primary-container/10 rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: `${b.percent}%` }} />
                            </div>
                            <span className="text-[10px] font-bold tabular-nums text-on-surface-variant">{b.percent}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* CATEGORY OVERVIEW GRID */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-container">category</span>
              <h2 className="font-h2 text-primary-container">By category</h2>
              <span className="text-xs text-on-surface-variant">— click a card to see all badges</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <CategoryOverviewCard
                  key={cat.id}
                  category={cat}
                  badges={grouped[cat.id] || []}
                  onOpen={() => setActiveTab(cat.id)}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">
              {TABS.find(t => t.id === activeTab)?.icon}
            </span>
            <h2 className="font-h2 text-primary-container">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <span className="text-xs text-on-surface-variant">
              · {filteredCategoryBadges.filter((b: any) => b.earned).length} of {filteredCategoryBadges.length} earned
            </span>
          </div>
          {filteredCategoryBadges.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">No badges in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCategoryBadges.map((b: any) => <BadgeCard key={b.code} badge={b} />)}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
