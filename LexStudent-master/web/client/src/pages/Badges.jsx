import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import BadgeCard from '../components/badges/BadgeCard'
import AchievementStrip from '../components/badges/AchievementStrip'
import CategoryOverviewCard from '../components/badges/CategoryOverviewCard'

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

export default function Badges() {
  const [activeTab, setActiveTab] = useState('all')

  const { data: badges, isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then(r => r.data),
  })
  const { data: achievements } = useQuery({
    queryKey: ['badges', 'achievements'],
    queryFn: () => api.get('/badges/achievements').then(r => r.data),
  })

  // Group badges by category once for the overview
  const grouped = useMemo(() => {
    if (!badges) return {}
    const out = Object.fromEntries(CATEGORIES.map(c => [c.id, []]))
    for (const b of badges) {
      if (out[b.category]) out[b.category].push(b)
    }
    return out
  }, [badges])

  // Top 3 closest-to-unlock across the whole catalogue
  const almostThere = useMemo(() => {
    if (!badges) return []
    return badges
      .filter(b => !b.earned && b.percent >= 50)
      .sort((a, b) => (b.percent || 0) - (a.percent || 0))
      .slice(0, 3)
  }, [badges])

  // Most recently earned
  const recentlyEarned = useMemo(() => {
    if (!badges) return []
    return badges
      .filter(b => b.earned && b.earnedAt)
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
      .slice(0, 3)
  }, [badges])

  const stats = useMemo(() => {
    const total = badges?.length || 0
    const earned = badges?.filter(b => b.earned).length || 0
    return { total, earned, percent: total ? Math.round((earned / total) * 100) : 0 }
  }, [badges])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-container-padding pt-stack-md">
        <div className="animate-pulse text-on-surface-variant py-20 text-center">Loading badges...</div>
      </div>
    )
  }

  const filteredCategoryBadges = activeTab === 'all' ? [] : (grouped[activeTab] || [])

  return (
    <div className="max-w-7xl mx-auto px-container-padding pt-stack-md space-y-stack-lg pb-stack-lg">
      {/* HEADER */}
      <section className="flex justify-between items-end mb-2">
        <div>
          <h1 className="font-h1 text-h1 text-primary-container">Badges & Achievements</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {stats.earned} of {stats.total} earned · {stats.percent}% complete
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
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

      {/* ACHIEVEMENTS STRIP */}
      <AchievementStrip data={achievements} />

      {/* CATEGORY TABS */}
      <section className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {TABS.map(tab => {
          const active = activeTab === tab.id
          const count = tab.id === 'all'
            ? badges.length
            : (grouped[tab.id] || []).length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-button transition-colors whitespace-nowrap ${
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
            {/* Recent unlocks */}
            <section className="bg-gradient-to-br from-primary-container to-primary text-white rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary-container">history</span>
                <h2 className="font-h3 text-white">Recent unlocks</h2>
              </div>
              {recentlyEarned.length === 0 ? (
                <p className="text-white/60 text-sm">No badges earned yet — start studying to unlock your first one.</p>
              ) : (
                <div className="space-y-2.5">
                  {recentlyEarned.map(b => (
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

            {/* Almost there */}
            <section className="bg-secondary-container/10 rounded-2xl p-5 border border-secondary-container/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
                <h2 className="font-h3 text-primary-container">Almost there</h2>
              </div>
              {almostThere.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No badges close to unlock yet. Keep going!</p>
              ) : (
                <div className="space-y-2.5">
                  {almostThere.map(b => (
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
              <span className="text-xs text-on-surface-variant">— tap a card to see all badges in that section</span>
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
        /* Category grid view */
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">
              {TABS.find(t => t.id === activeTab)?.icon}
            </span>
            <h2 className="font-h2 text-primary-container">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <span className="text-xs text-on-surface-variant">
              · {filteredCategoryBadges.filter(b => b.earned).length} of {filteredCategoryBadges.length} earned
            </span>
          </div>
          {filteredCategoryBadges.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              No badges in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCategoryBadges.map(b => <BadgeCard key={b.code} badge={b} />)}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
