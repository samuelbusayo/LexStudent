import React from 'react';

export default function StreakHero({ streak, badgeName }) {
  const days = streak?.streak ?? 0;
  const badge = badgeName ?? streak?.badge ?? '';
  const ringPercent = streak?.ringPercent ?? 0;

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (ringPercent / 100) * circumference;

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Active Streak</p>
        <h2 className="font-h1 text-3xl text-primary">{days} Days</h2>
        {badge && (
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            <span className="font-body-md text-sm text-on-surface-variant font-medium">Badge: {badge}</span>
          </div>
        )}
      </div>
      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="transparent" stroke="#f0eded" strokeWidth="4" />
          <circle cx="48" cy="48" r="40" fill="transparent" stroke="#735c00" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-h3 text-lg text-primary">{ringPercent}%</span>
        </div>
      </div>
    </section>
  );
}
