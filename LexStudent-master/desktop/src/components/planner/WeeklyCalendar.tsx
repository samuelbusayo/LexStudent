const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface WeeklyCalendarProps {
  events?: any[]
  currentDay?: number
}

export default function WeeklyCalendar({ events = [], currentDay }: WeeklyCalendarProps) {
  const today = currentDay ?? new Date().getDay()
  // JS: 0=Sun, shift to Mon=0
  const adjustedToday = today === 0 ? 6 : today - 1

  return (
    <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30">
      <h3 className="font-h3 text-h3 text-primary mb-4">This Week</h3>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day, i) => {
          const isToday = i === adjustedToday
          const hasEvent = events.some((e: any) => e.day === i)
          return (
            <div key={day} className="text-center">
              <span className="text-[10px] text-on-surface-variant font-medium block mb-1">{day}</span>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isToday
                    ? 'bg-secondary text-white'
                    : hasEvent
                    ? 'bg-secondary-container/30 text-secondary'
                    : 'text-on-surface-variant'
                }`}
              >
                {i + 1}
              </div>
              {hasEvent && !isToday && (
                <div className="w-1 h-1 bg-secondary rounded-full mx-auto mt-1" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
