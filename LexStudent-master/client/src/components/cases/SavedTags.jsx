import React from 'react';

const defaultTags = ['Constitutional', 'Criminal', 'Contract', 'Equity', 'International'];

export default function SavedTags({ tags }) {
  const list = tags?.length ? tags : defaultTags;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
      <h3 className="font-h3 text-primary text-lg mb-4">Saved Tags</h3>
      <div className="flex flex-wrap gap-2">
        {list.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-background text-primary border border-outline-variant rounded-full text-xs font-medium cursor-pointer hover:bg-primary hover:text-on-primary transition-colors">{tag}</span>
        ))}
      </div>
    </div>
  );
}
