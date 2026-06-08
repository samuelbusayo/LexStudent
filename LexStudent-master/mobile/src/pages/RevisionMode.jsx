import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useStreak, useKnowledgeGaps } from '../hooks/useProgress'
import { getSummaries } from '../services/db'
import StreakHero from '../components/revision/StreakHero'
import KnowledgeGapCard from '../components/revision/KnowledgeGapCard'
import Heatmap from '../components/revision/Heatmap'

export default function RevisionMode() {
  const { data: streak } = useStreak()
  const { data: gaps } = useKnowledgeGaps()
  const navigate = useNavigate()
  const { data: summaries } = useQuery({
    queryKey: ['summaries'],
    queryFn: getSummaries,
  })

  const gapCount = (gaps || []).length

  return (
    <div className="space-y-5">
      {/* Streak */}
      <StreakHero streak={streak} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/revision/session')}
          disabled={gapCount === 0}
          className="card p-4 text-center active:scale-[0.97] transition-transform disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-2xl text-secondary mb-1 block">psychology</span>
          <p className="text-xs font-semibold text-primary">Flashcard Review</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">{gapCount} topics</p>
        </button>
        <button
          onClick={() => navigate('/revision/quiz')}
          className="card p-4 text-center active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-2xl text-secondary mb-1 block">quiz</span>
          <p className="text-xs font-semibold text-primary">Take a Quiz</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">MCQ practice</p>
        </button>
      </div>

      {/* Knowledge Gaps */}
      <section className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-serif text-base font-semibold text-primary">Knowledge Gaps</h3>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            {gapCount > 0 ? `${gapCount} to review` : 'All caught up'}
          </span>
        </div>
        {gapCount === 0 ? (
          <p className="text-xs text-on-surface-variant text-center py-4">
            No gaps detected. Keep up the great work!
          </p>
        ) : (
          <div className="space-y-2">
            {(gaps || []).slice(0, 6).map(gap => (
              <KnowledgeGapCard key={gap.id} gap={gap} />
            ))}
            {gapCount > 6 && (
              <p className="text-center text-xs text-on-surface-variant pt-1">
                +{gapCount - 6} more topics
              </p>
            )}
          </div>
        )}
      </section>

      {/* Heatmap */}
      <Heatmap />

      {/* Summaries */}
      {(summaries || []).length > 0 && (
        <section>
          <h3 className="font-serif text-base font-semibold text-primary mb-3">Your Notes</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {(summaries || []).map(s => (
              <div key={s.topicId} className="card p-3 min-w-[200px] flex-shrink-0">
                <p className="text-[10px] font-bold text-secondary uppercase">{s.courseName}</p>
                <p className="text-xs font-semibold text-primary mt-0.5 truncate">{s.topicName}</p>
                <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">{s.summaryBody}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-primary text-on-primary rounded-xl p-5 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <span className="material-symbols-outlined text-[60px]">menu_book</span>
        </div>
        <h2 className="font-serif text-lg font-semibold relative z-10">Ready to Review?</h2>
        <p className="text-sm text-on-primary/70 mt-1 relative z-10">
          {gapCount} topic{gapCount !== 1 ? 's' : ''} identified for review
        </p>
        <button
          onClick={() => navigate('/revision/session')}
          disabled={gapCount === 0}
          className="mt-3 bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-transform disabled:opacity-50 relative z-10"
        >
          Start Session
        </button>
      </section>
    </div>
  )
}
