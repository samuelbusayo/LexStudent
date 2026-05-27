import { useState } from 'react'
import { useFeaturedCase, useTags } from '../hooks/useCases'
import { useQuote } from '../hooks/useBadges'

const staticCases = [
  { id: 1, icon: 'gavel', year: '1803', name: 'Marbury v Madison', citation: '5 U.S. (1 Cranch) 137', description: 'Established the principle of judicial review.', tags: ['Constitutional'] },
  { id: 2, icon: 'balance', year: '1897', name: 'Salomon v Salomon', citation: '[1897] AC 22', description: 'Upheld separate legal personality for companies.', tags: ['Company Law'] },
  { id: 3, icon: 'policy', year: '1966', name: 'Miranda v Arizona', citation: '384 U.S. 436', description: 'Specified Miranda rights for criminal suspects.', tags: ['Criminal'] },
]

export default function CasesLibrary() {
  const [search, setSearch] = useState('')
  const { data: featured } = useFeaturedCase()
  const { data: tags } = useTags()
  const { data: quote } = useQuote()

  return (
    <div className="max-w-7xl mx-auto space-y-stack-lg">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary font-body-md text-on-surface shadow-sm"
          placeholder="Search cases, legal principles, or citations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-button text-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>Save New Case
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-outline text-primary rounded-full font-button text-sm hover:bg-primary/5">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>Filters
        </button>
      </div>

      {/* Featured + Tags */}
      <div className="grid grid-cols-12 gap-4">
        {featured && (
          <div className="col-span-12 md:col-span-8 bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-white relative overflow-hidden">
            <span className="font-label-caps text-label-caps text-secondary-container mb-2 block">FEATURED CASE</span>
            <h2 className="font-h2 text-h2 mb-2">{featured.name}</h2>
            <p className="text-sm text-white/70 mb-3">{featured.citation} ({featured.year})</p>
            <p className="font-body-md text-white/80 leading-relaxed">{featured.description}</p>
          </div>
        )}

        <div className="col-span-12 md:col-span-4 space-y-4">
          {quote && (
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-secondary mb-2">PRINCIPLE OF THE DAY</p>
              <p className="font-body-md text-on-surface italic">{quote.text}</p>
              {quote.author && <p className="text-xs text-on-surface-variant mt-2">— {quote.author}</p>}
            </div>
          )}
          {tags && (
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-primary mb-2">SAVED TAGS</p>
              <div className="flex flex-wrap gap-1">
                {(tags || []).map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staticCases.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map((c) => (
          <div key={c.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">{c.icon}</span>
              <span className="text-xs text-on-surface-variant">{c.year}</span>
            </div>
            <h4 className="font-h3 text-h3 text-primary mb-1">{c.name}</h4>
            <p className="text-xs text-on-surface-variant mb-3">{c.citation}</p>
            <p className="font-body-md text-on-surface text-sm leading-relaxed">{c.description}</p>
            <div className="flex gap-1 mt-3">
              {c.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
