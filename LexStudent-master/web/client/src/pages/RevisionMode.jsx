import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useStreak } from '../hooks/useProgress';
import api from '../services/api';
import StreakHero from '../components/revision/StreakHero';
import SummaryCard from '../components/revision/SummaryCard';

export default function RevisionMode() {
  const { data: streak } = useStreak();
  const navigate = useNavigate();
  const { data: summaries } = useQuery({
    queryKey: ['summaryFeed'],
    queryFn: () => api.get('/study-notes').then(r => r.data),
  });

  return (
    <main className="px-container-padding py-6 max-w-7xl mx-auto space-y-stack-lg">
      <StreakHero streak={streak} />

      <section className="space-y-stack-md">
        <div className="flex justify-between items-end">
          <h3 className="font-h2 text-primary-container">Personal Summaries</h3>
          <button className="text-secondary font-button flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px]">add</span>
            View All
          </button>
        </div>
        <div className="flex gap-gutter overflow-x-auto pb-4 scrollbar-hide">
          {(summaries || []).length === 0 ? (
            <p className="text-on-surface-variant font-body-md py-4">No notes yet. Start reading and add notes to see them here.</p>
          ) : (
            (summaries || []).map((s) => (
              <SummaryCard key={s.topicId} summary={s} />
            ))
          )}
        </div>
      </section>

      <section className="bg-primary-container rounded-2xl p-8 text-center space-y-stack-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">menu_book</span>
        </div>
        <h2 className="font-h1 text-white relative z-10">Ready to Review?</h2>
        <p className="text-white/80 font-body-lg max-w-md mx-auto relative z-10">
          Test your knowledge across your courses.
        </p>
        <button
          onClick={() => navigate('/revision/quiz')}
          className="bg-secondary text-primary font-button px-stack-lg py-4 rounded-full relative z-10 hover:brightness-110 active:scale-95 transition-all"
        >
          Start Revision Session
        </button>
      </section>
    </main>
  );
}
