import React from 'react';
import { useUpdateGoal } from '../../hooks/useGoals';

export default function GoalCard({ goal }) {
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
    <div className="bg-white p-6 rounded-xl border border-[#E0E0D0] shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="bg-primary-container/5 text-primary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">
            {goal.subjectTag}
          </span>
          <h3 className="font-h3 text-h3 text-primary-container">{goal.title}</h3>
          {goal.note && (
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{goal.note}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`font-label-caps text-label-caps ${isComplete ? 'text-green-600' : notStarted ? 'text-slate-400' : 'text-secondary'}`}>
            {isComplete ? 'Complete' : notStarted ? 'Not Started' : `${Math.round(progress)}% Complete`}
          </span>
          {!hasTopicLink && !isComplete && (
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
        </div>
      </div>
      <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden">
        <div className="h-full bg-secondary-container transition-all" style={{ width: `${Math.min(100, progress)}%` }}></div>
      </div>
    </div>
  );
}
