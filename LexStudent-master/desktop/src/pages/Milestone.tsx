import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMilestone, useMilestoneMutations } from '../hooks/useBadges'

export default function Milestone() {
  const navigate = useNavigate()
  const { data: milestone, isLoading } = useMilestone()
  const { create, update, remove } = useMilestoneMutations()

  const isEdit = !!milestone

  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title || '')
      setTargetDate(milestone.targetDate || '')
      setDescription(milestone.description || '')
    }
  }, [milestone])

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Please enter a milestone name')
    if (!targetDate) return setError('Please select a target date')
    if (targetDate < today) return setError('Target date must be in the future')

    try {
      if (isEdit) {
        await update.mutateAsync({ id: milestone.id, title, targetDate, description })
      } else {
        await create.mutateAsync({ title, targetDate, description })
      }
      navigate('/')
    } catch {
      setError('Failed to save milestone. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (!milestone) return
    try {
      await remove.mutateAsync(milestone.id)
      navigate('/')
    } catch {
      setError('Failed to delete milestone.')
    }
  }

  if (isLoading) return <div className="p-8 text-center text-on-surface-variant">Loading...</div>

  const daysUntil = targetDate
    ? Math.max(0, Math.ceil((new Date(targetDate + 'T00:00:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-on-surface-variant font-body-md hover:text-primary-container transition-colors inline-flex items-center gap-1 mb-4"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Dashboard
      </button>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="bg-primary text-on-primary p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
          </div>
          <h1 className="font-h2 text-h2">{isEdit ? 'Edit Milestone' : 'Set a Milestone'}</h1>
          <p className="text-on-primary/70 text-sm mt-1">
            {isEdit ? 'Update your upcoming target' : 'Set a goal to count down to'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-sm">error</span>
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">Milestone Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bar Finals, Mock Exam, Submission Deadline"
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">Target Date</label>
            <input
              type="date"
              value={targetDate}
              min={today}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
            />
            {daysUntil !== null && targetDate >= today && (
              <p className="mt-1.5 text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                {daysUntil === 0 ? "That's today!" : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} from now`}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">
              Description <span className="font-normal text-on-surface-variant">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add a note or reminder for yourself..."
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="flex-1 px-6 py-3 bg-primary-container text-white rounded-xl font-button hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {(create.isPending || update.isPending) ? 'Saving...' : isEdit ? 'Update Milestone' : 'Set Milestone'}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={remove.isPending}
                className="px-4 py-3 border border-error/30 text-error rounded-xl font-button hover:bg-error/5 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
