import React from 'react';
import { useUpdateGoal } from '../../hooks/useGoals';

export default function GoalCard({ goal, occurrence }) {
  const updateGoal = useUpdateGoal();
  const progress = goal.progress ?? 0;
  const notStarted = progress === 0;
  const isComplete = goal.status === 'completed' || progress >= 100;
  const hasTopicLink = !!goal.topicId;

  const handleIncrement = () => {
    if (isComplete) return;
    const newProgress = Math.min(100, progress + 20);
    updateGoal.mutate({
      id: goal.id,
      progress: newProgress,
      status: newProgress >= 100 ? 'completed' : 'in_progress',
    });
  };

  const handleMarkDone = () => {
    updateGoal.mutate({ id: goal.id, progress: 100, status: 'completed' });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E0E0D0] shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="inline-block bg-primary-container/5 text-primary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2">
            {goal.subjectTag}
          </span>
          <h3 className="font-h3 text-lg text-primary">{goal.title}</h3>
          {goal.note && (
            <p className="font-body-md text-on-surface-variant mt-1 text-sm">{goal.note}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 ml-3">
          <span className={`font-label-caps text-label-caps tracking-widest ${
            isComplete ? 'text-green-600' : notStarted ? 'text-outline' : 'text-secondary'
          }`}>
            {isComplete ? 'Complete' : notStarted ? 'Not Started' : `${Math.round(progress)}% Complete`}
          </span>
          {!hasTopicLink && !isComplete && (
            <div className="flex gap-1.5">
              <button
                onClick={handleIncrement}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-secondary/30 text-secondary font-button transition-colors active:bg-secondary/10"
              >
                +1
              </button>
              <button
                onClick={handleMarkDone}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-secondary/30 text-secondary font-button transition-colors active:bg-secondary/10"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-secondary-container transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
    </div>
  );
}
