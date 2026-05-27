import { useStreak, useKnowledgeGaps } from '../hooks/useProgress'

export default function RevisionMode() {
  const { data: streak } = useStreak()
  const { data: gapsFromApi } = useKnowledgeGaps()

  const gaps = gapsFromApi || [
    { id: 1, subject: 'Evidence', topic: 'Hearsay Rule', progress: 25, lastReviewed: '4 days ago' },
    { id: 2, subject: 'Property Law', topic: 'Adverse Possession', progress: 33, lastReviewed: '1 week ago' },
    { id: 3, subject: 'Criminal Law', topic: 'Mens Rea', progress: 50, lastReviewed: '2 days ago' },
    { id: 4, subject: 'Constitutional', topic: 'Commerce Clause', progress: 20, lastReviewed: 'Unread' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-stack-lg">
      {/* Streak Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">local_fire_department</span>
        </div>
        <div className="relative z-10">
          <h2 className="font-h1 text-h1 mb-2">
            {streak?.streak || 0} Day Streak
          </h2>
          <p className="font-body-lg text-white/80">Keep up the momentum! Review your knowledge gaps below.</p>
        </div>
      </section>

      {/* Knowledge Gaps */}
      <div className="bg-white rounded-xl p-6 border border-outline-variant/30 space-y-stack-md">
        <div className="flex justify-between items-center">
          <h3 className="font-h2 text-primary-container">Knowledge Gaps</h3>
          <span className="text-label-caps text-on-surface-variant">Review Priority: High</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-sm">
          {gaps.map((gap: any) => (
            <div key={gap.id} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-full">{gap.subject}</span>
                <span className="text-[10px] text-on-surface-variant">{gap.lastReviewed}</span>
              </div>
              <h4 className="font-h3 text-h3 text-primary mb-3">{gap.topic}</h4>
              <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                <div className="bg-secondary h-full transition-all duration-700" style={{ width: `${gap.progress}%` }} />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{gap.progress}% mastered</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-primary-container rounded-2xl p-8 text-center space-y-stack-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">menu_book</span>
        </div>
        <h2 className="font-h1 text-white relative z-10">Ready to Review?</h2>
        <p className="text-white/80 font-body-lg max-w-md mx-auto relative z-10">You have {gaps.length} topics identified for your upcoming exams.</p>
        <button className="bg-secondary text-primary font-button px-stack-lg py-4 rounded-full relative z-10 hover:brightness-110 active:scale-95 transition-all">
          Start Revision Session
        </button>
      </section>
    </div>
  )
}
