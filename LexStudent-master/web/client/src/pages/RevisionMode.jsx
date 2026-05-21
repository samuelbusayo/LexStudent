import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStreak, useKnowledgeGaps } from '../hooks/useProgress';
import api from '../services/api';
import StreakHero from '../components/revision/StreakHero';
import KnowledgeGapCard from '../components/revision/KnowledgeGapCard';
import Heatmap from '../components/revision/Heatmap';
import SummaryCard from '../components/revision/SummaryCard';

export default function RevisionMode() {
  const { data: streak } = useStreak();
  const { data: gapsFromApi } = useKnowledgeGaps();
  const { data: summariesFromApi } = useQuery({
    queryKey: ['summaries'],
    queryFn: () => api.get('/summaries').then(r => r.data),
  });

  const gaps = gapsFromApi || [
    { id: 1, subject: 'Evidence', topic: 'Hearsay Rule', progress: 25, lastReviewed: '4 days ago' },
    { id: 2, subject: 'Property Law', topic: 'Adverse Possession', progress: 33, lastReviewed: '1 week ago' },
    { id: 3, subject: 'Criminal Law', topic: 'Mens Rea', progress: 50, lastReviewed: '2 days ago' },
    { id: 4, subject: 'Constitutional', topic: 'Commerce Clause', progress: 20, lastReviewed: 'Unread Topic' },
  ];

  const summaries = summariesFromApi || [
    {
      id: 1,
      subject: 'Torts',
      title: 'Duty of Care Elements',
      content: '"Foreseeability, Proximity, and whether it\'s fair/just to impose duty..."',
    },
    {
      id: 2,
      subject: 'Contracts',
      title: 'Promissory Estoppel',
      content: '"Detrimental reliance on a promise, even without formal consideration..."',
    },
    {
      id: 3,
      subject: 'Property',
      title: 'Easements in Gross',
      content: '"Personal right to use land, does not run with the dominant estate..."',
    },
  ];

  return (
    <main className="px-container-padding py-6 max-w-7xl mx-auto space-y-stack-lg">
      <StreakHero streak={streak} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-[#E0E0D0] space-y-stack-md">
          <div className="flex justify-between items-center">
            <h3 className="font-h2 text-primary-container">Knowledge Gaps</h3>
            <span className="text-label-caps text-on-surface-variant">Review Priority: High</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-sm">
            {(gaps).map((gap) => (
              <KnowledgeGapCard key={gap.id} gap={gap} />
            ))}
          </div>
        </div>

        <Heatmap />
      </div>

      <section className="space-y-stack-md">
        <div className="flex justify-between items-end">
          <h3 className="font-h2 text-primary-container">Personal Summaries</h3>
          <button className="text-secondary font-button flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px]">add</span>
            View All
          </button>
        </div>
        <div className="flex gap-gutter overflow-x-auto pb-4 scrollbar-hide">
          {summaries.map((s) => (
            <SummaryCard key={s.id} summary={s} />
          ))}
        </div>
      </section>

      <section className="bg-primary-container rounded-2xl p-8 text-center space-y-stack-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">menu_book</span>
        </div>
        <h2 className="font-h1 text-white relative z-10">Ready to Review?</h2>
        <p className="text-white/80 font-body-lg max-w-md mx-auto relative z-10">You have 4 topics identified as &ldquo;Critical&rdquo; for your upcoming exams.</p>
        <button className="bg-secondary text-primary font-button px-stack-lg py-4 rounded-full relative z-10 hover:brightness-110 active:scale-95 transition-all">
          Start Revision Session
        </button>
      </section>
    </main>
  );
}
