import { Link } from 'react-router-dom'

interface CaseCardProps {
  caseItem: any
}

export default function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className="block bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 hover:shadow-md hover:border-secondary/40 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">gavel</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">{caseItem.area || 'General'}</span>
        </div>
        {caseItem.saved && (
          <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
        )}
      </div>

      <h4 className="font-h3 text-h3 text-primary mb-1 line-clamp-2">{caseItem.name}</h4>
      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">{caseItem.summary}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {(caseItem.tags || []).slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-medium">{tag}</span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-outline-variant/20 flex justify-between text-xs text-on-surface-variant">
        <span>{caseItem.year || 'N/A'}</span>
        <span>{caseItem.court || ''}</span>
      </div>
    </Link>
  )
}
