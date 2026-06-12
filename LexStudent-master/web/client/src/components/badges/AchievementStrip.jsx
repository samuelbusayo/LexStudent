import React from 'react';

const TILES = [
  { key: 'totalPagesRead',    icon: 'menu_book',           label: 'Pages read' },
  { key: 'totalQuizzes',      icon: 'quiz',                label: 'Quizzes' },
  { key: 'avgQuizScore',      icon: 'show_chart',          label: 'Avg score', suffix: '%' },
  { key: 'longestStreak',     icon: 'local_fire_department', label: 'Best streak', suffix: 'd' },
  { key: 'highlightsCreated', icon: 'highlight',           label: 'Highlights' },
  { key: 'topicsCompleted',   icon: 'task_alt',            label: 'Topics done' },
  { key: 'aiRequests',        icon: 'smart_toy',           label: 'AI requests' },
  { key: 'daysActive',        icon: 'calendar_today',      label: 'Days active' },
];

export default function AchievementStrip({ data }) {
  if (!data) return null;
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {TILES.map(t => (
        <div key={t.key} className="bg-white rounded-xl p-3 border border-[#E0E0D0] text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">{t.icon}</span>
            <span className="truncate">{t.label}</span>
          </div>
          <div className="font-serif text-xl text-primary-container tabular-nums">
            {data[t.key] ?? 0}{t.suffix || ''}
          </div>
        </div>
      ))}
    </section>
  );
}
