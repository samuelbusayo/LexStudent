import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCreateTopic } from '../hooks/useCourses'

export default function AddTopic() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const createTopic = useCreateTopic()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return
    setError('')
    try {
      await createTopic.mutateAsync({ courseId: courseId!, name: name.trim() })
      navigate(`/courses/${courseId}`)
    } catch {
      setError('Failed to create topic. Please try again.')
    }
  }

  return (
    <div>
      <div className="mb-stack-lg">
        <Link to={`/courses/${courseId}`} className="text-on-surface-variant font-body-md hover:text-primary-container transition-colors inline-flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Course
        </Link>
        <h1 className="font-h1 text-h1 text-primary-container">Add New Topic</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Create a new topic for your course curriculum.</p>
      </div>

      <div className="max-w-2xl bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-sm">error</span>
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <div className="space-y-stack-md">
          <div>
            <label className="font-label-caps text-label-caps text-primary-container block mb-unit">
              Topic Name <span className="text-error">*</span>
            </label>
            <input
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body-md text-body-md focus:ring-2 focus:ring-primary"
              placeholder="e.g., Duty of Care"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
            />
          </div>

          <div>
            <label className="font-label-caps text-label-caps text-primary-container block mb-unit">Upload Materials</label>
            <p className="text-xs text-on-surface-variant mb-2">You can upload PDF materials after creating the topic.</p>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center opacity-60">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">cloud_upload</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Materials can be uploaded after topic creation</p>
              <p className="text-xs text-on-surface-variant mt-1">Supports PDF files for AI-powered note generation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-stack-lg pt-stack-md border-t border-outline-variant/30">
          <Link
            to={`/courses/${courseId}`}
            className="flex-1 px-6 py-3 border border-outline text-on-surface-variant rounded-xl font-button text-button text-center hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || createTopic.isPending}
            className="flex-1 px-6 py-3 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {createTopic.isPending ? 'Creating...' : 'Create Topic'}
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
