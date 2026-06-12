import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBadges } from '../hooks/useBadges'

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

function BadgeTile({ badge }) {
  const isEarned = badge.earned === 1 || badge.earned === true
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
      isEarned
        ? 'bg-secondary-container/20 border-secondary/30'
        : 'bg-surface-container-lowest border-outline-variant/20 opacity-60'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isEarned ? 'bg-secondary-container/50' : 'bg-surface-container'
      }`}>
        <span
          className="material-symbols-outlined text-[22px] text-primary-container"
          style={isEarned ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {badge.icon}
        </span>
      </div>
      <p className="font-label-caps text-label-caps text-primary-container text-center leading-tight text-[10px]">
        {badge.name}
      </p>
      {isEarned && (
        <span className="text-[9px] font-bold bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full">
          Earned
        </span>
      )}
    </div>
  )
}

function CategoryCard({ category, badges, onOpen }) {
  const earned = badges.filter(b => b.earned === 1 || b.earned === true)
  const total = badges.length
  const percent = total > 0 ? Math.round((earned.length / total) * 100) : 0

  return (
    <button
      onClick={onOpen}
      className="text-left bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 active:scale-[0.97] transition-all w-full"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-container/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-[18px]">{category.icon}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-primary">{category.label}</p>
            <p className="text-[10px] text-on-surface-variant tabular-nums">
              <span className="font-bold text-primary">{earned.length}</span>/{total} earned
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant/40 text-[18px]">arrow_forward_ios</span>
      </div>

      <div className="h-1.5 bg-primary-container/10 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-secondary rounded-full" style={{ width: `${percent}%` }} />
      </div>

      {earned.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {earned.slice(0, 6).map(b => (
            <div key={b.id || b.code} title={b.name}
              className="w-6 h-6 rounded-md bg-secondary-container/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container text-[12px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
            </div>
          ))}
          {earned.length > 6 && (
            <div className="w-6 h-6 rounded-md bg-primary-container/5 flex items-center justify-center text-[9px] font-bold text-primary-container">
              +{earned.length - 6}
            </div>
          )}
        </div>
      )}
    </button>
  )
}

export default function Badges() {
  const { data: badges, isLoading } = useBadges()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const grouped = useMemo(() => {
    if (!badges) return {}
    const out = Object.fromEntries(CATEGORIES.map(c => [c.id, []]))
    for (const b of badges) {
      const cat = b.category || 'special'
      if (out[cat]) out[cat].push(b)
      else out['special'].push(b)
    }
    return out
  }, [badges])

  const stats = useMemo(() => {
    if (!badges) return { earned: 0, total: 0, percent: 0 }
    const earned = badges.filter(b => b.earned === 1 || b.earned === true).length
    const total = badges.length
    return { earned, total, percent: total ? Math.round((earned / total) * 100) : 0 }
  }, [badges])

  const recentlyEarned = useMemo(() => {
    if (!badges) return []
    return badges.filter(b => b.earned === 1 || b.earned === true).slice(0, 3)
  }, [badges])

  if (isLoading) {
    return (
      <div className="space-y-stack-md">
        <div className="skeleton h-10 w-1/2 rounded" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    )
  }

  const filtered = activeTab === 'all' ? [] : (grouped[activeTab] || [])

  return (
    <div className="space-y-5">
      {/* Header */}
      <section>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-on-surface-variant text-sm mb-3 active:opacity-60">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-h1 text-h1 text-primary-container">Badges</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {stats.earned} of {stats.total} earned · {stats.percent}%
            </p>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                className="text-primary-container/10" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                strokeDasharray={`${stats.percent * 0.942} 100`} strokeLinecap="round"
                className="text-secondary transition-all" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-primary-container">
              {stats.percent}%
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {TABS.map(tab => {
          const active = activeTab === tab.id
          const count = tab.id === 'all' ? (badges?.length || 0) : (grouped[tab.id] || []).length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-primary-container text-white'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
              {tab.label}
              <span className={`text-[9px] font-bold tabular-nums ${active ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {activeTab === 'all' ? (
        <>
          {/* Recent unlocks */}
          {recentlyEarned.length > 0 && (
            <section className="bg-gradient-to-br from-primary-container to-primary rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-container mb-3">
                Recent Unlocks
              </p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {recentlyEarned.map(b => (
                  <div key={b.id || b.code} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-container text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                    </div>
                    <p className="text-[9px] text-white/80 text-center leading-tight">{b.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Category overview */}
          <section className="space-y-3">
            <h2 className="font-semibold text-primary text-base">By Category</h2>
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                badges={grouped[cat.id] || []}
                onOpen={() => setActiveTab(cat.id)}
              />
            ))}
          </section>
        </>
      ) : (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary-container">
              {TABS.find(t => t.id === activeTab)?.icon}
            </span>
            <h2 className="font-semibold text-primary">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <span className="text-xs text-on-surface-variant">
              · {filtered.filter(b => b.earned === 1 || b.earned === true).length}/{filtered.length} earned
            </span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-on-surface-variant py-8">No badges in this category yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map(b => <BadgeTile key={b.id || b.code} badge={b} />)}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
