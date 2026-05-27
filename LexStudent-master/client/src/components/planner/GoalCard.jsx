import React from 'react';

export default function GoalCard({ goal }) {
  const progress = goal.progress ?? 0;
  const notStarted = progress === 0;

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
        <span className={`font-label-caps text-label-caps ${notStarted ? 'text-slate-400' : 'text-secondary'}`}>
          {notStarted ? 'Not Started' : `${Math.round(progress)}% Complete`}
        </span>
      </div>
      <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden">
        <div className="h-full bg-secondary-container" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
