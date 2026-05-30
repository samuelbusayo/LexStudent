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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="font-h2 text-h2 text-primary-container">Set New Goal</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Subject</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full border border-[#E0E0D0] rounded-lg px-3 py-2 font-body-md text-primary-container bg-white"
            >
              <option value="">Select a subject...</option>
              {(courses || []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCourseId && (
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Topic (optional)</label>
              <select
                value={selectedTopicId}
                onChange={e => setSelectedTopicId(e.target.value)}
                className="w-full border border-[#E0E0D0] rounded-lg px-3 py-2 font-body-md text-primary-container bg-white"
              >
                <option value="">No specific topic</option>
                {(topics || []).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Read 5 pages of Property Law"
              required
              className="w-full border border-[#E0E0D0] rounded-lg px-3 py-2 font-body-md text-primary-container placeholder:text-on-surface-variant/50"
            />
          </div>

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Focus on specific areas..."
              className="w-full border border-[#E0E0D0] rounded-lg px-3 py-2 font-body-md text-primary-container placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Target (pages)</label>
              <input
                type="number"
                min="0"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                className="w-full border border-[#E0E0D0] rounded-lg px-3 py-2 font-body-md text-primary-container"
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-[#E0E0D0] rounded-lg px-3 py-2 font-body-md text-primary-container"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-[#E0E0D0] text-on-surface-variant px-4 py-2.5 rounded-lg font-button text-button">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-primary-container text-white px-4 py-2.5 rounded-lg font-button text-button">
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
