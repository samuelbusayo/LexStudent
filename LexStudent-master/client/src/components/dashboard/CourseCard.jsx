export default function CourseCard({ course }) {
  const percentage = course.progressPercent ?? 0;

  return (
    <div className="bg-white p-stack-md rounded-xl border border-[#E0E0D0] hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-stack-sm">
        <div>
          <h4 className="font-h3 text-h3 text-primary-container">{course.name}</h4>
          <span className="inline-block mt-1 px-2 py-0.5 bg-primary-container/5 rounded-full text-[10px] font-bold text-primary-container">CORE</span>
        </div>
        <span className="font-label-caps text-label-caps text-secondary">{course.completedTopics ?? 0}/{course.totalTopics ?? 0} TOPICS</span>
      </div>
      <div className="w-full h-[4px] bg-primary-container/10 rounded-full overflow-hidden">
        <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
