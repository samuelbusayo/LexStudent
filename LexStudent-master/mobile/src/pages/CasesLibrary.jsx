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
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-serif text-xl font-semibold text-primary">Case Library</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">{allCases.length} authorities saved</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        <input
          className="input-field pl-10 !rounded-lg !text-sm"
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
        <div className="card p-4 border-l-4 border-secondary">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">PRINCIPLE OF THE DAY</p>
          <p className="text-sm text-on-surface italic leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-on-surface-variant mt-1.5">— {quote.author}</p>
        </div>
      )}

      {/* Cases List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
          <p className="text-sm">No cases found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => {
            const tags = Array.isArray(c.tags) ? c.tags : []
            return (
              <div key={c.id} className="card p-4 active:bg-surface-container-low transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-secondary">{c.year}</span>
                      {tags.map((tag, i) => (
                        <span key={i} className="pill bg-primary/8 text-primary text-[9px]">{tag}</span>
                      ))}
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-primary">{c.name}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{c.citation}</p>
                    <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">{c.description}</p>
                  </div>
                  <button
                    onClick={() => bookmark.mutate?.(c.id)}
                    className="flex-shrink-0 p-1.5 rounded-full active:bg-surface-container transition-colors"
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
