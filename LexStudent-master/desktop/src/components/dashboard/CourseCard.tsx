export default function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30">
      <h4 className="font-h3 text-h3 text-primary">{course?.name}</h4>
    </div>
  )
}
