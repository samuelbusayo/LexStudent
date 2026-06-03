import { useState, useEffect, useMemo } from 'react'
import { useCourses, useTopics } from '../../hooks/useCourses'

interface GoalModalProps {
  defaultDate: string
  onSubmit: (data: any) => void
  onClose: () => void
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface DateCell {
  dateStr: string
  day: number
  isToday: boolean
  isPast: boolean
}

function getDateGrid(): DateCell[] {
  const today = new Date()
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? 6 : dow - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - mondayOffset)

  const days: DateCell[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push({
      dateStr: d.toISOString().slice(0, 10),
      day: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      isPast: d < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    })
  }
  return days
}

export default function GoalModal({ defaultDate, onSubmit, onClose }: GoalModalProps) {
  const { courses } = useCourses()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [targetPages, setTargetPages] = useState<number[]>([])
  const [targetAmount, setTargetAmount] = useState<number | string>(5)
  const [selectedDates, setSelectedDates] = useState<string[]>(
    defaultDate ? [defaultDate] : [new Date().toISOString().slice(0, 10)]
  )

  const { data: topics } = useTopics(selectedCourseId || '')
  const dateGrid = useMemo(() => getDateGrid(), [])

  useEffect(() => {
    setSelectedTopicId('')
    setTargetPages([])
  }, [selectedCourseId])

  useEffect(() => {
    setTargetPages([])
  }, [selectedTopicId])

  const selectedCourse = (courses || []).find((c: any) => String(c.id) === String(selectedCourseId))

  const selectedTopic = (topics || []).find((t: any) => String(t.id) === String(selectedTopicId)) as any
  const availablePages = useMemo(() => {
    if (!selectedTopic) return [] as number[]
    const sel = selectedTopic.selectedPages
    if (Array.isArray(sel) && sel.length > 0) {
      return [...sel].sort((a: number, b: number) => a - b)
    }
    const total = selectedTopic.totalDocumentPages || selectedTopic.totalPages || 0
    if (total <= 0) return [] as number[]
    return Array.from({ length: total }, (_, i) => i + 1)
  }, [selectedTopic])

  const toggleDate = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr].sort()
    )
  }

  const togglePage = (pageNum: number) => {
    setTargetPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || selectedDates.length === 0) return
    onSubmit({
      subjectTag: (selectedCourse as any)?.name?.toUpperCase().split(' ')[0] || '',
      title: title.trim(),
      note,
      targetPages: selectedTopicId ? targetPages : [],
      targetAmount: selectedTopicId && targetPages.length > 0 ? targetPages.length : Number(targetAmount) || 0,
      topicId: selectedTopicId ? Number(selectedTopicId) : null,
      dates: selectedDates,
      status: 'not_started',
      progress: 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-h2 text-primary-container">Set New Goal</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="font-label-caps text-on-surface-variant block mb-1">Subject</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 font-body-md text-primary-container bg-white"
            >
              <option value="">Select a subject...</option>
              {(courses || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          {selectedCourseId && (
            <div>
              <label className="font-label-caps text-on-surface-variant block mb-1">Topic (optional)</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 font-body-md text-primary-container bg-white"
              >
                <option value="">No specific topic</option>
                {(topics || []).map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Goal Title */}
          <div>
            <label className="font-label-caps text-on-surface-variant block mb-1">Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 5 pages of Property Law"
              required
              className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 font-body-md text-primary-container bg-white placeholder:text-on-surface-variant/50"
            />
          </div>

          {/* Note */}
          <div>
            <label className="font-label-caps text-on-surface-variant block mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Focus on specific areas..."
              className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 font-body-md text-primary-container bg-white placeholder:text-on-surface-variant/50"
            />
          </div>

          {/* Page picker OR manual target */}
          {selectedTopicId && availablePages.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-label-caps text-on-surface-variant">
                  Target Pages
                  {targetPages.length > 0 && (
                    <span className="text-secondary ml-2 normal-case font-normal">({targetPages.length} selected)</span>
                  )}
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setTargetPages([...availablePages])}
                    className="text-[10px] px-2 py-0.5 rounded border border-secondary/30 text-secondary hover:bg-secondary/10 font-button"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetPages([])}
                    className="text-[10px] px-2 py-0.5 rounded border border-secondary/30 text-secondary hover:bg-secondary/10 font-button"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto border border-outline-variant/30 rounded-lg p-2 bg-surface-container-low">
                {availablePages.map((p: number) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePage(p)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                      targetPages.includes(p)
                        ? 'bg-secondary text-white'
                        : 'bg-white border border-outline-variant/30 text-primary-container hover:border-secondary/50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="font-label-caps text-on-surface-variant block mb-1">Target (pages)</label>
              <input
                type="number"
                min="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 font-body-md text-primary-container bg-white"
              />
            </div>
          )}

          {/* Multi-day picker */}
          <div>
            <label className="font-label-caps text-on-surface-variant block mb-1">
              Schedule
              {selectedDates.length > 0 && (
                <span className="text-secondary ml-2 normal-case font-normal">
                  ({selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''})
                </span>
              )}
            </label>
            <div className="grid grid-cols-7 gap-1.5 border border-outline-variant/30 rounded-lg p-2 bg-surface-container-low">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-center text-[9px] font-bold text-on-surface-variant/60 uppercase">{d}</div>
              ))}
              {dateGrid.map((d) => (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => !d.isPast && toggleDate(d.dateStr)}
                  className={`h-8 rounded text-xs font-bold transition-colors ${
                    selectedDates.includes(d.dateStr)
                      ? 'bg-secondary text-white'
                      : d.isPast
                        ? 'text-slate-300 cursor-not-allowed bg-transparent'
                        : d.isToday
                          ? 'bg-white border-2 border-secondary/40 text-primary-container hover:bg-secondary/10'
                          : 'bg-white border border-outline-variant/30 text-primary-container hover:border-secondary/50'
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-outline-variant/30 text-on-surface-variant px-4 py-2.5 rounded-lg font-button">
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedDates.length === 0}
              className="flex-1 bg-primary-container text-white px-4 py-2.5 rounded-lg font-button disabled:opacity-50"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
