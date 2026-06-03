import { useNavigate } from 'react-router-dom'
import { useUpdateOccurrence } from '../../hooks/useGoals'

interface GoalCardProps {
  goal: any
  occurrence?: any
}

export default function GoalCard({ goal, occurrence }: GoalCardProps) {
  const navigate = useNavigate()
  const updateOccurrence = useUpdateOccurrence()
  const hasTopicLink = !!goal.topicId && !!goal.courseId
  const hasTargetPages = goal.targetPages?.length > 0

  // Compute derived progress for topic-linked goals with target pages
  let progress = 0
  let firstUnread = 1
  let targetPagesRead = 0

  if (hasTopicLink && hasTargetPages) {
    const selPages: number[] | null = goal.selectedPages?.length > 0 ? goal.selectedPages : null
    const pagesRead: number = goal.pagesRead || 0
    const baseline: number = goal.baselinePagesRead || 0
    // Only count pages read AFTER the goal was created
    let readSinceSet: Set<number>
    if (selPages) {
      readSinceSet = new Set(selPages.slice(baseline, pagesRead))
    } else {
      readSinceSet = new Set(
        Array.from({ length: Math.max(0, pagesRead - baseline) }, (_, i) => baseline + i + 1)
      )
    }
    targetPagesRead = (goal.targetPages as number[]).filter((p: number) => readSinceSet.has(p)).length
    progress = goal.targetPages.length > 0
      ? Math.round((targetPagesRead / goal.targetPages.length) * 100)
      : 0
    firstUnread = (goal.targetPages as number[]).find((p: number) => !readSinceSet.has(p)) || goal.targetPages[0] || 1
  } else {
    progress = occurrence?.progress ?? goal.progress ?? 0
  }

  const isComplete = occurrence?.status === 'completed' || progress >= 100
  const notStarted = progress === 0

  const handleClick = () => {
    if (!hasTopicLink) return
    navigate(
      `/courses/${goal.courseId}/topics/${goal.topicId}/read?page=${firstUnread}`,
      { state: { from: 'planner' } }
    )
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isComplete || !occurrence) return
    const newProgress = Math.min(100, (occurrence.progress || 0) + 20)
    updateOccurrence.mutate({
      id: occurrence.id,
      progress: newProgress,
      status: newProgress >= 100 ? 'completed' : 'in_progress',
    })
  }

  const handleMarkDone = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!occurrence) return
    updateOccurrence.mutate({ id: occurrence.id, progress: 100, status: 'completed' })
  }

  return (
    <div
      onClick={hasTopicLink ? handleClick : undefined}
      className={`bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-4 ${
        hasTopicLink ? 'cursor-pointer hover:border-secondary/40 hover:shadow-md transition-all' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <span className="bg-primary-container/5 text-primary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">
            {goal.subjectTag}
          </span>
          <h3 className="font-h3 text-primary-container">{goal.title}</h3>
          {goal.note && (
            <p className="font-body-md text-on-surface-variant mt-1">{goal.note}</p>
          )}
          {hasTopicLink && (
            <p className="text-xs text-secondary mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              <span className="truncate">{goal.topicName}</span>
              {hasTargetPages && (
                <span className="flex-shrink-0"> · {targetPagesRead}/{goal.targetPages.length} pages</span>
              )}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-3">
          <span className={`font-label-caps ${isComplete ? 'text-green-600' : notStarted ? 'text-slate-400' : 'text-secondary'}`}>
            {isComplete ? 'Complete' : notStarted ? 'Not Started' : `${Math.round(progress)}%`}
          </span>
          {!hasTopicLink && !isComplete && occurrence && (
            <div className="flex gap-1">
              <button
                onClick={handleIncrement}
                className="text-[11px] px-2 py-0.5 rounded border border-secondary/30 text-secondary hover:bg-secondary/10 font-button transition-colors"
              >
                +1
              </button>
              <button
                onClick={handleMarkDone}
                className="text-[11px] px-2 py-0.5 rounded border border-secondary/30 text-secondary hover:bg-secondary/10 font-button transition-colors"
              >
                Done
              </button>
            </div>
          )}
          {hasTopicLink && !isComplete && (
            <span className="material-symbols-outlined text-[16px] text-secondary/50">open_in_new</span>
          )}
        </div>
      </div>
      <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden">
        <div className="h-full bg-secondary-container transition-all" style={{ width: `${Math.min(100, progress)}%` }}></div>
      </div>
    </div>
  )
}
