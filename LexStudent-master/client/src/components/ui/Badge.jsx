import React from 'react';

export default function Badge({ name, icon, earned }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          earned
            ? 'bg-secondary-fixed'
            : 'bg-surface-container border border-outline opacity-40'
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span className="text-[10px] text-center leading-tight">{name}</span>
    </div>
  );
}
