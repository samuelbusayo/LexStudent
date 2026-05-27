interface GoalCardProps {
  goal: any
  onComplete?: (id: string) => void
}

export default function GoalCard({ goal, onComplete }: GoalCardProps) {
  const isCompleted = goal.status === 'completed'

  return (
    <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-h3 text-h3 text-primary">{goal.title}</h3>
          {goal.description && (
            <p className="text-xs text-on-surface-variant mt-1">{goal.description}</p>
          )}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isCompleted ? 'bg-green-100 text-green-700' : 'bg-secondary-container/30 text-secondary'
        }`}>
          {isCompleted ? 'DONE' : 'ACTIVE'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface-variant">Progress</span>
          <span className="font-bold text-secondary">{goal.progress || 0}%</span>
        </div>
        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-secondary h-full transition-all duration-700"
            style={{ width: `${goal.progress || 0}%` }}
          />
        </div>
      </div>

      {goal.targetDate && (
        <div className="mt-3 flex items-center gap-1 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">event</span>
          Due: {new Date(goal.targetDate).toLocaleDateString()}
        </div>
      )}

      {!isCompleted && onComplete && (
        <button
          onClick={() => onComplete(goal.id)}
          className="mt-3 w-full py-2 text-xs font-button bg-secondary-container/20 text-secondary rounded-lg hover:bg-secondary-container/40 transition-colors"
        >
          Mark Complete
        </button>
      )}
    </div>
  )
}
