import { useState } from 'react'
import { useCases, useBookmark } from '../hooks/useCases'
import { useQuote } from '../hooks/useBadges'

export default function CasesLibrary() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | bookmarked
  const { data: casesData } = useCases()
  const { data: quote } = useQuote()
  const bookmark = useBookmark()

  const allCases = casesData || []
  const filtered = allCases.filter(c => {
    const matchesSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.citation?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'bookmarked' && c.bookmarked)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-h1 text-3xl text-primary">Case Library</h1>
        <p className="font-body-md text-on-surface-variant mt-1">{allCases.length} authorities saved</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
        <input
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full pl-12 pr-4 py-3 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
          placeholder="Search cases, citations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`pill text-[11px] transition-colors ${filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}
        >
          All Cases
        </button>
        <button
          onClick={() => setFilter('bookmarked')}
          className={`pill text-[11px] transition-colors ${filter === 'bookmarked' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-xs mr-1">bookmark</span>
          Bookmarked
        </button>
      </div>

      {/* Quote of the Day */}
      {quote && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 border-l-4 border-l-secondary">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">lightbulb</span>
            <div>
              <p className="font-label-caps text-label-caps text-secondary mb-1.5 tracking-widest">PRINCIPLE OF THE DAY</p>
              <p className="font-body-md text-on-surface italic leading-relaxed">"{quote.text}"</p>
              <p className="text-xs text-on-surface-variant mt-1.5">— {quote.author}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cases List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
          <p className="font-body-md">No cases found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const tags = Array.isArray(c.tags) ? c.tags : (typeof c.tags === 'string' ? JSON.parse(c.tags || '[]') : [])
            return (
              <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 active:bg-surface-container-low transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-label-caps text-label-caps text-secondary tracking-widest">{c.year}</span>
                      {tags.map((tag, i) => (
                        <span key={i} className="bg-primary-container/5 text-primary-container px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase">{tag}</span>
                      ))}
                    </div>
                    <h4 className="font-h3 text-base text-primary">{c.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{c.citation}</p>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">{c.description}</p>
                  </div>
                  <button
                    onClick={() => bookmark.mutate?.(c.id)}
                    className="flex-shrink-0 p-2 rounded-full active:bg-surface-container transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: c.bookmarked ? "'FILL' 1" : "'FILL' 0", color: c.bookmarked ? '#735c00' : '#74777f' }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
