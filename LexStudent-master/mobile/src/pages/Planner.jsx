import { useState, useMemo } from 'react'
import { useGoals, useCreateGoal } from '../hooks/useGoals'
import { useReminders, useToggleReminder } from '../hooks/useReminders'
import WeeklyCalendar from '../components/planner/WeeklyCalendar'
import GoalCard from '../components/planner/GoalCard'
import GoalModal from '../components/planner/GoalModal'
import ReminderToggle from '../components/planner/ReminderToggle'

export default function Planner() {
  const { data: goals } = useGoals()
  const { data: reminders } = useReminders()
  const toggleReminder = useToggleReminder()
  const createGoal = useCreateGoal()

  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [tab, setTab] = useState('goals') // goals | reminders

  const goalDates = useMemo(() => {
    if (!goals) return []
    return goals.map(g => g.date).filter(Boolean)
  }, [goals])

  const filteredGoals = useMemo(() => {
    if (!goals) return []
    return goals.filter(g => g.date === selectedDate)
  }, [goals, selectedDate])

  const handleCreateGoal = (data) => {
    createGoal.mutate(data)
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-semibold text-primary">Planner</h1>
          <p className="text-xs text-on-surface-variant">Manage your study schedule</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Goal
        </button>
      </div>

      {/* Calendar */}
      <WeeklyCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        goalDates={goalDates}
      />

      {/* Tab Switcher */}
      <div className="flex bg-surface-container rounded-lg p-1">
        <button
          onClick={() => setTab('goals')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
            tab === 'goals' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
          }`}
        >
          Daily Goals
        </button>
        <button
          onClick={() => setTab('reminders')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
            tab === 'reminders' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
          }`}
        >
          Reminders
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'goals' ? (
        <div className="space-y-3">
          {filteredGoals.length === 0 ? (
            <div className="card p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">event_available</span>
              <p className="text-sm text-on-surface-variant">No goals for this day.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-xs font-semibold text-primary active:opacity-70"
              >
                + Add a reading goal
              </button>
            </div>
          ) : (
            filteredGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {(reminders || []).length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-on-surface-variant">No reminders set.</p>
            </div>
          ) : (
            (reminders || []).map(reminder => (
              <ReminderToggle
                key={reminder.id}
                reminder={reminder}
                onToggle={() => toggleReminder.mutate(reminder.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Goal Modal */}
      {showModal && (
        <GoalModal
          defaultDate={selectedDate}
          onSubmit={handleCreateGoal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
