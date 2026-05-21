interface ProgressBarProps {
  value: number
  className?: string
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-surface-container h-1.5 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-secondary h-full transition-all duration-1000"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
