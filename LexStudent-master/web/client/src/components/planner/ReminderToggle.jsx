import React from 'react';
import { useNavigate } from 'react-router-dom';

// Map each canonical reminder to its target route + icon + helper copy so users
// can actually act on it from the planner.
const FEATURE_META = {
  daily_reading: {
    icon: 'menu_book',
    description: 'Notifies you to read your daily goal pages.',
    cta: 'Open planner',
    route: '/planner',
  },
  revision_quiz: {
    icon: 'quiz',
    description: 'Reminds you to take a revision quiz in the evening.',
    cta: 'Start quiz',
    route: '/revision/quiz',
  },
  ai_assistant: {
    icon: 'smart_toy',
    description: 'Suggests asking the AI tutor about today’s reading.',
    cta: 'Open a topic',
    route: '/',
  },
  streak_protector: {
    icon: 'local_fire_department',
    description: 'Alerts you if you’re about to break your streak.',
    cta: 'View streak',
    route: '/revision',
  },
};

async function ensureNotificationPermission() {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export default function ReminderToggle({ reminder, onToggle }) {
  const navigate = useNavigate();
  const meta = FEATURE_META[reminder.featureKey] || {
    icon: 'notifications',
    description: '',
    cta: null,
    route: null,
  };

  const handleToggle = async () => {
    // When turning ON, request browser notification permission so the reminder
    // is actually deliverable.
    if (!reminder.enabled) {
      const granted = await ensureNotificationPermission();
      if (granted) {
        try {
          new Notification('Reminder enabled', {
            body: `${reminder.title} — ${reminder.time}`,
            icon: '/favicon.ico',
          });
        } catch {}
      }
    }
    onToggle();
  };

  return (
    <div className="flex flex-col gap-2 pb-4 border-b border-[#E0E0D0] last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <span className="material-symbols-outlined text-secondary text-[22px] flex-shrink-0 mt-0.5">
            {meta.icon}
          </span>
          <div className="min-w-0">
            <p className="font-body-lg text-body-lg text-primary-container font-semibold truncate">
              {reminder.title}
            </p>
            <p className="font-label-caps text-label-caps text-slate-500">{reminder.time}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!!reminder.enabled}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
        </label>
      </div>
      {meta.description && (
        <p className="text-xs text-on-surface-variant pl-[34px]">
          {meta.description}
          {meta.cta && (
            <button
              onClick={() => navigate(meta.route)}
              className="ml-1 text-secondary font-button hover:underline"
            >
              {meta.cta} →
            </button>
          )}
        </p>
      )}
    </div>
  );
}
