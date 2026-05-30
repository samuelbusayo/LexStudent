import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useKnowledgeGaps } from '../hooks/useProgress';
import api from '../services/api';

const RATINGS = [
  { key: 'got_it', label: 'Got it', icon: 'check_circle', color: 'text-green-600 border-green-200 hover:bg-green-50' },
  { key: 'shaky', label: 'Shaky', icon: 'help', color: 'text-amber-600 border-amber-200 hover:bg-amber-50' },
  { key: 'forgot', label: 'Forgot', icon: 'cancel', color: 'text-red-600 border-red-200 hover:bg-red-50' },
];

export default function RevisionSession() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: allGaps, isLoading } = useKnowledgeGaps();

  const gaps = (allGaps || []).slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [isRating, setIsRating] = useState(false);

  const reviewMutation = useMutation({
    mutationFn: ({ topicId, rating }) =>
      api.post('/progress/review', { topicId, rating }).then(r => r.data),
  });

  const handleRate = async (rating) => {
    const topic = gaps[currentIndex];
    setIsRating(true);
    try {
      await reviewMutation.mutateAsync({ topicId: topic.id, rating });
      setResults(prev => [...prev, { topic: topic.topic, rating }]);
      if (currentIndex < gaps.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        queryClient.invalidateQueries({ queryKey: ['progress'] });
      }
    } finally {
      setIsRating(false);
    }
  };

  const isComplete = results.length === gaps.length && gaps.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-on-surface-variant font-body-md">Loading session...</p>
      </div>
    );
  }

  if (gaps.length === 0) {
    return (
      <div className="px-container-padding py-12 max-w-2xl mx-auto text-center space-y-4">
        <span className="material-symbols-outlined text-secondary text-[64px]">celebration</span>
        <h1 className="font-h1 text-h1 text-primary-container">All Caught Up!</h1>
        <p className="text-on-surface-variant font-body-lg">No topics need review right now. Great work!</p>
        <button onClick={() => navigate('/revision')} className="bg-primary-container text-white px-6 py-3 rounded-xl font-button text-button">
          Back to Revision
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="px-container-padding py-12 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="material-symbols-outlined text-secondary text-[64px]">emoji_events</span>
          <h1 className="font-h1 text-h1 text-primary-container">Session Complete!</h1>
          <p className="text-on-surface-variant font-body-lg">You reviewed {results.length} topic{results.length !== 1 ? 's' : ''}.</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E0E0D0] p-6 space-y-3">
          <h3 className="font-h3 text-primary-container">Results</h3>
          {results.map((r, i) => {
            const ratingInfo = RATINGS.find(rt => rt.key === r.rating);
            return (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#E0E0D0] last:border-0">
                <span className="font-body-md text-primary-container">{r.topic}</span>
                <div className="flex items-center gap-1">
                  <span className={`material-symbols-outlined text-sm ${ratingInfo?.color.split(' ')[0]}`}>{ratingInfo?.icon}</span>
                  <span className="font-label-caps text-on-surface-variant">{ratingInfo?.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button onClick={() => navigate('/revision')} className="bg-primary-container text-white px-8 py-3 rounded-xl font-button text-button">
            Back to Revision
          </button>
        </div>
      </div>
    );
  }

  const topic = gaps[currentIndex];

  return (
    <div className="px-container-padding py-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/revision')} className="text-on-surface-variant hover:text-primary-container flex items-center gap-1 font-button">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Exit
        </button>
        <span className="font-label-caps text-on-surface-variant">
          {currentIndex + 1} / {gaps.length}
        </span>
      </div>

      <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden">
        <div className="h-full bg-secondary transition-all" style={{ width: `${((currentIndex) / gaps.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-xl border border-[#E0E0D0] p-8 space-y-4">
        <span className="bg-primary-container/5 text-primary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
          {topic.subject}
        </span>
        <h2 className="font-h1 text-h1 text-primary-container">{topic.topic}</h2>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="font-body-md">Mastery: {topic.progress}%</span>
          <span className="font-body-md">Last reviewed: {topic.lastReviewed}</span>
        </div>
        <div className="h-1.5 w-full bg-primary-container/10 rounded-full overflow-hidden">
          <div className="h-full bg-secondary" style={{ width: `${topic.progress}%` }} />
        </div>
        <p className="font-body-lg text-on-surface-variant pt-4 border-t border-[#E0E0D0]">
          Take a moment to recall what you know about <strong className="text-primary-container">{topic.topic}</strong> in the context of <strong className="text-primary-container">{topic.subject}</strong>.
          How confident are you?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {RATINGS.map(r => (
          <button
            key={r.key}
            onClick={() => handleRate(r.key)}
            disabled={isRating}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 ${r.color}`}
          >
            <span className="material-symbols-outlined text-2xl">{r.icon}</span>
            <span className="font-button text-button">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
