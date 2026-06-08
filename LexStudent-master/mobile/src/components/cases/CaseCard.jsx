import React from 'react';

const iconMap = {
  gavel: 'gavel',
  balance: 'balance',
  policy: 'policy',
};

export default function CaseCard({ case: c }) {
  const icon = iconMap[c?.icon] || 'gavel';

  return (
    <article className="col-span-2 md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-on-tertiary-container/10 p-2 rounded-lg">
          <span className="material-symbols-outlined text-on-tertiary-container">{icon}</span>
        </div>
        <span className="text-[10px] text-outline font-bold uppercase">{c?.year || ''}</span>
      </div>
      <h3 className="font-h3 text-primary text-xl mb-1">{c?.name || ''}</h3>
      <p className="font-body-md text-on-surface-variant text-sm italic mb-4">{c?.citation || ''}</p>
      <p className="font-body-md text-on-surface text-sm flex-grow">{c?.description || ''}</p>
      <div className="mt-4 flex gap-2 overflow-hidden">
        {(c?.tags || ['']).map((tag, i) => (
          <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded uppercase whitespace-nowrap">{tag}</span>
        ))}
      </div>
    </article>
  );
}
