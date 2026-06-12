import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile, useActivityLog, useUserHeatmap } from '../hooks/useProfile';
import { useOverallProgress, useStreak } from '../hooks/useProgress';
import { useMilestone, useBadges } from '../hooks/useBadges';

function GenerativeSeal({ name, size = 120 }) {
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const cells = 5;
  const cellSize = size / cells;
  const shapes = [];

  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const idx = row * cells + col;
      const val = (seed + idx * 17) % 100;
      const cx = col * cellSize + cellSize / 2;
      const cy = row * cellSize + cellSize / 2;
      const r = cellSize * 0.35;

      if (val > 50) {
        const type = val % 3;
        const opacity = 0.6 + (val % 40) / 100;
        if (type === 0) {
          shapes.push(
            <circle key={idx} cx={cx} cy={cy} r={r} fill="currentColor" opacity={opacity} />
          );
        } else if (type === 1) {
          shapes.push(
            <rect key={idx} x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="currentColor" opacity={opacity} />
          );
        } else {
          shapes.push(
            <polygon key={idx} points={`${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`} fill="currentColor" opacity={opacity} />
          );
        }
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-primary">
      <rect x="0" y="0" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" />
      {shapes}
    </svg>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function activityVerb(type) {
  const verbs = {
    'read': 'Read',
    'quiz': 'Attempted',
    'note': 'Filed',
    'goal': 'Set',
    'milestone': 'Reached',
    'review': 'Reviewed',
    'material': 'Studied',
  };
  return verbs[type] || 'Recorded';
}

function activityNoun(type) {
  const nouns = {
    'read': 'pages',
    'quiz': 'a quiz',
    'note': 'notes',
    'goal': 'a goal',
    'milestone': 'a milestone',
    'review': 'materials',
    'material': 'documents',
  };
  return nouns[type] || 'activity';
}

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: activities, isLoading: activityLoading } = useActivityLog();
  const { data: heatmapData, isLoading: heatmapLoading } = useUserHeatmap();
  const { data: overallProgress, isLoading: progressLoading } = useOverallProgress();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: milestone, isLoading: milestoneLoading } = useMilestone();
  const { data: badges, isLoading: badgesLoading } = useBadges();

  const isLoading = profileLoading || progressLoading || streakLoading || milestoneLoading || badgesLoading || activityLoading || heatmapLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <div className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
          <span className="font-body-md">Loading profile...</span>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.name || 'LexStudent User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'LU';
  const program = profile?.program || 'Bar Part II';
  const campus = profile?.campus || 'Lagos Campus';
  const joined = formatDate(profile?.createdAt);
  const badgeCount = badges?.filter(b => b.earned)?.length || 0;
  const totalBadges = badges?.length || 0;
  const aiUsed = profile?.aiMessagesUsed || 0;
  const aiLimit = profile?.aiMessagesLimit || 5;

  // Build heatmap grid (7 days x 4 weeks = 28 days)
  const heatmap = Array.from({ length: 28 }, (_, i) => {
    const found = heatmapData?.find(d => d.dayIndex === i);
    return found?.intensity || 0;
  });

  const activityList = activities || [];

  return (
    <div className="space-y-stack-lg">
      {/* HERO / IDENTITY HEADER */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-stack-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative flex items-start gap-stack-lg">
          <div className="flex-shrink-0">
            <GenerativeSeal name={displayName} size={144} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-h1 text-h1 text-primary mb-2">{displayName}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-primary-container/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    <span className="material-symbols-outlined text-sm">school</span>
                    {program}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full text-sm font-medium">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {campus}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-sm font-medium">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Member since {joined}
                  </span>
                </div>
              </div>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-button text-sm hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO STATS GRID */}
      <section className="grid grid-cols-12 gap-gutter">
        {/* STREAK - Large tile */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 bg-gradient-to-br from-primary to-primary-container rounded-2xl p-stack-lg text-on-primary relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <div className="relative">
            <h4 className="font-label-caps text-label-caps text-secondary-fixed mb-stack-md">CURRENT STREAK</h4>
            <div className="flex items-baseline gap-2 mb-stack-md">
              <span className="text-6xl font-h1 font-bold">{streak?.streak || 0}</span>
              <span className="font-body-lg opacity-80">days</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="font-body-md">Best: {streak?.streak || 0} days</span>
            </div>

            {/* Mini heatmap */}
            <div className="mt-4">
              <p className="text-xs opacity-60 mb-2 font-label-caps">LAST 28 DAYS</p>
              <div className="grid grid-cols-7 gap-1">
                {heatmap.map((intensity, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm transition-colors ${
                      intensity === 0 ? 'bg-on-primary/10' :
                      intensity === 1 ? 'bg-on-primary/20' :
                      intensity === 2 ? 'bg-on-primary/40' :
                      intensity === 3 ? 'bg-on-primary/60' :
                      'bg-on-primary'
                    }`}
                    title={`Day ${i + 1}: ${intensity} activity`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* OVERALL PROGRESS - Medium tile */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-stack-lg border border-outline-variant/30">
          <h4 className="font-label-caps text-label-caps text-primary mb-stack-md">OVERALL PROGRESS</h4>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4" className="text-surface-container-high" />
                <circle cx="32" cy="32" fill="none" r="28" stroke="currentColor" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={(1 - (overallProgress?.overall ?? 0) / 100) * 175.9} className="text-secondary" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-h3 text-h3">{overallProgress?.overall ?? 0}%</span>
            </div>
            <div>
              <p className="font-body-md font-bold text-primary">{overallProgress?.overall ?? 0}% Complete</p>
              <p className="text-sm text-on-surface-variant">
                {overallProgress?.courses?.reduce((sum, c) => sum + (c.completedTopics || 0), 0)} / {overallProgress?.courses?.reduce((sum, c) => sum + (c.totalTopics || 0), 0)} topics
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {(overallProgress?.courses || []).slice(0, 3).map(c => (
              <div key={c.courseId} className="flex items-center gap-3">
                <div className="w-24 text-xs font-medium text-on-surface-variant truncate">{c.courseName}</div>
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${c.progressPercent}%` }} />
                </div>
                <div className="w-8 text-xs font-bold text-right">{c.progressPercent}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* MILESTONE - Medium tile */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-stack-lg border border-outline-variant/30">
          <h4 className="font-label-caps text-label-caps text-primary mb-stack-md">NEXT MILESTONE</h4>
          {milestone ? (
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-2">{milestone.title}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-h1 font-bold text-secondary">{milestone.daysRemaining}</span>
                <span className="text-sm text-on-surface-variant">days remaining</span>
              </div>
              {milestone.description && (
                <p className="text-sm text-on-surface-variant line-clamp-2">{milestone.description}</p>
              )}
              <Link to="/milestone" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline">
                View details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-on-surface-variant mb-4">No milestone set. Create one to track your progress toward important deadlines.</p>
              <Link to="/milestone" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-button text-sm hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-sm">add</span>
                Set Milestone
              </Link>
            </div>
          )}
        </div>

        {/* AI CLERK - Small tile */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
            <h4 className="font-label-caps text-label-caps text-primary">AI CLERK</h4>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">{aiUsed} <span className="text-sm font-normal text-on-surface-variant">/ {aiLimit}</span></p>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(aiUsed / aiLimit) * 100}%` }} />
          </div>
          <p className="text-xs text-on-surface-variant mt-2">messages used this cycle</p>
        </div>

        {/* BADGES - Small tile (with nearest-to-unlock) */}
        {(() => {
          const nearest = (badges || [])
            .filter(b => !b.earned && b.target > 0)
            .sort((a, b) => (b.percent || 0) - (a.percent || 0))[0];
          return (
            <Link to="/badges" className="col-span-6 md:col-span-3 lg:col-span-2 bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant/30 hover:border-secondary/40 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-sm">military_tech</span>
                <h4 className="font-label-caps text-label-caps text-primary">BADGES</h4>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">{badgeCount} <span className="text-sm font-normal text-on-surface-variant">/ {totalBadges}</span></p>
              {nearest ? (
                <div className="mt-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-secondary text-[14px]">{nearest.icon}</span>
                    <span className="text-[11px] font-semibold text-primary truncate">{nearest.name}</span>
                  </div>
                  <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${nearest.percent || 0}%` }} />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 tabular-nums">{nearest.progress}/{nearest.target} · next up</p>
                </div>
              ) : (
                <div className="flex gap-1 mt-2">
                  {(badges || []).filter(b => b.earned).slice(0, 4).map(badge => (
                    <div key={badge.id} className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant/10">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          );
        })()}

        {/* STUDY HOURS - Small tile */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">schedule</span>
            <h4 className="font-label-caps text-label-caps text-primary">STUDY HOURS</h4>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">
            {activityList.reduce((sum, a) => sum + (a.amount || 0), 0)}
          </p>
          <p className="text-xs text-on-surface-variant">total activities recorded</p>
        </div>

        {/* STUDY RATE - Small tile */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-surface-container-lowest rounded-2xl p-stack-md border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">speed</span>
            <h4 className="font-label-caps text-label-caps text-primary">STUDY RATE</h4>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">
            {activityList.length > 0 ? Math.round(activityList.reduce((sum, a) => sum + (a.amount || 0), 0) / activityList.length) : 0}
          </p>
          <p className="text-xs text-on-surface-variant">avg. per activity</p>
        </div>
      </section>

      {/* RECENT DOCKET - Activity Feed */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-stack-lg">
        <div className="flex items-center justify-between mb-stack-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">gavel</span>
            <h2 className="font-h3 text-h3 text-primary">Recent Docket</h2>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {activityList.length} ENTRIES
          </span>
        </div>

        {activityList.length === 0 ? (
          <div className="text-center py-stack-lg">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">folder_open</span>
            <p className="text-on-surface-variant font-body-md">No activity recorded yet.</p>
            <p className="text-sm text-on-surface-variant mt-1">Start studying to build your docket.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {activityList.map((entry, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-4 border-b border-outline-variant/20 last:border-b-0 hover:bg-surface-container-low/50 transition-colors px-2 -mx-2 rounded-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {entry.type === 'read' ? 'menu_book' :
                     entry.type === 'quiz' ? 'quiz' :
                     entry.type === 'note' ? 'edit_note' :
                     entry.type === 'goal' ? 'target' :
                     entry.type === 'milestone' ? 'flag' :
                     entry.type === 'review' ? 'refresh' :
                     'folder'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md font-medium text-primary">
                    {activityVerb(entry.type)} <span className="text-on-surface-variant font-normal">{entry.amount || 1} {activityNoun(entry.type)}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {entry.type === 'read' ? 'Reading session' :
                     entry.type === 'quiz' ? 'Assessment' :
                     entry.type === 'note' ? 'Study notes' :
                     entry.type === 'goal' ? 'Goal tracking' :
                     entry.type === 'milestone' ? 'Achievement' :
                     'Study activity'}
                    {' '} &bull; {' '}
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                    {entry.goalId ? `Goal #${entry.goalId}` : entry.topicId ? `Topic #${entry.topicId}` : 'General'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
