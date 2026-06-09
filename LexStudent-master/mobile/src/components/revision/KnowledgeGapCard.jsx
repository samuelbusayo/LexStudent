import React from 'react';

export default function KnowledgeGapCard({ gap }) {
  return (
    <div className="p-4 rounded-2xl bg-primary-container/5 border border-primary-container/10 flex flex-col gap-2">
      <span className="font-label-caps text-label-caps text-primary-container tracking-widest">{gap.subject}</span>
      <p className="font-h3 text-base text-primary">{gap.topic}</p>
      <div className="h-1 w-full bg-primary-container/10 rounded-full overflow-hidden">
        <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${gap.progress}%` }} />
      </div>
      <span className="text-[10px] text-on-surface-variant font-medium">Last reviewed {gap.lastReviewed}</span>
    </div>
  );
}
