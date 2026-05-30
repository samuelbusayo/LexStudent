import GoalCard from './GoalCard'

interface GoalListProps {
  goals: any[]
  onComplete?: (id: string) => void
}

export default function GoalList({ goals, onComplete }: GoalListProps) {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">target</span>
        <p className="text-sm text-on-surface-variant">No goals set yet.</p>
        <p className="text-xs text-on-surface-variant/60 mt-1">Create a new study goal to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal: any) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}
