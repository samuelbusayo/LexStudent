import { Link } from 'react-router-dom'

interface CourseCardProps {
  course: any
  className?: string
}

export default function CourseCard({ course, className = '' }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className={`block bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex justify-between items-start mb-stack-md">
        <span className="bg-on-primary-container/10 text-on-primary-container text-[10px] px-2 py-1 rounded font-bold uppercase">
          {course.type || 'CORE'}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">more_vert</span>
      </div>

      <h4 className="font-h3 text-h3 text-primary mb-1">{course.name}</h4>
      <p className="text-xs text-on-surface-variant mb-stack-md">
        {course.completedTopics ?? 0}/{course.totalTopics ?? 0} Topics
      </p>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-primary">
          <span>Progress</span>
          <span>{course.progressPercent ?? 0}%</span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
          <div
            className="bg-secondary h-full transition-all duration-1000"
            style={{ width: `${course.progressPercent ?? 0}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
