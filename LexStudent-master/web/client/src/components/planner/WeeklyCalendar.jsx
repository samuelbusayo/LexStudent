import React, { useMemo } from 'react';

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTH_NAMES = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

function getWeekDays() {
  const today = new Date();
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? 6 : dow - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      label: DAY_LABELS[i],
      date: d.getDate(),
      dateStr: d.toISOString().slice(0, 10),
      isToday: d.toDateString() === today.toDateString(),
      isPast: d < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    });
  }

  const weekNum = Math.ceil(((monday - new Date(monday.getFullYear(), 0, 1)) / 86400000 + 1) / 7);

  return { days, month: MONTH_NAMES[monday.getMonth()], year: monday.getFullYear(), weekNum };
}

export default function WeeklyCalendar({ selectedDate, onSelectDate, goalDates }) {
  const { days, month, year, weekNum } = useMemo(() => getWeekDays(), []);
  const goalDateSet = useMemo(() => new Set(goalDates || []), [goalDates]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-8">
      <div className="md:hidden flex justify-between items-center mb-2 px-1">
        <span className="font-label-caps text-label-caps text-primary-container">{month} {year}</span>
        <span className="font-label-caps text-label-caps text-secondary">WEEK {weekNum}</span>
      </div>
      {days.map((d) => {
        const isSelected = selectedDate === d.dateStr;
        const hasGoal = goalDateSet.has(d.dateStr);

        if (d.isToday || isSelected) {
          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate?.(d.dateStr)}
              className={`bg-white p-4 rounded-xl border-2 shadow-md flex flex-col items-center justify-center ring-2 transition-all ${
                isSelected
                  ? 'border-secondary-container ring-secondary-container/20'
                  : 'border-secondary-container/50 ring-secondary-container/10'
              }`}
            >
              <span className="font-label-caps text-label-caps text-secondary">{d.label}</span>
              <span className="font-h3 text-h3 text-primary-container font-bold">{d.date}</span>
              {(hasGoal || d.isToday) && <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1"></div>}
            </button>
          );
        }
        if (d.isPast) {
          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate?.(d.dateStr)}
              className="bg-white p-4 rounded-xl border border-[#E0E0D0] flex flex-col items-center justify-center opacity-60 hover:opacity-80 transition-opacity"
            >
              <span className="font-label-caps text-label-caps text-slate-400">{d.label}</span>
              <span className="font-h3 text-h3 text-slate-400">{d.date}</span>
              {hasGoal && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1"></div>}
            </button>
          );
        }
        return (
          <button
            key={d.dateStr}
            onClick={() => onSelectDate?.(d.dateStr)}
            className="bg-white p-4 rounded-xl border border-[#E0E0D0] flex flex-col items-center justify-center hover:border-secondary-container/40 transition-colors"
          >
            <span className="font-label-caps text-label-caps text-slate-500">{d.label}</span>
            <span className="font-h3 text-h3 text-primary-container">{d.date}</span>
            {hasGoal && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1"></div>}
          </button>
        );
      })}
    </section>
  );
}
