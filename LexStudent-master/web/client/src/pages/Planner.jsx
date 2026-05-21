import React from 'react';
import { useGoals, useCreateGoal } from '../hooks/useGoals';
import { useReminders, useToggleReminder } from '../hooks/useReminders';
import WeeklyCalendar from '../components/planner/WeeklyCalendar';
import GoalCard from '../components/planner/GoalCard';
import ReminderToggle from '../components/planner/ReminderToggle';

export default function Planner() {
  const { data: goals } = useGoals();
  const { data: reminders } = useReminders();
  const toggleReminder = useToggleReminder();
  const createGoal = useCreateGoal();

  const handleSetNewGoal = () => {
    createGoal.mutate({
      title: 'New Study Goal',
      description: 'Complete a study session',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  return (
    <div className="px-5 pt-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-h1 text-h1 text-primary-container">Planner</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your legal curriculum.</p>
        </div>
        <button
          onClick={handleSetNewGoal}
          className="bg-primary-container text-white px-6 py-3 rounded-xl flex items-center gap-2 font-button text-button shadow-lg active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Set New Goal
        </button>
      </div>

      <WeeklyCalendar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary">menu_book</span>
            <h2 className="font-h2 text-h2 text-primary-container">Daily Reading Goals</h2>
          </div>
          <div className="space-y-4">
            {(goals || []).map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
            <div className="relative overflow-hidden bg-primary-container text-white p-6 rounded-xl shadow-lg group">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gray-800"></div>
              </div>
              <div className="relative z-10">
                <h3 className="font-h3 text-h3 mb-2">Final Revision: Contracts</h3>
                <p className="font-body-md text-body-md opacity-90 mb-4">You have 12 concepts left to master before the weekend mock exam.</p>
                <button className="bg-secondary-container text-secondary-fixed-dim px-4 py-2 rounded-lg font-button text-button inline-flex items-center gap-2 hover:bg-secondary-fixed transition-colors">
                  Resume Session
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
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
    </div>
  );
}
