import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopicCard({ topic, courseId }) {
  const navigate = useNavigate();
  return (
    <Link to={`/courses/${courseId}/topics/${topic.id}/read`} className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 hover:shadow-md transition-shadow block">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-h3 text-h3 text-primary-container">{topic.name}</h4>
            {topic.pagesRead === topic.totalPages && topic.totalPages > 0 && (
              <span className="text-xs text-secondary font-bold">COMPLETED</span>
            )}
          </div>
          <p className="font-body-md text-[14px] text-on-surface-variant">{topic.subtitle || ''}</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-on-surface-variant hover:bg-primary-container hover:text-white transition-all text-xs font-button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/courses/${courseId}/topics/${topic.id}/materials`); }}
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          {topic.hasMaterials ? 'Manage' : 'Upload'}
        </button>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span className="font-medium">Progress</span>
          <span className="font-bold">
            {topic.pagesRead ?? 0}/{topic.totalPages ?? 10} Pages
          </span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary transition-all duration-700"
            style={{
              width: `${Math.min(100, ((topic.pagesRead ?? 0) / (topic.totalPages ?? 10)) * 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </Link>
  );
}
