import React, { useEffect } from 'react';

export default function GoalCompleteToast({ goal, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!goal) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-5 max-w-sm flex items-start gap-3 border border-emerald-400/50">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
          <span className="material-symbols-outlined text-[28px]">celebration</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-h3 text-white">Goal completed!</h4>
          <p className="text-sm text-white/90 truncate">{goal.title}</p>
          <p className="text-xs text-white/70 mt-1">Keep the momentum going.</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white flex-shrink-0"
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}
