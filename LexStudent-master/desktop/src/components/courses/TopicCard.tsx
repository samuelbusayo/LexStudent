import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteTopic } from '../../hooks/useCourses'

interface TopicCardProps {
  topic: any
  courseId: string
}

export default function TopicCard({ topic, courseId }: TopicCardProps) {
  const navigate = useNavigate()
  const deleteTopic = useDeleteTopic()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteTopic.mutate({ courseId, topicId: topic.id })
    setConfirmDelete(false)
  }

  // Use server-provided studied_pages / pages_remaining when available,
  // fall back to client-side selectedPages.length for back-compat
  const selectedPages: number[] = topic.selectedPages || []
  const studiedPages: number = topic.studiedPages || selectedPages.length
  const pagesRead = Math.min(topic.pagesRead ?? 0, studiedPages)
  const pagesRemaining: number = topic.pagesRemaining ?? Math.max(0, studiedPages - pagesRead)
  const isComplete = pagesRead >= studiedPages && studiedPages > 0

  return (
    <div className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/30 hover:shadow-md transition-shadow relative group">
      <Link to={`/courses/${courseId}/topics/${topic.id}/read`} className="block">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-h3 text-h3 text-primary-container">{topic.name}</h4>
              {isComplete && (
                <span className="text-xs text-secondary font-bold">COMPLETED</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-on-surface-variant hover:bg-primary-container hover:text-white transition-all text-xs font-button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/courses/${courseId}/topics/${topic.id}/materials`) }}
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              {topic.hasMaterials ? 'Manage' : 'Upload'}
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-button ${
                confirmDelete
                  ? 'bg-error text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-error hover:text-white opacity-0 group-hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{confirmDelete ? 'warning' : 'delete'}</span>
              {confirmDelete ? 'Confirm' : ''}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span className="font-medium">
              {isComplete ? 'Complete' : pagesRemaining > 0 ? `${pagesRemaining} page${pagesRemaining !== 1 ? 's' : ''} left` : 'Progress'}
            </span>
            <span className="font-bold">{pagesRead}/{studiedPages} Pages</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-700"
              style={{ width: `${studiedPages > 0 ? Math.min(100, (pagesRead / studiedPages) * 100) : 0}%` }}
            />
          </div>
        </div>
      </Link>
    </div>
  )
}
