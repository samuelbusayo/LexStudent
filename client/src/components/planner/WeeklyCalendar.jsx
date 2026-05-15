import React from 'react';

const weekDays = [
  { day: 'MON', date: 23, past: true },
  { day: 'TUE', date: 24, past: true },
  { day: 'WED', date: 25, past: false, today: true },
  { day: 'THU', date: 26, past: false },
  { day: 'FRI', date: 27, past: false, dot: true },
  { day: 'SAT', date: 28, past: false },
  { day: 'SUN', date: 29, past: false },
];

export default function WeeklyCalendar() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-8">
      <div className="md:hidden flex justify-between items-center mb-2 px-1">
        <span className="font-label-caps text-label-caps text-primary-container">OCTOBER 2023</span>
        <span className="font-label-caps text-label-caps text-secondary">WEEK 42</span>
      </div>
      {weekDays.map((d) => {
        if (d.today) {
          return (
            <div
              key={d.day}
              className="bg-white p-4 rounded-xl border-2 border-secondary-container shadow-md flex flex-col items-center justify-center ring-2 ring-secondary-container/20"
            >
              <span className="font-label-caps text-label-caps text-secondary">{d.day}</span>
              <span className="font-h3 text-h3 text-primary-container font-bold">{d.date}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1"></div>
            </div>
          );
        }
        if (d.past) {
          return (
            <div
              key={d.day}
              className="bg-white p-4 rounded-xl border border-[#E0E0D0] flex flex-col items-center justify-center opacity-60"
            >
              <span className="font-label-caps text-label-caps text-slate-400">{d.day}</span>
              <span className="font-h3 text-h3 text-slate-400">{d.date}</span>
            </div>
          );
        }
        return (
          <div
            key={d.day}
            className="bg-white p-4 rounded-xl border border-[#E0E0D0] flex flex-col items-center justify-center"
          >
            <span className="font-label-caps text-label-caps text-slate-500">{d.day}</span>
            <span className="font-h3 text-h3 text-primary-container">{d.date}</span>
            {d.dot && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1"></div>}
          </div>
        );
      })}
    </section>
  );
}
