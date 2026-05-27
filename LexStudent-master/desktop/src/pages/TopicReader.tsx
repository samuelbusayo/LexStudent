import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import api from '../services/api'

export default function TopicReader() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>()
  const { data: course } = useCourse(courseId!)
  const { data: topics } = useTopics(courseId!)
  const topic = topics?.find((t: any) => t.id === Number(topicId))

  const selectedPages = topic?.selectedPages?.length > 0
    ? [...topic.selectedPages].sort((a: number, b: number) => a - b)
    : null

  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notes, setNotes] = useState<any[]>([])
  const [noteText, setNoteText] = useState('')

  const visiblePageCount = selectedPages ? selectedPages.length : totalPages
  const currentPage = selectedPages ? selectedPages[currentIndex] : currentIndex + 1

  // Load document metadata
  useEffect(() => {
    if (!topic?.hasMaterials) {
      setLoading(false)
      return
    }
    setLoading(true)
    api.get(`/materials/${topicId}`)
      .then((res) => {
        const materials = res.data
        if (materials.length > 0) {
          setTotalPages(materials[0].totalPages || 10)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load materials')
        setLoading(false)
      })
  }, [topic, topicId])

  // Load study notes
  useEffect(() => {
    if (topicId) {
      api.get(`/study-notes/${topicId}`)
        .then((res) => setNotes(res.data || []))
        .catch(() => {})
    }
  }, [topicId])

  const handlePrevPage = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const handleNextPage = () => setCurrentIndex((i) => Math.min(visiblePageCount - 1, i + 1))

  const handleMarkRead = async () => {
    try {
      const readCount = currentIndex + 1
      await api.put(`/courses/${courseId}/topics/${topicId}/progress`, {
        pagesRead: Math.max(topic?.pagesRead || 0, readCount),
        totalPages: visiblePageCount,
      })
      handleNextPage()
    } catch (err) {
      console.error('Failed to mark progress', err)
    }
  }

  const addNote = async () => {
    if (!noteText.trim()) return
    try {
      const res = await api.post(`/study-notes/${topicId}`, {
        type: 'note',
        page: currentPage,
        text: noteText.trim(),
      })
      setNotes((prev) => [...prev, res.data])
      setNoteText('')
    } catch (err) {
      console.error('Failed to save note', err)
    }
  }

  if (!topic) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">menu_book</span>
          <p className="font-body-md text-on-surface-variant">Topic not found</p>
          <Link to={`/courses/${courseId}`} className="text-primary font-button mt-4 inline-block hover:underline">Back to Course</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-surface-container-lowest border-b border-outline-variant/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to={`/courses/${courseId}`} className="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-h3 text-h3 text-primary-container truncate max-w-md">Reading: {topic.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevPage} disabled={currentIndex <= 0} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <span className="text-sm font-body text-on-surface-variant min-w-[4rem] text-center">
            Page {currentPage} / {visiblePageCount || '?'}
          </span>
          <button onClick={handleNextPage} disabled={currentIndex >= visiblePageCount - 1} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/30 mx-1" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors">
            <span className="material-symbols-outlined text-lg">{sidebarOpen ? 'right_panel_close' : 'right_panel_open'}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Document viewer area */}
        <div className="flex-1 overflow-auto bg-surface-container-low flex items-start justify-center p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-body-md text-on-surface-variant">Loading document...</p>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 max-w-2xl w-full text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">description</span>
              <h3 className="font-h3 text-h3 text-primary-container mb-2">{topic.name}</h3>
              <p className="text-sm text-error mb-4">{error}</p>
            </div>
          ) : !topic.hasMaterials ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 max-w-2xl w-full text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">auto_stories</span>
              <h3 className="font-h3 text-h3 text-primary-container mb-2">{topic.name}</h3>
              <p className="text-sm text-on-surface-variant mb-4">No materials uploaded for this topic yet.</p>
              <Link
                to={`/courses/${courseId}/topics/${topicId}/materials`}
                className="px-4 py-2 bg-primary-container text-white rounded-lg font-button text-sm hover:opacity-90 transition-opacity"
              >
                Upload Materials
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-sm w-full max-w-3xl min-h-[600px] p-12 flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4">description</span>
                <p className="text-lg font-bold mb-2">Page {currentPage}</p>
                <p className="text-sm">Document rendering available in full build.</p>
                <p className="text-xs mt-2 text-on-surface-variant/60">PDF.js viewer will render here at runtime.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        {sidebarOpen && (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col flex-shrink-0 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
              <h2 className="font-h3 text-h3 text-primary-container">Study Notes</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">{notes.length} notes</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Add note form */}
              <div className="space-y-2">
                <span className="text-xs font-label-caps text-on-surface-variant">Add Note (Page {currentPage})</span>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote() }}
                  placeholder="Write a note about this page..."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-primary outline-none"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  disabled={!noteText.trim()}
                  className="w-full px-3 py-2 bg-primary-container text-white rounded-lg font-button text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>

              {/* Notes list */}
              {notes.filter((n: any) => n.page === currentPage).map((note: any) => (
                <div key={note.id} className="rounded-lg p-3 border bg-surface-container-low border-outline-variant/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-primary-container">Page {note.page}</span>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-outline-variant/30 space-y-2 flex-shrink-0">
              <button onClick={handleMarkRead} className="w-full px-4 py-2.5 bg-primary-container text-white rounded-xl font-button text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>Mark Page as Read
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
