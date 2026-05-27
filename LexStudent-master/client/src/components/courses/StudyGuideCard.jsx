import React from 'react';

export default function StudyGuideCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary-container p-stack-lg text-white">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <div>
          <h4 className="font-h2 text-h3 text-white mb-2">Study Guide: Exam Prep</h4>
          <p className="font-body-md text-surface-variant max-w-md">Download the curated review materials for the upcoming Ethics Board certification mock exam.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container font-button text-button rounded-xl hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined">download</span>
          Get Study Guide
        </button>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
    </div>
  );
}
