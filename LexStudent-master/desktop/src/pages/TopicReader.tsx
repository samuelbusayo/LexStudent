import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import api from '../services/api'

const AUTOSAVE_DELAY = 1200

export default function TopicReader() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: course } = useCourse(courseId!)
  const { data: topics } = useTopics(courseId!)
  const topic = topics?.find((t: any) => t.id === Number(topicId))

  const selectedPages = topic?.selectedPages?.length > 0
    ? [...topic.selectedPages].sort((a: number, b: number) => a - b)
    : null

  const storageKey = `topic-reader-position-${topicId}`

  const [currentIndex, setCurrentIndex] = useState(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const targetPage = Number(pageParam)
      if (!isNaN(targetPage) && targetPage > 0) {
        const idx = selectedPages
          ? selectedPages.indexOf(targetPage)
          : targetPage - 1
        if (idx >= 0) return idx
      }
    }
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved !== null) {
        const parsed = JSON.parse(saved)
        if (parsed.currentPage !== undefined) {
          return selectedPages
            ? selectedPages.indexOf(parsed.currentPage)
            : parsed.currentPage - 1
        }
      }
    } catch {}
    return 0
  })
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Summary Notes state
  const [summaryBody, setSummaryBody] = useState('')
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [highlights, setHighlights] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedBodyRef = useRef('')

  const visiblePageCount = selectedPages ? selectedPages.length : totalPages
  const currentPage = selectedPages ? selectedPages[currentIndex] : currentIndex + 1

  // ─── Load Summary + Highlights ───
  const loadSummaryData = useCallback(async () => {
    try {
      const res = await api.get(`/study-notes/${topicId}/summary`)
      const data = res.data as any
      setSummaryBody(data.body || '')
      lastSavedBodyRef.current = data.body || ''
      setHighlights(data.highlights || [])
      setSummaryLoaded(true)
    } catch (err) {
      console.error('Failed to load summary data', err)
      setSummaryLoaded(true)
    }
  }, [topicId])

  useEffect(() => {
    if (topicId) loadSummaryData()
  }, [topicId, loadSummaryData])

  // ─── Autosave summary ───
  const saveSummary = useCallback(async (body: string) => {
    if (body === lastSavedBodyRef.current) return
    setSaveStatus('saving')
    try {
      await api.put(`/study-notes/${topicId}/summary`, { body })
      lastSavedBodyRef.current = body
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (err) {
      console.error('Failed to save summary', err)
      setSaveStatus('')
    }
  }, [topicId])

  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value
    setSummaryBody(newBody)
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => saveSummary(newBody), AUTOSAVE_DELAY)
  }, [saveSummary])

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    }
  }, [topicId])

  // ─── Load document metadata ───
  useEffect(() => {
    if (!topic?.hasMaterials) {
      setLoading(false)
      return
    }
    setLoading(true)
    api.get(`/materials/${topicId}`)
      .then((res) => {
        const materials = res.data as any[]
        if (materials.length > 0) {
          setTotalPages((materials[0] as any).totalPages || 10)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load materials')
        setLoading(false)
      })
  }, [topic, topicId])

  // ─── Position restore ───
  useEffect(() => {
    if (totalPages > 0) {
      const pageParam = searchParams.get('page')
      if (pageParam) {
        const targetPage = Number(pageParam)
        if (!isNaN(targetPage) && targetPage > 0) {
          const maxPage = selectedPages ? selectedPages.length : totalPages
          const idx = selectedPages ? selectedPages.indexOf(targetPage) : targetPage - 1
          if (idx >= 0 && idx < maxPage) {
            setCurrentIndex(idx)
            return
          }
        }
      }
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const { currentPage } = JSON.parse(saved)
          if (currentPage !== undefined) {
            const maxPage = selectedPages ? selectedPages.length : totalPages
            const targetIndex = selectedPages
              ? selectedPages.indexOf(currentPage)
              : currentPage - 1
            if (targetIndex >= 0 && targetIndex < maxPage) {
              setCurrentIndex(targetIndex)
            }
          }
        }
      } catch {}
    }
  }, [totalPages, selectedPages, storageKey, searchParams])

  // ─── Navigation ───
  const handlePrevPage = () => setCurrentIndex((i) => {
    const next = Math.max(0, i - 1)
    const nextPage = selectedPages ? selectedPages[next] : next + 1
    try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: nextPage, timestamp: Date.now() })) } catch {}
    return next
  })
  const handleNextPage = () => setCurrentIndex((i) => {
    const next = Math.min(visiblePageCount - 1, i + 1)
    const nextPage = selectedPages ? selectedPages[next] : next + 1
    try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: nextPage, timestamp: Date.now() })) } catch {}
    return next
  })

  const handleBack = () => {
    if ((location.state as any)?.from === 'summary') {
      navigate(-1)
    } else {
      navigate(`/courses/${courseId}`)
    }
  }

  const handleMarkRead = async () => {
    try {
      const readCount = currentIndex + 1
      await api.put(`/courses/${courseId}/topics/${topicId}/progress`, {
        pagesRead: Math.max(topic?.pagesRead || 0, readCount),
        totalPages: visiblePageCount,
      })
      try { localStorage.setItem(storageKey, JSON.stringify({ currentPage, timestamp: Date.now() })) } catch {}
      setCurrentIndex((i) => {
        const next = Math.min(visiblePageCount - 1, i + 1)
        if (next !== i) {
          try {
            const nextPage = selectedPages ? selectedPages[next] : next + 1
            localStorage.setItem(storageKey, JSON.stringify({ currentPage: nextPage, timestamp: Date.now() }))
          } catch {}
        }
        return next
      })
    } catch (err) {
      console.error('Failed to mark progress', err)
    }
  }

  // ─── Highlight ───
  const addHighlight = async () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()
    if (!selectedText) return
    setSavingNote(true)

    let paragraph: number | null = null
    let anchorText = ''
    try {
      anchorText = selectedText.slice(0, 60)
    } catch {}

    try {
      const res = await api.post(`/study-notes/${topicId}/highlight`, {
        page: currentPage,
        paragraph,
        anchorText,
        text: selectedText,
      })
      setHighlights((prev) => [...prev, res.data])
      selection?.removeAllRanges()
    } catch (err) {
      console.error('Failed to save highlight', err)
    }
    setSavingNote(false)
  }

  const deleteHighlight = async (highlightId: number) => {
    try {
      await api.delete(`/study-notes/${highlightId}`)
      setHighlights((prev) => prev.filter((h) => h.id !== highlightId))
    } catch (err) {
      console.error('Failed to delete highlight', err)
    }
  }

  const comprehension = Math.min(100, Math.round((summaryBody.length > 0 ? 20 : 0) + (highlights.length * 8)))

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

  const formatTime = (iso: string) => {
    try { return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-surface-container-lowest border-b border-outline-variant/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h1 className="font-h3 text-primary-container truncate max-w-md">Reading: {topic.name}</h1>
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
              <h3 className="font-h3 text-primary-container mb-2">{topic.name}</h3>
              <p className="text-sm text-error mb-4">{error}</p>
            </div>
          ) : !topic.hasMaterials ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 max-w-2xl w-full text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">auto_stories</span>
              <h3 className="font-h3 text-primary-container mb-2">{topic.name}</h3>
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

        {/* ═══ Right sidebar — Summary Notes ═══ */}
        {sidebarOpen && (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-h3 text-primary-container">Summary Notes</h2>
                {saveStatus && (
                  <span className={`text-[10px] font-label-caps ${saveStatus === 'saving' ? 'text-on-surface-variant' : 'text-green-600'}`}>
                    {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{highlights.length} highlight{highlights.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Comprehension bar */}
              <div className="bg-secondary-container/10 rounded-xl p-3 border border-secondary-container/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-label-caps text-on-surface-variant">Comprehension</span>
                  <span className="text-sm font-bold text-secondary">{comprehension}%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${comprehension}%` }} />
                </div>
              </div>

              {/* Editable summary textarea */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary-container">edit_note</span>
                  <span className="text-xs font-label-caps text-on-surface-variant">Add Summary Notes</span>
                </div>
                <textarea
                  value={summaryBody}
                  onChange={handleSummaryChange}
                  placeholder="Write your summary notes for this topic... This is a single summary for the entire topic — type your thoughts, key takeaways, and observations here."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-primary outline-none min-h-[120px]"
                  rows={6}
                />
                <p className="text-[10px] text-on-surface-variant">Auto-saves as you type. Select text in the document and click Highlight below to pin it here.</p>
              </div>

              {/* Highlight button */}
              <button
                onClick={addHighlight}
                disabled={savingNote}
                className="w-full px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-button text-xs hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">highlight</span>
                {savingNote ? 'Saving...' : 'Highlight Selected Text'}
              </button>

              {/* Highlight cards */}
              {highlights.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-label-caps text-on-surface-variant">Highlights</span>
                  {highlights.map((h: any) => (
                    <div key={h.id} className="rounded-lg p-3 border bg-amber-50 border-amber-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">highlight</span>
                          p.{h.page}{h.paragraph != null ? ` ¶${h.paragraph}` : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-on-surface-variant">{formatTime(h.createdAt || h.created_at)}</span>
                          <button onClick={() => deleteHighlight(h.id)} className="p-0.5 text-on-surface-variant hover:text-error transition-colors" title="Delete highlight">
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-on-surface leading-relaxed italic">{h.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!summaryBody && highlights.length === 0 && summaryLoaded && (
                <div className="text-center py-6 text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-2">note_add</span>
                  <p className="text-sm font-bold">Start taking notes</p>
                  <p className="text-xs mt-2 leading-relaxed">Write your summary above or select text in the document and click Highlight to capture key passages.</p>
                </div>
              )}
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-outline-variant/30 space-y-2 flex-shrink-0">
              <button onClick={handleMarkRead} className="w-full px-4 py-2.5 bg-primary-container text-white rounded-xl font-button text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>Mark Page as Read
              </button>
              <button onClick={handleBack} className="w-full px-4 py-2.5 border border-outline text-on-surface-variant rounded-xl font-button text-sm hover:bg-surface-container transition-colors text-center">
                {(location.state as any)?.from === 'summary' ? 'Back to Summary' : 'Back to Course'}
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
