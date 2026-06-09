import React from 'react';

export default function ReminderToggle({ reminder, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-body-md text-primary font-bold">{reminder.title}</p>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-0.5">{reminder.time}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={reminder.enabled}
          onChange={onToggle}
        />
        <div className="w-12 h-7 bg-outline-variant/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-primary-container"></div>
      </label>
    </div>
  );
}
