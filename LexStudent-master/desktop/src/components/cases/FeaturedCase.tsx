import { Link } from 'react-router-dom'

interface FeaturedCaseProps {
  caseItem: any
}

export default function FeaturedCase({ caseItem }: FeaturedCaseProps) {
  if (!caseItem) return null

  return (
    <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>balance</span>
      </div>
      <div className="relative z-10">
        <span className="text-[10px] font-bold tracking-wider bg-secondary-fixed/20 px-2 py-0.5 rounded text-secondary-fixed">
          FEATURED CASE
        </span>
        <h3 className="font-h2 text-h2 mt-3 mb-2">{caseItem.name}</h3>
        <p className="text-sm text-white/70 mb-4 line-clamp-3">{caseItem.summary}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-xs text-white/60">
            <span className="material-symbols-outlined text-[14px]">calendar_month</span>
            {caseItem.year}
          </div>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <span className="material-symbols-outlined text-[14px]">apartment</span>
            {caseItem.court}
          </div>
        </div>

        <Link
          to={`/cases/${caseItem.id}`}
          className="inline-flex items-center gap-1 text-sm font-button text-secondary-fixed hover:underline"
        >
          Study this Case <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}
