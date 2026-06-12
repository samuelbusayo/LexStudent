import React from 'react';

export default function CategoryOverviewCard({ category, badges, onOpen }) {
  const earned = badges.filter(b => b.earned);
  const total = badges.length;
  const percent = total > 0 ? Math.round((earned.length / total) * 100) : 0;

  const nextUp = badges
    .filter(b => !b.earned)
    .sort((a, b) => (b.percent || 0) - (a.percent || 0))[0];

  return (
    <button
      onClick={onOpen}
      className="text-left bg-white rounded-2xl p-5 border border-[#E0E0D0] hover:border-secondary/40 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-container/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container">{category.icon}</span>
          </div>
          <div>
            <h3 className="font-h3 text-base text-primary-container leading-tight">{category.label}</h3>
            <p className="text-xs text-on-surface-variant tabular-nums mt-0.5">
              <span className="font-bold text-primary-container">{earned.length}</span>
              <span className="opacity-60"> / {total} earned</span>
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all text-[20px]">
          arrow_forward
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-primary-container/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-secondary rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Earned badge icons */}
      {earned.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {earned.slice(0, 8).map(b => (
            <div
              key={b.code}
              title={b.name}
              className="w-7 h-7 rounded-lg bg-secondary-container/40 flex items-center justify-center"
            >
              <span
                className="material-symbols-outlined text-primary-container text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {b.icon}
              </span>
            </div>
          ))}
          {earned.length > 8 && (
            <div className="w-7 h-7 rounded-lg bg-primary-container/5 flex items-center justify-center text-[10px] font-bold text-primary-container">
              +{earned.length - 8}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-3 text-xs text-on-surface-variant italic">No badges earned yet</div>
      )}

      {/* Next up */}
      {nextUp && (
        <div className="pt-3 border-t border-[#E0E0D0]">
          <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">
            Next up
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]">{nextUp.icon}</span>
            <span className="text-xs font-semibold text-primary-container truncate flex-1">{nextUp.name}</span>
            <span className="text-[10px] tabular-nums text-on-surface-variant flex-shrink-0">
              {nextUp.progress}/{nextUp.target}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
