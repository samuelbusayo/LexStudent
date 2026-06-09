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
    <section className="mb-2">
      {/* Month / Week header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="font-label-caps text-label-caps text-primary-container tracking-widest">{month} {year}</span>
        <span className="font-label-caps text-label-caps text-secondary tracking-widest">WEEK {weekNum}</span>
      </div>

      {/* Vertical day list */}
      <div className="space-y-2">
        {days.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          const hasGoal = goalDateSet.has(d.dateStr);

          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate?.(d.dateStr)}
              className={`w-full flex items-center justify-center flex-col py-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'bg-white border-secondary-container shadow-md ring-2 ring-secondary-container/20'
                  : d.isPast
                    ? 'bg-white border-outline-variant/10 opacity-50'
                    : 'bg-white border-outline-variant/10 hover:border-secondary-container/30'
              }`}
            >
              <span className={`font-label-caps text-label-caps tracking-widest ${
                isSelected ? 'text-secondary' : d.isPast ? 'text-outline' : 'text-on-surface-variant'
              }`}>{d.label}</span>
              <span className={`font-h3 text-2xl mt-0.5 ${
                isSelected ? 'text-primary-container font-bold' : d.isPast ? 'text-outline' : 'text-primary-container'
              }`}>{d.date}</span>
              {(hasGoal || (d.isToday && isSelected)) && (
                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-secondary' : 'bg-outline-variant'}`} />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
