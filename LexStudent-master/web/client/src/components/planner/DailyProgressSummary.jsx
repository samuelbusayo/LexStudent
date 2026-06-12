import React from 'react';

function computeGoalProgress(goal, occurrence) {
  const hasTopicLink = !!goal.topicId && !!goal.courseId;
  const hasTargetPages = goal.targetPages?.length > 0;
  if (hasTopicLink && hasTargetPages) {
    const selPages = goal.selectedPages?.length > 0 ? goal.selectedPages : null;
    const pagesRead = goal.pagesRead || 0;
    const baseline = goal.baselinePagesRead || 0;
    let readSinceSet;
    if (selPages) {
      readSinceSet = new Set(selPages.slice(baseline, pagesRead));
    } else {
      readSinceSet = new Set(
        Array.from({ length: Math.max(0, pagesRead - baseline) }, (_, i) => baseline + i + 1)
      );
    }
    const targetPagesRead = goal.targetPages.filter(p => readSinceSet.has(p)).length;
    return goal.targetPages.length > 0
      ? Math.round((targetPagesRead / goal.targetPages.length) * 100)
      : 0;
  }
  return occurrence?.progress ?? goal.progress ?? 0;
}

export default function DailyProgressSummary({ goals, selectedDate }) {
  const todaysGoals = (goals || []).map(g => {
    const occ = (g.occurrences || []).find(o => o.date === selectedDate);
    if (!occ) return null;
    const progress = computeGoalProgress(g, occ);
    const isComplete = occ.status === 'completed' || progress >= 100;
    return { goal: g, occurrence: occ, progress, isComplete };
  }).filter(Boolean);

  const total = todaysGoals.length;
  const completed = todaysGoals.filter(g => g.isComplete).length;
  const inProgress = todaysGoals.filter(g => !g.isComplete && g.progress > 0).length;
  const overallPct = total > 0
    ? Math.round(todaysGoals.reduce((s, g) => s + Math.min(100, g.progress), 0) / total)
    : 0;

  const isToday = selectedDate === new Date().toISOString().slice(0, 10);
  const allDone = total > 0 && completed === total;

  if (total === 0) return null;

  return (
    <div className={`rounded-2xl p-5 mb-6 border ${
      allDone
        ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
        : 'bg-gradient-to-br from-secondary-container/10 to-primary-container/5 border-secondary-container/20'
    }`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={allDone ? 'text-emerald-200' : 'text-primary-container/10'}
              />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${overallPct * 0.942} 100`}
                strokeLinecap="round"
                className={allDone ? 'text-emerald-500 transition-all' : 'text-secondary transition-all'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-bold text-sm ${allDone ? 'text-emerald-700' : 'text-primary-container'}`}>
                {overallPct}%
              </span>
            </div>
          </div>
          <div>
            <h3 className={`font-h3 text-h3 ${allDone ? 'text-emerald-800' : 'text-primary-container'}`}>
              {allDone
                ? '🎉 All goals done!'
                : isToday ? "Today's progress" : 'Day progress'}
            </h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              <span className="font-semibold text-primary-container">{completed}</span> of {total} completed
              {inProgress > 0 && (
                <span className="text-secondary"> · {inProgress} in progress</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {todaysGoals.map((g, i) => (
            <div
              key={i}
              title={g.goal.title}
              className={`w-2 h-8 rounded-full ${
                g.isComplete ? 'bg-emerald-500' : g.progress > 0 ? 'bg-secondary' : 'bg-primary-container/15'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
