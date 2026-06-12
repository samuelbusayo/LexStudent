import React from 'react';

export default function BadgeCard({ badge }) {
  const earned = badge.earned;
  const pct = badge.percent || 0;
  const isClose = !earned && pct >= 75;

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all ${
        earned
          ? 'bg-gradient-to-br from-secondary-container/20 to-primary-container/5 border-secondary-container/50'
          : isClose
            ? 'bg-white border-secondary/40 ring-2 ring-secondary/20'
            : 'bg-white border-[#E0E0D0]'
      }`}
    >
      {earned && (
        <div className="absolute top-3 right-3 bg-secondary-container text-primary-container px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
          Earned
        </div>
      )}
      {isClose && (
        <div className="absolute top-3 right-3 bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
          Almost
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          {/* Progress ring (only for non-earned tiered badges) */}
          {!earned && badge.target > 1 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2"
                className="text-primary-container/10" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2"
                strokeDasharray={`${pct * 1.005} 100`} strokeLinecap="round"
                className={isClose ? 'text-secondary' : 'text-primary-container/50'} />
            </svg>
          )}
          <div className={`absolute inset-1 rounded-full flex items-center justify-center ${
            earned
              ? 'bg-secondary-container'
              : isClose ? 'bg-secondary/10' : 'bg-primary-container/5'
          }`}>
            <span
              className={`material-symbols-outlined ${
                earned ? 'text-primary-container text-[24px]' : 'text-primary-container/60 text-[22px]'
              }`}
              style={earned ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {badge.icon || 'military_tech'}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3 className={`font-h3 text-base leading-tight ${
            earned ? 'text-primary-container' : 'text-primary-container/80'
          }`}>
            {badge.name}
          </h3>
          <p className={`text-xs mt-1 leading-snug ${
            earned ? 'text-on-surface-variant' : 'text-on-surface-variant/80'
          }`}>
            {badge.description}
          </p>

          {!earned && badge.target > 1 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-primary-container/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isClose ? 'bg-secondary' : 'bg-primary-container/40'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold tabular-nums text-on-surface-variant">
                {badge.progress}/{badge.target}
              </span>
            </div>
          )}
          {earned && badge.earnedAt && (
            <p className="text-[10px] text-on-surface-variant/60 mt-1.5">
              Earned · {new Date(badge.earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
