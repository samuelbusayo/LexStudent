import React, { useEffect } from 'react';

export default function BadgeUnlockedToast({ badge, onClose, offset = 0 }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!badge) return null;

  return (
    <div
      className="fixed right-6 z-50 animate-slide-in-right"
      style={{ bottom: 24 + offset }}
    >
      <div className="bg-gradient-to-br from-primary-container to-primary text-white rounded-2xl shadow-2xl p-5 max-w-sm flex items-start gap-3 border border-secondary-container/30 ring-1 ring-secondary-container/20">
        <div className="flex-shrink-0 bg-secondary-container/20 rounded-full p-2.5 ring-2 ring-secondary-container/30">
          <span className="material-symbols-outlined text-secondary-container text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {badge.icon || 'military_tech'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest font-bold text-secondary-container mb-0.5">
            Badge unlocked
          </div>
          <h4 className="font-h3 text-white leading-tight">{badge.name}</h4>
          <p className="text-xs text-white/80 mt-1 line-clamp-2">{badge.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white flex-shrink-0"
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}
