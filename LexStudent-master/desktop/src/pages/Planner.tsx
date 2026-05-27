import { useGoals, useCreateGoal } from '../hooks/useGoals'
import { useReminders, useToggleReminder } from '../hooks/useReminders'

export default function Planner() {
  const { data: goals } = useGoals()
  const { data: reminders } = useReminders()
  const toggleReminder = useToggleReminder()
  const createGoal = useCreateGoal()

  const handleSetNewGoal = () => {
    createGoal.mutate({
      title: 'New Study Goal',
      description: 'Complete a study session',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-h1 text-h1 text-primary-container">Planner</h1>
          <p className="font-body-md text-on-surface-variant">Manage your legal curriculum.</p>
        </div>
        <button onClick={handleSetNewGoal} className="bg-primary-container text-white px-6 py-3 rounded-xl flex items-center gap-2 font-button text-button shadow-lg active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>
          Set New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary">menu_book</span>
            <h2 className="font-h2 text-h2 text-primary-container">Daily Reading Goals</h2>
          </div>
          <div className="space-y-4">
            {(goals || []).map((goal: any) => (
              <div key={goal.id} className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-h3 text-h3 text-primary">{goal.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-secondary-container/30 text-secondary'
                  }`}>{goal.status || 'pending'}</span>
                </div>
                <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full transition-all" style={{ width: `${goal.progress || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/50 p-6 rounded-xl border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-secondary">notifications_active</span>
            <h2 className="font-h2 text-h2 text-primary-container">Reminders</h2>
          </div>
          <div className="space-y-4">
            {(reminders || []).map((reminder: any) => (
              <div key={reminder.id} className="flex items-center justify-between">
                <div>
                  <p className="font-body-md text-on-surface font-medium">{reminder.title}</p>
                  <p className="text-xs text-on-surface-variant">{reminder.time}</p>
                </div>
                <button onClick={() => toggleReminder.mutate(reminder.id)}
                  className={`w-10 h-6 rounded-full transition-colors ${reminder.enabled ? 'bg-secondary' : 'bg-surface-container'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${reminder.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
