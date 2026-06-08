import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import { useOverallProgress } from '../hooks/useProgress'
import { useMilestone, useBadges } from '../hooks/useBadges'

export default function Dashboard() {
  const { courses, isLoading: coursesLoading } = useCourses()
  const { data: overallProgress, isLoading: overallLoading } = useOverallProgress()
  const { data: milestone, isLoading: milestoneLoading } = useMilestone()
  const { data: badges, isLoading: badgesLoading } = useBadges()

  const isLoading = coursesLoading || overallLoading || milestoneLoading || badgesLoading

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-36 rounded-xl" />
        <div className="skeleton h-20 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  const coursesArr = courses || []
  const badgesArr = badges || []
  const earnedBadges = badgesArr.filter(b => b.earned)

  return (
    <div className="space-y-5">
      {/* Milestone Card */}
      <section className="bg-primary text-on-primary p-5 rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {milestone ? 'flag' : 'add_circle'}
          </span>
        </div>
        {milestone ? (
          <>
            <p className="text-[10px] font-bold tracking-widest text-secondary-fixed uppercase">UPCOMING MILESTONE</p>
            <h3 className="font-serif text-xl font-semibold mt-1">{milestone.title}</h3>
            <div className="flex items-end justify-between mt-3">
              <span className="text-4xl font-serif font-bold">{milestone.daysRemaining}</span>
              <span className="text-sm opacity-80 pb-0.5">
                {milestone.daysRemaining === 1 ? 'Day Left' : 'Days Left'}
              </span>
            </div>
            <div className="w-full bg-on-primary/10 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary-fixed h-full transition-all duration-1000" style={{ width: `${overallProgress?.overall ?? 0}%` }} />
            </div>
            <Link to="/milestone" className="mt-4 w-full py-2.5 bg-secondary-container text-on-secondary-container rounded-lg font-semibold text-sm block text-center active:scale-[0.98] transition-transform">
              Edit Milestone
            </Link>
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-widest text-secondary-fixed uppercase">NO MILESTONE SET</p>
            <h3 className="font-serif text-xl font-semibold mt-1">Set a Goal</h3>
            <p className="text-sm text-on-primary/70 mt-2 leading-relaxed">
              Create a milestone to count down to Bar Finals, mock exams, or deadlines.
            </p>
            <Link to="/milestone" className="mt-4 w-full py-2.5 bg-secondary-container text-on-secondary-container rounded-lg font-semibold text-sm block text-center active:scale-[0.98] transition-transform">
              Set a New Milestone
            </Link>
          </>
        )}
      </section>

      {/* Overall Progress */}
      <section className="card p-4 flex items-center gap-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4" className="text-surface-container-high" />
            <circle cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4"
              strokeDasharray="175.9"
              strokeDashoffset={(1 - (overallProgress?.overall ?? 0) / 100) * 175.9}
              className="text-secondary"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {overallProgress?.overall ?? 0}%
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-on-surface">Overall Progress</p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {overallProgress?.courses?.reduce((s, c) => s + (c.completedTopics || 0), 0)}/
            {overallProgress?.courses?.reduce((s, c) => s + (c.totalTopics || 0), 0)} topics completed
          </p>
        </div>
      </section>

      {/* My Courses */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-primary">My Courses</h2>
          <Link to="/planner" className="text-xs font-semibold text-primary flex items-center gap-0.5">
            View All <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {coursesArr.map((course, index) => {
            const isLastOdd = coursesArr.length % 2 !== 0 && index === coursesArr.length - 1
            return (
              <Link
                to={`/courses/${course.id}`}
                key={course.id || index}
                className={`card p-3.5 active:scale-[0.97] transition-transform ${isLastOdd ? 'col-span-2' : ''}`}
              >
                <span className="pill bg-primary/10 text-primary text-[9px] mb-2">
                  {course.type || 'CORE'}
                </span>
                <h4 className="font-serif text-sm font-semibold text-primary leading-tight mt-1">
                  {course.name}
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {course.completedTopics ?? 0}/{course.totalTopics ?? 0} Topics
                </p>
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] font-bold text-primary mb-1">
                    <span>Progress</span>
                    <span>{course.progressPercent ?? 0}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${course.progressPercent ?? 0}%` }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent Progress */}
      {overallProgress?.courses?.filter(c => c.totalTopics > 0).length > 0 && (
        <section className="card p-4">
          <h3 className="font-serif text-base font-semibold text-primary mb-3">Recent Progress</h3>
          <div className="space-y-3">
            {overallProgress.courses.filter(c => c.totalTopics > 0).slice(0, 3).map(c => (
              <div key={c.courseId}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-semibold text-on-surface truncate mr-2">{c.courseName}</p>
                  <span className="text-[11px] font-bold text-secondary flex-shrink-0">{c.progressPercent}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${c.progressPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Badges */}
      <section className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-serif text-base font-semibold text-primary">Badges</h3>
          <Link to="/badges" className="text-xs font-semibold text-secondary">
            {earnedBadges.length} Earned
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {earnedBadges.slice(0, 4).map(badge => (
            <div key={badge.id} className="aspect-square rounded-lg bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {badge.icon}
              </span>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - earnedBadges.length) }).map((_, i) => (
            <div key={`locked-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-outline-variant/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-outline-variant text-sm">lock</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
