interface KnowledgeGapCardProps {
  gap: any
}

export default function KnowledgeGapCard({ gap }: KnowledgeGapCardProps) {
  const urgencyColor = gap.urgency === 'high'
    ? 'text-error border-error/20 bg-error/5'
    : gap.urgency === 'medium'
    ? 'text-secondary border-secondary/20 bg-secondary/5'
    : 'text-on-surface-variant border-outline-variant/20 bg-surface-container-low'

  return (
    <div className={`rounded-xl p-4 border ${urgencyColor} transition-shadow hover:shadow-sm`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-h3 text-h3 text-primary text-sm">{gap.topic}</h4>
        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
          gap.urgency === 'high' ? 'bg-error/10 text-error' :
          gap.urgency === 'medium' ? 'bg-secondary/10 text-secondary' :
          'bg-surface-container text-on-surface-variant'
        }`}>
          {gap.urgency || 'low'}
        </span>
      </div>

      <p className="text-xs text-on-surface-variant mb-3">{gap.description || gap.courseName}</p>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="text-on-surface-variant">Confidence</span>
          <span className="font-bold">{gap.confidence ?? 0}%</span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              (gap.confidence ?? 0) < 40 ? 'bg-error' : (gap.confidence ?? 0) < 70 ? 'bg-secondary' : 'bg-green-500'
            }`}
            style={{ width: `${gap.confidence ?? 0}%` }}
          />
        </div>
      </div>

      <button className="mt-3 w-full py-1.5 text-[10px] font-button bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors">
        Review Now
      </button>
    </div>
  )
}
