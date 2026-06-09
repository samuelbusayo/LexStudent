import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoals, useCreateGoal } from '../hooks/useGoals'
import { useReminders, useToggleReminder } from '../hooks/useReminders'
import { useKnowledgeGaps } from '../hooks/useProgress'
import WeeklyCalendar from '../components/planner/WeeklyCalendar'
import GoalCard from '../components/planner/GoalCard'
import GoalModal from '../components/planner/GoalModal'
import ReminderToggle from '../components/planner/ReminderToggle'

export default function Planner() {
  const navigate = useNavigate()
  const { data: goals } = useGoals()
  const { data: reminders } = useReminders()
  const { data: gaps } = useKnowledgeGaps()
  const toggleReminder = useToggleReminder()
  const createGoal = useCreateGoal()

  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))

  const goalDates = useMemo(() => {
    if (!goals) return []
    return goals.flatMap(g =>
      (g.occurrences || []).map(o => o.date)
    )
  }, [goals])

  const filteredGoals = useMemo(() => {
    if (!goals) return []
    return goals.filter(g =>
      (g.occurrences || []).some(o => o.date === selectedDate)
    )
  }, [goals, selectedDate])

  const handleCreateGoal = (data) => {
    createGoal.mutate(data)
    setShowModal(false)
  }

  const gapCount = (gaps || []).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-h1 text-3xl text-primary">Planner</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Manage your legal curriculum.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary-container text-white rounded-xl font-button text-button shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Set New Goal
        </button>
      </div>

      {/* Vertical Weekly Calendar */}
      <WeeklyCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        goalDates={goalDates}
      />

      {/* Daily Reading Goals */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-secondary text-xl">menu_book</span>
          <h2 className="font-h2 text-xl text-primary">Daily Reading Goals</h2>
        </div>
        <div className="space-y-3">
          {filteredGoals.length === 0 ? (
            <div className="bg-white/50 p-8 rounded-2xl border border-[#E0E0D0] text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">event_available</span>
              <p className="text-on-surface-variant font-body-md">No goals for this day.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 font-button text-sm text-primary active:opacity-70"
              >
                + Set a New Goal
              </button>
            </div>
          ) : (
            filteredGoals.map(goal => {
              const occ = (goal.occurrences || []).find(o => o.date === selectedDate)
              return (
                <GoalCard
                  key={`${goal.id}-${occ?.id || 0}`}
                  goal={goal}
                  occurrence={occ}
                />
              )
            })
          )}
        </div>
      </section>

      {/* Final Revision CTA */}
      {gapCount > 0 && (
        <section
          className="rounded-2xl p-6 overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #002147 0%, #001530 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0z\' fill=\'%23ffffff\' fill-opacity=\'0.03\'/%3E%3C/svg%3E")' }}
          />
          <h3 className="font-h3 text-lg text-white relative z-10">Final Revision: Review</h3>
          <p className="text-white/70 font-body-md text-sm mt-1 relative z-10 leading-relaxed">
            You have {gapCount} concept{gapCount !== 1 ? 's' : ''} left to master before the weekend mock exam.
          </p>
          <button
            onClick={() => navigate('/revision/session')}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-xl font-button text-sm relative z-10 active:scale-95 transition-transform"
          >
            Resume Session
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      )}

      {/* Reminders */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-secondary text-xl">notifications_active</span>
          <h2 className="font-h2 text-xl text-primary">Reminders</h2>
        </div>
        <div className="space-y-5">
          {(reminders || []).length === 0 ? (
            <div className="bg-white/50 p-6 rounded-2xl border border-[#E0E0D0] text-center">
              <p className="text-on-surface-variant font-body-md">No reminders set.</p>
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
      </section>

      {/* Inspirational Quote */}
      <div className="p-5 bg-secondary-container/10 border border-secondary-container/20 rounded-2xl">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">lightbulb</span>
          <p className="font-body-md text-on-surface-variant italic leading-relaxed">
            "Consistency in revision is the cornerstone of judicial reasoning mastery."
          </p>
        </div>
      </div>

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
