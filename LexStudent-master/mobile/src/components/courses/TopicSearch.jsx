import React from 'react';

export default function TopicSearch({ value, onChange }) {
  return (
    <div className="relative w-full">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search subtopics or modules..."
        className="w-full pl-10 pr-4 py-3 bg-white border border-[#E0E0D0] rounded-xl font-body-md text-body-md focus:outline-none focus:border-primary-container transition-all"
      />
    </div>
  );
}
