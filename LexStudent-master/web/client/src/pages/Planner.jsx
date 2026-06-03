import React, { useState, useMemo } from 'react';
import { useGoals, useCreateGoal } from '../hooks/useGoals';
import { useReminders, useToggleReminder } from '../hooks/useReminders';
import WeeklyCalendar from '../components/planner/WeeklyCalendar';
import GoalCard from '../components/planner/GoalCard';
import GoalModal from '../components/planner/GoalModal';
import ReminderToggle from '../components/planner/ReminderToggle';

export default function Planner() {
  const { data: goals } = useGoals();
  const { data: reminders } = useReminders();
  const toggleReminder = useToggleReminder();
  const createGoal = useCreateGoal();

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Dates that have any goal occurrence — for calendar dots
  const goalDates = useMemo(() => {
    if (!goals) return [];
    return (goals || []).flatMap(g =>
      (g.occurrences || []).map(o => o.date)
    );
  }, [goals]);

  // Goals that have an occurrence on the selected date
  const filteredGoals = useMemo(() => {
    if (!goals) return [];
    return (goals || []).filter(g =>
      (g.occurrences || []).some(o => o.date === selectedDate)
    );
  }, [goals, selectedDate]);

  const handleCreateGoal = (data) => {
    createGoal.mutate(data);
    setShowModal(false);
  };

  return (
    <div className="px-5 pt-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-h1 text-h1 text-primary-container">Planner</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your legal curriculum.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-container text-white px-6 py-3 rounded-xl flex items-center gap-2 font-button text-button shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Set New Goal
        </button>
      </div>

      <WeeklyCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        goalDates={goalDates}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary">menu_book</span>
            <h2 className="font-h2 text-h2 text-primary-container">Daily Reading Goals</h2>
          </div>
          <div className="space-y-4">
            {filteredGoals.length === 0 && (
              <div className="bg-white/50 p-6 rounded-xl border border-[#E0E0D0] text-center">
                <p className="text-on-surface-variant font-body-md">No goals for this day. Click &ldquo;Set New Goal&rdquo; to add one.</p>
              </div>
            )}
            {filteredGoals.map((goal) => {
              const occ = (goal.occurrences || []).find(o => o.date === selectedDate);
              return (
                <GoalCard
                  key={`${goal.id}-${occ?.id || 0}`}
                  goal={goal}
                  occurrence={occ}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-white/50 p-6 rounded-xl border border-[#E0E0D0]">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-secondary">notifications_active</span>
            <h2 className="font-h2 text-h2 text-primary-container">Reminders</h2>
          </div>
          <div className="space-y-6">
            {(reminders || []).map((reminder) => (
              <ReminderToggle
                key={reminder.id}
                reminder={reminder}
                onToggle={() => toggleReminder.mutate(reminder.id)}
              />
            ))}
            <div className="mt-8 p-4 bg-secondary-container/10 border border-secondary-container/20 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">lightbulb</span>
                <p className="font-body-md text-body-md text-secondary-fixed-dim italic">&ldquo;Consistency in revision is the cornerstone of judicial reasoning mastery.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <GoalModal
          defaultDate={selectedDate}
          onSubmit={handleCreateGoal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
