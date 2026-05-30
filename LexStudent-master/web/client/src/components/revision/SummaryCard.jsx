import React from 'react';
import { Link } from 'react-router-dom';

export default function SummaryCard({ summary }) {
  const title = summary.topicName || summary.text?.split('\n')[0]?.slice(0, 60) || 'Note';

  return (
    <Link
      to={`/courses/${summary.courseId}/topics/${summary.topicId}/read?page=${summary.page}`}
      className="min-w-[280px] bg-white rounded-xl p-5 border border-[#E0E0D0] space-y-3 block hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between">
        <span className="font-label-caps text-secondary">{summary.courseName}</span>
        <span className="text-xs text-on-surface-variant">p.{summary.page}</span>
      </div>
      <p className="font-h3 text-primary leading-tight">{title}</p>
      <p className="text-body-md text-on-surface-variant line-clamp-3 italic">{summary.text}</p>
    </Link>
  );
}
