import React from 'react';
import { Link } from 'react-router-dom';

export default function SummaryCard({ summary }) {
  const preview = summary.summaryBody
    ? (summary.summaryBody.length > 120
        ? summary.summaryBody.slice(0, 120) + '...'
        : summary.summaryBody)
    : null;

  return (
    <Link
      to={`/revision/summary/${summary.topicId}?courseId=${summary.courseId}`}
      className="min-w-[280px] bg-white rounded-xl p-5 border border-[#E0E0D0] space-y-3 block hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <span className="font-label-caps text-secondary">{summary.courseName}</span>
        {summary.highlightCount > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[12px]">highlight</span>
            {summary.highlightCount}
          </span>
        )}
      </div>
      <p className="font-h3 text-primary leading-tight">{summary.topicName}</p>
      {preview ? (
        <p className="text-body-md text-on-surface-variant line-clamp-3">{preview}</p>
      ) : (
        <p className="text-body-md text-on-surface-variant italic">
          {summary.highlightCount > 0
            ? `${summary.highlightCount} highlight${summary.highlightCount !== 1 ? 's' : ''} saved`
            : 'No summary yet'}
        </p>
      )}
    </Link>
  );
}
