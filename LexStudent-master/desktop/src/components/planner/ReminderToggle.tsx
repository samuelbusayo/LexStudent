interface ReminderToggleProps {
  reminder: any
  onToggle: (id: string) => void
}

export default function ReminderToggle({ reminder, onToggle }: ReminderToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-body-md text-on-surface font-medium">{reminder.title}</p>
        <p className="text-xs text-on-surface-variant">{reminder.time}</p>
      </div>
      <button
        onClick={() => onToggle(reminder.id)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          reminder.enabled ? 'bg-secondary' : 'bg-surface-container-high'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            reminder.enabled ? 'left-5' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}
