import CourseCard from './CourseCard';

export default function CourseList({ courses, overallProgress }) {
  return (
    <div className="grid grid-cols-1 gap-stack-sm">
      {(courses || []).map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
