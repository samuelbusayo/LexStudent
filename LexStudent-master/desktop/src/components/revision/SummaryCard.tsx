interface SummaryCardProps {
  icon: string
  label: string
  value: string | number
  color?: 'primary' | 'secondary' | 'green' | 'error'
}

export default function SummaryCard({ icon, label, value, color = 'primary' }: SummaryCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/5',
    secondary: 'text-secondary bg-secondary/5',
    green: 'text-green-600 bg-green-50',
    error: 'text-error bg-error/5',
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="text-2xl font-h2 text-on-surface">{value}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{label}</p>
    </div>
  )
}
