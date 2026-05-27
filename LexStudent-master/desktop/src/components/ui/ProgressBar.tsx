interface ProgressBarProps {
  value: number
  className?: string
  trackClass?: string
  fillClass?: string
}

export default function ProgressBar({ value, className = '', trackClass = '', fillClass = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-surface-container h-1.5 rounded-full overflow-hidden ${trackClass} ${className}`}>
      <div
        className={`h-full transition-all duration-1000 ${fillClass || 'bg-secondary'}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
