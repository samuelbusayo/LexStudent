import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import api from '../services/api'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`

export default function TopicReader() {
  const { courseId, topicId } = useParams()
  const { data: course } = useCourse(courseId)
  const { data: topics } = useTopics(courseId)
  const topic = topics?.find(t => t.id === Number(topicId))
  
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!topic) return
    setLoading(false)
  }, [topic])

  const handleMarkRead = async () => {
    try {
      await api.put(`/courses/${courseId}/topics/${topicId}/progress`, {
        pagesRead: (topic.pagesRead || 0) + 1,
      })
    } catch (err) {
      console.error('Failed to mark page as read', err)
    }
  }

  if (!topic) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">menu_book</span>
        <p className="font-body-md text-on-surface-variant">Topic not found</p>
        <Link to={`/courses/${courseId}`} className="text-primary font-button mt-4 inline-block hover:underline">
          Back to Course
        </Link>
      </div>
    )
  }

  const selectedPages = topic.selectedPages || []
  const totalDocPages = topic.totalDocumentPages || 0

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 px-gutter h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/courses/${courseId}`} className="flex items-center gap-2 text-on-surface-variant hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-h3 text-h3 text-primary-container">{topic.name}</h1>
            <p className="text-xs text-on-surface-variant">{course?.name || 'Course'} • {topic.pagesRead ?? 0}/{topic.totalPages ?? 0} pages</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedPages.length > 0 && (
            <div className="text-sm text-on-surface-variant">
              Page {currentPage + 1} of {selectedPages.length}
            </div>
          )}
        </div>
      </header>

      {/* Reader content */}
      <div className="max-w-4xl mx-auto p-stack-lg">
        {!topic.hasMaterials ? (
          /* No materials - show text-based reading view */
          <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">auto_stories</span>
              <h2 className="font-h2 text-h2 text-primary-container mb-2">{topic.name}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-1">{topic.subtitle || ''}</p>
              <p className="text-sm text-on-surface-variant mt-4">No materials uploaded for this topic yet.</p>
              <p className="text-xs text-on-surface-variant">Progress: {topic.pagesRead ?? 0}/{topic.totalPages ?? 10} pages</p>
              {/* Progress update buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="px-4 py-2 bg-primary-container text-white rounded-lg font-button text-sm hover:opacity-90 transition-opacity"
                  onClick={handleMarkRead}>
                  Mark as Reading
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Materials available - show document viewer */
          <div>
            {selectedPages.length > 0 ? (
              <div className="space-y-6">
                {/* Page navigation */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    className="px-4 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-all disabled:opacity-30 font-button text-sm"
                  >
                    <span className="material-symbols-outlined align-middle">chevron_left</span>
                    Previous
                  </button>
                  <span className="font-body-md text-on-surface-variant">
                    Page {selectedPages[currentPage] || currentPage + 1} of {totalDocPages}
                  </span>
                  <button
                    disabled={currentPage >= selectedPages.length - 1}
                    onClick={() => setCurrentPage(p => Math.min(selectedPages.length - 1, p + 1))}
                    className="px-4 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-all disabled:opacity-30 font-button text-sm"
                  >
                    Next
                    <span className="material-symbols-outlined align-middle">chevron_right</span>
                  </button>
                </div>

                {/* PDF embed placeholder - in production with real file URL */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden min-h-[500px] flex items-center justify-center">
                  <div className="text-center p-12">
                    <span className="material-symbols-outlined text-5xl text-outline mb-4">picture_as_pdf</span>
                    <h3 className="font-h3 text-h3 text-primary-container mb-2">Document Viewer</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                      Viewing page {selectedPages[currentPage] || currentPage + 1} of {totalDocPages}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      In production, the PDF/DOCX would render here using the file stored in Vercel Blob.
                    </p>
                  </div>
                </div>

                {/* Page thumbnails strip */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-3">TOPIC PAGES</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedPages.map((pageNum, idx) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-12 h-16 rounded-lg flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                          idx === currentPage
                            ? 'bg-primary-container text-white'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30 text-center py-16">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">description</span>
                <p className="font-body-md text-on-surface-variant">No pages selected for this topic</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
