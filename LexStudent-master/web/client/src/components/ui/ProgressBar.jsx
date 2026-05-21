import React from 'react';

export default function ProgressBar({ value }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-secondary rounded-full transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
