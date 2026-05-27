import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCourse, useTopics } from '../hooks/useCourses';
import TopicCard from '../components/courses/TopicCard';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: topics } = useTopics(courseId);
  const [search, setSearch] = useState('');

  const filteredTopics = (topics || []).filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="font-body-md text-body-md text-on-surface-variant">Loading course...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-stack-md">
        <div>
          <h1 className="font-h2 text-h2 text-primary-container">{course?.name}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">{course?.description}</p>
        </div>
        <Link
          to={`/courses/${courseId}/topics/new`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Topic
        </Link>
      </div>

      {(() => {
        const topicsArr = topics || [];
        const totalTopicCount = topicsArr.length;
        const completedCount = topicsArr.filter(t => {
          const selected = t.selectedPages || [];
          const total = selected.length;
          return t.pagesRead >= total && total > 0;
        }).length;
        let courseProgress = 0;
        if (totalTopicCount > 0) {
          const sum = topicsArr.reduce((acc, t) => {
            const selected = t.selectedPages || [];
            const total = selected.length;
            if (total <= 0) return acc;
            return acc + Math.min(1, (t.pagesRead || 0) / total);
          }, 0);
          courseProgress = Math.round((sum / totalTopicCount) * 100);
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
            <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-on-surface-variant">Total Topics</p>
              <p className="font-h2 text-h2 text-primary-container mt-1">{totalTopicCount}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-on-surface-variant">Progress</p>
              <p className="font-h2 text-h2 text-primary-container mt-1">{courseProgress}%</p>
              <p className="text-xs text-on-surface-variant mt-1">{completedCount}/{totalTopicCount} topics completed</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-on-surface-variant">Materials</p>
              <p className="font-h2 text-h2 text-primary-container mt-1">
                {topicsArr.filter((t) => t.hasMaterials).length} Files
              </p>
            </div>
          </div>
        );
      })()}

      <div className="flex items-center gap-gutter mb-stack-md">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2.5 text-body-md focus:ring-2 focus:ring-primary"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredTopics.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-4">menu_book</span>
          <p className="font-body-md">No topics yet. Click &ldquo;Add Topic&rdquo; to get started.</p>
        </div>
      ) : (
        <div className="space-y-stack-sm">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} courseId={courseId} />
          ))}
        </div>
      )}
    </div>
  );
}
