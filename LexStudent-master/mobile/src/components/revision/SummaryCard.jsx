import React from 'react';

export default function SummaryCard({ summary }) {
  return (
    <div className="min-w-[280px] bg-white rounded-xl p-5 border border-[#E0E0D0] space-y-3">
      <div className="flex justify-between">
        <span className="font-label-caps text-secondary">{summary.subject}</span>
        <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
      </div>
      <p className="font-h3 text-primary leading-tight">{summary.title}</p>
      <p className="text-body-md text-on-surface-variant line-clamp-3 italic">{summary.content}</p>
    </div>
  );
}
