import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { useOverallProgress, useRecentProgress } from '../hooks/useProgress';
import { useMilestone, useBadges } from '../hooks/useBadges';

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, isLoading: coursesLoading } = useCourses();
  const { data: overallProgress, isLoading: overallLoading } = useOverallProgress();
  const { data: recent, isLoading: recentLoading } = useRecentProgress();
  const { data: milestone, isLoading: milestoneLoading } = useMilestone();
  const { data: badges, isLoading: badgesLoading } = useBadges();

  const isLoading = coursesLoading || overallLoading || recentLoading || milestoneLoading || badgesLoading;

  if (isLoading) return <div>Loading...</div>;

  const coursesArr = courses || [];
  const badgesArr = badges || [];

  return (
    <div className="grid grid-cols-12 gap-gutter">
      {/* LEFT COLUMN */}
      <div className="col-span-12 lg:col-span-3 space-y-stack-md">
        {/* SECTION 1 - Milestone Card */}
        <section className="bg-primary text-on-primary p-stack-lg rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>{milestone ? 'flag' : 'add_circle'}</span>
          </div>
          {milestone ? (
            <>
              <h4 className="font-label-caps text-label-caps text-secondary-fixed mb-unit">UPCOMING MILESTONE</h4>
              <h3 className="font-h2 text-h2 mb-stack-md">{milestone.title}</h3>
              <div className="space-y-stack-sm">
                <div className="flex justify-between items-end">
                  <span className="text-5xl font-h1">{milestone.daysRemaining}</span>
                  <span className="font-body-md opacity-80 pb-1">{milestone.daysRemaining === 1 ? 'Day Remaining' : 'Days Remaining'}</span>
                </div>
                <div className="w-full bg-on-primary/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary-fixed h-full transition-all duration-1000" style={{ width: `${overallProgress?.overall ?? 0}%` }}></div>
                </div>
              </div>
              {milestone.description && (
                <p className="mt-stack-lg font-body-md text-on-primary/80 leading-relaxed">{milestone.description}</p>
              )}
              <Link to="/milestone" className="mt-stack-lg w-full py-3 bg-secondary-container text-on-secondary-container rounded font-button hover:opacity-90 transition-all block text-center">Edit Milestone</Link>
            </>
          ) : (
            <>
              <h4 className="font-label-caps text-label-caps text-secondary-fixed mb-unit">NO MILESTONE SET</h4>
              <h3 className="font-h2 text-h2 mb-stack-md">Set a Goal</h3>
              <p className="font-body-md text-on-primary/80 leading-relaxed">Create a milestone to track your countdown to an important date like exams, deadlines, or submissions.</p>
              <Link to="/milestone" className="mt-stack-lg w-full py-3 bg-secondary-container text-on-secondary-container rounded font-button hover:opacity-90 transition-all block text-center">Set a New Milestone</Link>
            </>
          )}
        </section>

        {/* SECTION 2 - Overall Progress Quota */}
        <section className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30">
          <h4 className="font-label-caps text-label-caps text-primary mb-stack-md">OVERALL PROGRESS</h4>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4" className="text-surface-container-high" />
                <circle cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={(1 - (overallProgress?.overall ?? 0) / 100) * 175.9} className="text-secondary" />
              </svg>
              <span className="absolute font-h3 text-h3">{overallProgress?.overall ?? 0}%</span>
            </div>
            <div>
              <p className="font-body-md font-bold">{overallProgress?.overall ?? 0}% Complete</p>
              <p className="text-xs text-on-surface-variant">{overallProgress?.courses?.reduce((sum, c) => sum + (c.completed_topics || 0), 0)}/{overallProgress?.courses?.reduce((sum, c) => sum + (c.total_topics || 0), 0)} topics done</p>
            </div>
          </div>
        </section>
      </div>

      {/* CENTER COLUMN */}
      <div className="col-span-12 lg:col-span-6 space-y-stack-md">
        {/* SECTION 3 - My Courses */}
        <div className="flex items-center justify-between">
          <h2 className="font-h2 text-h2 text-primary">My Courses</h2>
          <Link to="/planner" className="text-primary font-button flex items-center gap-1 hover:underline">Explore All <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {coursesArr.map((course, index) => {
            const isLastOdd = coursesArr.length % 2 !== 0 && index === coursesArr.length - 1;
            return (
              <Link to={`/courses/${course.id}`} key={course.id || index} className={`block ${isLastOdd ? 'col-span-1 md:col-span-2' : ''} bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow`}>
                {isLastOdd ? (
                  <div className="flex items-center gap-stack-md">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-stack-md">
                        <span className="bg-on-primary-container/10 text-on-primary-container text-[10px] px-2 py-1 rounded font-bold">{course.type || 'CORE'}</span>
                        <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                      </div>
                      <h4 className="font-h3 text-h3 text-primary mb-1">{course.name}</h4>
                      <p className="text-xs text-on-surface-variant mb-stack-md">{course.completed_topics ?? 0}/{course.total_topics ?? 0} Topics</p>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-xs font-bold text-primary mb-1">
                        <span>Progress</span>
                        <span>{course.progress_percent ?? 0}%</span>
                      </div>
                      <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full transition-all duration-1000" style={{ width: `${course.progress_percent ?? 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-stack-md">
                      <span className="bg-on-primary-container/10 text-on-primary-container text-[10px] px-2 py-1 rounded font-bold">{course.type || 'CORE'}</span>
                      <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                    </div>
                    <h4 className="font-h3 text-h3 text-primary mb-1">{course.name}</h4>
                    <p className="text-xs text-on-surface-variant mb-stack-md">{course.completed_topics ?? 0}/{course.total_topics ?? 0} Topics</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span>Progress</span>
                        <span>{course.progress_percent ?? 0}%</span>
                      </div>
                      <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full transition-all duration-1000" style={{ width: `${course.progress_percent ?? 0}%` }}></div>
                      </div>
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-12 lg:col-span-3 space-y-stack-lg">
        {/* SECTION 4 - Recent Progress (dynamic from API) */}
        <section className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30">
          <h3 className="font-h3 text-h3 text-primary mb-stack-md">Recent Progress</h3>
          <div className="space-y-stack-md">
            {(overallProgress?.courses || []).filter(c => c.total_topics > 0).slice(0, 4).map(c => (
              <div key={c.course_id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold">{c.course_name}</p>
                  <span className="text-xs font-bold text-secondary">{c.progress_percent}%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full transition-all duration-1000" style={{ width: `${c.progress_percent}%` }}></div>
                </div>
                <p className="text-xs text-on-surface-variant">{c.completed_topics}/{c.total_topics} topics completed</p>
              </div>
            ))}
            {(overallProgress?.courses || []).filter(c => c.total_topics > 0).length === 0 && (
              <p className="text-sm text-on-surface-variant">No courses with topics yet.</p>
            )}
          </div>
        </section>

        {/* SECTION 5 - Badges Gallery */}
        <section className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30">
          <div className="flex justify-between items-center mb-stack-md">
            <h3 className="font-h3 text-h3 text-primary">Badges</h3>
            <span className="text-xs font-bold text-secondary">8 Total</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {badgesArr.filter(b => b.earned).slice(0, 4).map(badge => (
              <div key={badge.id} className="aspect-square rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant/10 group cursor-help relative">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-primary text-on-primary text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity">{badge.name}</div>
              </div>
            ))}
            {Array.from({ length: Math.max(0, 6 - badgesArr.filter(b => b.earned).length) }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-outline-variant text-xs">lock</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6 - Study Activity Banner */}
        <div className="rounded-xl overflow-hidden relative h-32 flex items-end">
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-80"></div>
          <div className="relative p-4">
            <p className="text-white font-bold text-sm">Join the Live Study Hall</p>
            <p className="text-on-primary-container text-xs">342 Students Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
