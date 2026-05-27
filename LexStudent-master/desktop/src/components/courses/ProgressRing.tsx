interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ProgressRing({ percent, size = 64, strokeWidth = 4, className = '' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(100, Math.max(0, percent)) / 100)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-container-high"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-secondary transition-all duration-1000"
        />
      </svg>
      <span className="absolute font-h3 text-h3 text-on-surface">{Math.round(percent)}%</span>
    </div>
  )
}
