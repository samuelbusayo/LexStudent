import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useStreak } from '../hooks/useProgress'
import { getSummaries } from '../services/db'
import StreakHero from '../components/revision/StreakHero'

export default function RevisionMode() {
  const { data: streak } = useStreak()
  const navigate = useNavigate()
  const { data: summaries } = useQuery({
    queryKey: ['summaries'],
    queryFn: getSummaries,
  })

  return (
    <div className="space-y-6">
      <StreakHero streak={streak} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/revision/session')}
          className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 text-center active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-2xl text-secondary mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <p className="font-button text-sm text-primary">Flashcard Review</p>
          <p className="font-label-caps text-[10px] text-on-surface-variant mt-0.5 tracking-widest">Study & review</p>
        </button>
        <button
          onClick={() => navigate('/revision/quiz')}
          className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 text-center active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-2xl text-secondary mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
          <p className="font-button text-sm text-primary">Take a Quiz</p>
          <p className="font-label-caps text-[10px] text-on-surface-variant mt-0.5 tracking-widest">MCQ practice</p>
        </button>
      </div>

      {/* Personal Summaries */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-h2 text-xl text-primary">Personal Summaries</h3>
          <button className="text-secondary font-button flex items-center gap-1 text-sm active:opacity-70">
            <span className="material-symbols-outlined text-[18px]">add</span>
            View All
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {(summaries || []).length === 0 ? (
            <p className="text-on-surface-variant font-body-md py-4">
              No notes yet. Start reading and add notes to see them here.
            </p>
          ) : (
            (summaries || []).map(s => (
              <div key={s.topicId} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 min-w-[200px] flex-shrink-0">
                <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{s.courseName}</p>
                <p className="font-h3 text-sm text-primary mt-0.5 truncate">{s.topicName}</p>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{s.summaryBody}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-container rounded-2xl p-8 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[80px]">menu_book</span>
        </div>
        <h2 className="font-h1 text-2xl text-white relative z-10">Ready to Review?</h2>
        <p className="text-white/70 font-body-md mt-2 relative z-10 leading-relaxed">
          Test your knowledge across your courses.
        </p>
        <button
          onClick={() => navigate('/revision/quiz')}
          className="mt-4 bg-secondary text-primary font-button px-8 py-3.5 rounded-full relative z-10 active:scale-95 transition-all"
        >
          Start Revision Session
        </button>
      </section>
    </div>
  )
}
