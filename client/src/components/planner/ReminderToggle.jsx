import React from 'react';

export default function ReminderToggle({ reminder, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-body-lg text-body-lg text-primary-container font-semibold">{reminder.title}</p>
        <p className="font-label-caps text-label-caps text-slate-500">{reminder.time}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={reminder.enabled}
          onChange={onToggle}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
      </label>
    </div>
  );
}
