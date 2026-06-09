import { Link, useNavigate } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import { useOverallProgress, useRecentProgress } from '../hooks/useProgress'
import { useMilestone, useBadges } from '../hooks/useBadges'

export default function Dashboard() {
  const navigate = useNavigate()
  const { courses, isLoading: coursesLoading } = useCourses()
  const { data: overallProgress, isLoading: overallLoading } = useOverallProgress()
  const { data: recentItems, isLoading: recentLoading } = useRecentProgress()
  const { data: milestone, isLoading: milestoneLoading } = useMilestone()
  const { data: badges, isLoading: badgesLoading } = useBadges()

  const isLoading = coursesLoading || overallLoading || milestoneLoading || badgesLoading || recentLoading

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-48 rounded-2xl" />
        <div className="skeleton h-6 w-40 rounded" />
        <div className="skeleton h-20 rounded-2xl" />
        <div className="skeleton h-20 rounded-2xl" />
        <div className="skeleton h-20 rounded-2xl" />
      </div>
    )
  }

  const coursesArr = courses || []
  const badgesArr = badges || []
  const earnedBadges = badgesArr.filter(b => b.earned)
  const overallPct = overallProgress?.overall ?? 0

  // Status dot helper
  const statusDot = (type) => {
    if (type === 'READ' || type === 'completed') return 'bg-green-600'
    if (type === 'PENDING' || type === 'pending') return 'bg-gray-400'
    return 'border-2 border-gray-400 bg-transparent'
  }
  const statusLabel = (type) => {
    if (type === 'READ' || type === 'completed') return 'READ'
    if (type === 'PENDING' || type === 'pending') return 'PENDING'
    return 'UPCOMING'
  }

  return (
    <div className="space-y-6">
      {/* Milestone Card — cream/beige bg, centered */}
      <section className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/20 shadow-sm">
        {milestone ? (
          <>
            <p className="font-label-caps text-label-caps text-secondary tracking-widest">UPCOMING MILESTONE</p>
            <h2 className="font-h1 text-3xl text-primary mt-2">{milestone.title}</h2>
            <p className="font-body-md text-on-surface-variant mt-1">Intensive preparation phase active</p>
            <p className="font-h1 text-7xl text-primary mt-4 leading-none">{milestone.daysRemaining}</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-2 tracking-widest">DAYS REMAINING</p>
          </>
        ) : (
          <>
            <p className="font-label-caps text-label-caps text-secondary tracking-widest">NO MILESTONE SET</p>
            <h2 className="font-h1 text-3xl text-primary mt-2">Set a Goal</h2>
            <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed">
              Create a milestone to count down to Bar Finals, mock exams, or deadlines.
            </p>
            <Link to="/milestone" className="mt-6 inline-block px-8 py-3 bg-primary-container text-white rounded-xl font-button text-button active:scale-95 transition-transform">
              Set a New Milestone
            </Link>
          </>
        )}
      </section>

      {/* My Courses — single column list */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-h2 text-2xl text-primary">My Courses</h2>
          <span className="font-label-caps text-label-caps text-secondary tracking-widest">{overallPct}% TOTAL PROGRESS</span>
        </div>
        <div className="space-y-3">
          {coursesArr.map(course => {
            const pct = course.progressPercent ?? 0
            return (
              <Link
                to={`/courses/${course.id}`}
                key={course.id}
                className="block bg-surface-container-lowest rounded-2xl px-5 py-4 border border-outline-variant/20 active:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-h3 text-lg text-primary">{course.name}</h4>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary-container/8 rounded text-[10px] font-bold text-primary-container tracking-widest uppercase">
                      {course.type || 'CORE'}
                    </span>
                  </div>
                  <span className="font-label-caps text-label-caps text-secondary whitespace-nowrap">
                    {course.completedTopics ?? 0}/{course.totalTopics ?? 0} TOPICS
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-3">
                  <div className="bg-secondary h-full transition-all duration-1000 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent Progress — status dots */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20">
        <h3 className="font-h3 text-xl text-primary mb-4">Recent Progress</h3>
        <div className="space-y-4">
          {(recentItems || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${statusDot(item.type)}`} />
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">{statusLabel(item.type)}</p>
                <p className="font-body-md text-on-surface font-medium">{item.title}</p>
              </div>
            </div>
          ))}
          {(!recentItems || recentItems.length === 0) && (
            <p className="font-body-md text-on-surface-variant">No recent activity yet.</p>
          )}
        </div>
        <button
          onClick={() => navigate('/revision')}
          className="w-full mt-5 py-3 bg-primary text-on-primary rounded-xl font-button text-button text-center active:scale-[0.98] transition-transform"
        >
          View Study History
        </button>
      </section>

      {/* Badges */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-h3 text-xl text-primary">Badges</h3>
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
        </div>
        <div className="flex gap-3">
          {earnedBadges.slice(0, 4).map(badge => (
            <div key={badge.id} className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {badge.icon}
              </span>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - earnedBadges.length) }).map((_, i) => (
            <div key={`locked-${i}`} className="w-12 h-12 rounded-full border-2 border-dashed border-outline-variant/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-outline-variant text-sm">lock</span>
            </div>
          ))}
        </div>
      </section>

      {/* New Study Session CTA */}
      <button
        onClick={() => navigate('/revision')}
        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-button text-button text-center flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
      >
        <span className="material-symbols-outlined text-xl">add</span>
        New Study Session
      </button>
    </div>
  )
}
