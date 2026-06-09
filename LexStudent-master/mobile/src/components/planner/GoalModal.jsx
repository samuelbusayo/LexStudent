import React, { useState, useEffect } from 'react';
import { useCourses, useTopics } from '../../hooks/useCourses';

export default function GoalModal({ defaultDate, onSubmit, onClose }) {
  const { courses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [targetAmount, setTargetAmount] = useState(5);
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));

  const { data: topics } = useTopics(selectedCourseId || null);

  useEffect(() => {
    setSelectedTopicId('');
  }, [selectedCourseId]);

  const selectedCourse = (courses || []).find(c => String(c.id) === String(selectedCourseId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      subjectTag: selectedCourse?.name?.toUpperCase().split(' ')[0] || '',
      title: title.trim(),
      note,
      targetAmount: Number(targetAmount) || 0,
      topicId: selectedTopicId ? Number(selectedTopicId) : null,
      date,
      status: 'not_started',
      progress: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md sm:mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="font-h2 text-xl text-primary">Set New Goal</h2>
          <button onClick={onClose} className="text-on-surface-variant active:text-primary p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5 tracking-widest">SUBJECT</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full border border-[#E0E0D0] rounded-xl px-4 py-3 font-body-md text-primary bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30"
            >
              <option value="">Select a subject...</option>
              {(courses || []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCourseId && (
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5 tracking-widest">TOPIC (OPTIONAL)</label>
              <select
                value={selectedTopicId}
                onChange={e => setSelectedTopicId(e.target.value)}
                className="w-full border border-[#E0E0D0] rounded-xl px-4 py-3 font-body-md text-primary bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                <option value="">No specific topic</option>
                {(topics || []).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5 tracking-widest">GOAL TITLE</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Read 5 pages of Property Law"
              required
              className="w-full border border-[#E0E0D0] rounded-xl px-4 py-3 font-body-md text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5 tracking-widest">NOTE (OPTIONAL)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Focus on specific areas..."
              className="w-full border border-[#E0E0D0] rounded-xl px-4 py-3 font-body-md text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5 tracking-widest">TARGET (PAGES)</label>
              <input
                type="number"
                min="0"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                className="w-full border border-[#E0E0D0] rounded-xl px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5 tracking-widest">DATE</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-[#E0E0D0] rounded-xl px-4 py-3 font-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-[#E0E0D0] text-on-surface-variant px-4 py-3 rounded-xl font-button text-button active:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-primary-container text-white px-4 py-3 rounded-xl font-button text-button active:scale-[0.98] transition-transform">
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
