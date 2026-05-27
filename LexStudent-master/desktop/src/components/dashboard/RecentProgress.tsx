interface RecentProgressProps {
  courses: any[]
}

export default function RecentProgress({ courses = [] }: RecentProgressProps) {
  const filtered = courses.filter((c: any) => c.total_topics > 0).slice(0, 4)

  return (
    <section className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30">
      <h3 className="font-h3 text-h3 text-primary mb-stack-md">Recent Progress</h3>
      <div className="space-y-stack-md">
        {filtered.length === 0 && (
          <p className="text-sm text-on-surface-variant italic">No progress data yet.</p>
        )}
        {filtered.map((c: any) => (
          <div key={c.courseId} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-on-surface">{c.courseName}</p>
              <span className="text-xs font-bold text-secondary">{c.progressPercent}%</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full transition-all duration-1000"
                style={{ width: `${c.progressPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
