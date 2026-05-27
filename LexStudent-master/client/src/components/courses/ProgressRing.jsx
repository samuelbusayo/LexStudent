import React from 'react';

export default function ProgressRing({ value = 0 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          fill="transparent"
          r="42"
          stroke="currentColor"
          strokeWidth="6"
          className="text-primary-container opacity-10"
        />
        <circle
          cx="50"
          cy="50"
          fill="transparent"
          r="42"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="6"
          className="text-[#002147]"
          style={{ transition: 'stroke-dashoffset 0.35s', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-h1 text-h2 text-primary-container">{Math.round(value)}%</span>
        <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Complete</span>
      </div>
    </div>
  );
}
