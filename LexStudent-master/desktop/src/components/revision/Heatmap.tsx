interface HeatmapProps {
  data?: { date: string; count: number }[]
}

export default function Heatmap({ data = [] }: HeatmapProps) {
  // Generate last 12 weeks of cells
  const weeks = 12
  const today = new Date()
  const cells: { date: string; count: number; day: number; week: number }[] = []

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (w * 7 + (6 - d)))
      const dateStr = date.toISOString().split('T')[0]
      const found = data.find((item) => item.date === dateStr)
      cells.push({ date: dateStr, count: found?.count ?? 0, day: d, week: weeks - 1 - w })
    }
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-surface-container'
    if (count <= 1) return 'bg-secondary/20'
    if (count <= 3) return 'bg-secondary/40'
    if (count <= 5) return 'bg-secondary/70'
    return 'bg-secondary'
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30">
      <h3 className="font-h3 text-h3 text-primary mb-4">Study Activity</h3>
      <div className="overflow-x-auto">
        <div className="grid grid-rows-7 grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${getColor(cell.count)} cursor-help`}
              title={`${cell.date}: ${cell.count} sessions`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 justify-end">
        <span className="text-[10px] text-on-surface-variant mr-1">Less</span>
        <div className="w-3 h-3 rounded-sm bg-surface-container" />
        <div className="w-3 h-3 rounded-sm bg-secondary/20" />
        <div className="w-3 h-3 rounded-sm bg-secondary/40" />
        <div className="w-3 h-3 rounded-sm bg-secondary/70" />
        <div className="w-3 h-3 rounded-sm bg-secondary" />
        <span className="text-[10px] text-on-surface-variant ml-1">More</span>
      </div>
    </div>
  )
}
