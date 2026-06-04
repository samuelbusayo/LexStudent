import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useStreak, useKnowledgeGaps } from '../hooks/useProgress'
import api from '../services/api'
import StreakHero from '../components/revision/StreakHero'
import KnowledgeGapCard from '../components/revision/KnowledgeGapCard'
import Heatmap from '../components/revision/Heatmap'
import SummaryCard from '../components/revision/SummaryCard'

const COLLAPSED_LIMIT = 4

export default function RevisionMode() {
  const { data: streak } = useStreak()
  const { data: gaps } = useKnowledgeGaps()
  const navigate = useNavigate()
  const [showAllGaps, setShowAllGaps] = useState(false)
  const { data: summaries } = useQuery({
    queryKey: ['summaryFeed'],
    queryFn: () => api.get('/study-notes').then((r) => r.data),
  })

  const gapCount = ((gaps as any[]) || []).length
  const visibleGaps = showAllGaps ? ((gaps as any[]) || []) : ((gaps as any[]) || []).slice(0, COLLAPSED_LIMIT)
  const hasMore = gapCount > COLLAPSED_LIMIT

  return (
    <main className="px-5 py-6 max-w-7xl mx-auto space-y-8">
      <StreakHero streak={streak as any} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-outline-variant/30 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-h2 text-primary-container">Knowledge Gaps</h3>
            <span className="text-label-caps text-on-surface-variant">
              {gapCount > 0 ? `${gapCount} topic${gapCount !== 1 ? 's' : ''} to review` : 'All caught up!'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleGaps.map((gap: any) => (
              <KnowledgeGapCard key={gap.id} gap={gap} />
            ))}
            {gapCount === 0 && (
              <p className="col-span-2 text-center text-on-surface-variant font-body-md py-4">
                No knowledge gaps detected. Keep studying to maintain your progress!
              </p>
            )}
          </div>
          {hasMore && (
            <button
              onClick={() => setShowAllGaps(!showAllGaps)}
              className="w-full flex items-center justify-center gap-1 py-2 text-secondary font-button text-sm hover:underline transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showAllGaps ? 'expand_less' : 'expand_more'}
              </span>
              {showAllGaps ? 'Show Less' : `View All ${gapCount} Topics`}
            </button>
          )}
        </div>

        <Heatmap />
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-h2 text-primary-container">Personal Summaries</h3>
          <button className="text-secondary font-button flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px]">add</span>
            View All
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {((summaries as any[]) || []).length === 0 ? (
            <p className="text-on-surface-variant font-body-md py-4">No notes yet. Start reading and add notes to see them here.</p>
          ) : (
            ((summaries as any[]) || []).map((s: any) => (
              <SummaryCard key={s.topicId} summary={s} />
            ))
          )}
        </div>
      </section>

      <section className="bg-primary-container rounded-2xl p-8 text-center space-y-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">menu_book</span>
        </div>
        <h2 className="font-h1 text-white relative z-10">Ready to Review?</h2>
        <p className="text-white/80 font-body-lg max-w-md mx-auto relative z-10">
          Test your knowledge on about {gapCount} topic{gapCount !== 1 ? 's' : ''} across your courses.
        </p>
        <button
          onClick={() => navigate('/revision/quiz')}
          className="bg-secondary text-primary font-button px-8 py-4 rounded-full relative z-10 hover:brightness-110 active:scale-95 transition-all"
        >
          Start Revision Session
        </button>
      </section>
    </main>
  )
}
