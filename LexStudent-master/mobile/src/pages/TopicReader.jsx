import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCourse, useTopics } from '../hooks/useCourses'
import { getMaterials, getStudyNotes, createStudyNote, updateStudyNote, deleteStudyNote, updateTopicProgress } from '../services/db'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'
import { renderAsync as renderDocx } from 'docx-preview'
import { PptxViewer, parseZip, buildPresentation } from '@aiden0z/pptx-renderer'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export default function TopicReader() {
  const { courseId, topicId } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: course } = useCourse(courseId)
  const { data: topics } = useTopics(courseId)
  const topic = topics?.find(t => t.id === Number(topicId))

  const selectedPages = topic?.selectedPages?.length > 0
    ? [...topic.selectedPages].sort((a, b) => a - b)
    : null

  const storageKey = `topic-reader-position-${topicId}`

  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const { currentPage } = JSON.parse(saved)
        if (currentPage !== undefined) {
          return selectedPages ? selectedPages.indexOf(currentPage) : currentPage - 1
        }
      }
    } catch {}
    return 0
  })
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fileType, setFileType] = useState('')
  const [notesOpen, setNotesOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const pdfWrapperRef = useRef(null)
  const pdfDocRef = useRef(null)
  const renderTaskRef = useRef(null)
  const docxContainerRef = useRef(null)
  const docxRendered = useRef(false)
  const pptxContainerRef = useRef(null)
  const pptxViewerRef = useRef(null)
  const pptxPresentationRef = useRef(null)
  const fileBufferRef = useRef(null)

  const currentPage = selectedPages ? selectedPages[currentIndex] : currentIndex + 1
  const visiblePageCount = selectedPages ? selectedPages.length : totalPages

  // Load study notes from local db
  const loadNotes = useCallback(async () => {
    try {
      const all = await getStudyNotes(topicId)
      setNotes(all || [])
    } catch (err) {
      console.error('Failed to load notes', err)
    }
  }, [topicId])

  useEffect(() => { if (topicId) loadNotes() }, [topicId, loadNotes])

  // Load document from local storage
  const loadDocument = useCallback(async () => {
    if (!topic?.hasMaterials) { setLoading(false); return }
    setLoading(true)
    setError('')
    docxRendered.current = false

    try {
      const materials = await getMaterials(topicId)
      if (!materials || materials.length === 0) {
        setError('No materials found')
        setLoading(false)
        return
      }
      const material = materials[0]
      const ft = (topic.materialType || material.mimeType || '').toLowerCase()
      setFileType(ft)

      // Fetch file from local path (Capacitor converts to web URL)
      const fileUrl = material.filepath
      if (!fileUrl) { setError('File path not found'); setLoading(false); return }

      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error('Failed to load file')
      const arrayBuffer = await response.arrayBuffer()
      fileBufferRef.current = arrayBuffer

      if (ft.includes('pdf') || ft === 'pdf') {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        pdfDocRef.current = pdf
        setTotalPages(pdf.numPages)
        setCurrentIndex(0)
      } else if (ft.includes('pptx') || ft === 'pptx') {
        const files = await parseZip(arrayBuffer)
        const presentation = buildPresentation(files)
        pptxPresentationRef.current = presentation
        setTotalPages(presentation.slides.length || 1)
        setCurrentIndex(0)
      } else if (ft.includes('doc')) {
        setTotalPages(1)
        setCurrentIndex(0)
      } else {
        setError(`Unsupported: ${ft}`)
      }
      setLoading(false)
    } catch (err) {
      console.error('Document load error', err)
      setError(`Failed: ${err.message}`)
      setLoading(false)
    }
  }, [topic, topicId])

  useEffect(() => { loadDocument() }, [loadDocument])

  // PDF render
  const renderPdfPage = useCallback(async (pageNum) => {
    if (!pdfDocRef.current || !pdfWrapperRef.current) return
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel() } catch {} }

    try {
      const page = await pdfDocRef.current.getPage(pageNum)
      const wrapper = pdfWrapperRef.current
      const containerWidth = wrapper.parentElement?.clientWidth || 360
      const baseViewport = page.getViewport({ scale: 1 })
      const scale = (containerWidth - 16) / baseViewport.width
      const viewport = page.getViewport({ scale })

      wrapper.innerHTML = ''
      wrapper.style.width = `${viewport.width}px`
      wrapper.style.height = `${viewport.height}px`
      wrapper.style.position = 'relative'

      const canvas = document.createElement('canvas')
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(viewport.width * dpr)
      canvas.height = Math.floor(viewport.height * dpr)
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`
      canvas.style.display = 'block'
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      wrapper.appendChild(canvas)

      const renderTask = page.render({ canvasContext: ctx, viewport })
      renderTaskRef.current = renderTask
      await renderTask.promise
      renderTaskRef.current = null
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') console.error('Render error', err)
    }
  }, [])

  useEffect(() => {
    if (pdfDocRef.current && currentPage > 0 && currentPage <= totalPages) {
      renderPdfPage(currentPage)
    }
  }, [currentPage, totalPages, renderPdfPage])

  // DOCX render
  useEffect(() => {
    const ft = fileType
    if (!(ft.includes('doc')) || !fileBufferRef.current || !docxContainerRef.current || docxRendered.current || loading) return
    docxRendered.current = true
    const container = docxContainerRef.current
    container.innerHTML = ''
    renderDocx(fileBufferRef.current, container, undefined, {
      className: 'docx-viewer', inWrapper: true, ignoreWidth: false,
      breakPages: true, useBase64URL: true,
    }).catch(err => {
      container.innerHTML = '<p style="padding:1rem;color:#666;">Failed to render document.</p>'
    })
  }, [fileType, loading])

  // PPTX render
  useEffect(() => {
    const ft = fileType
    const container = pptxContainerRef.current
    const presentation = pptxPresentationRef.current
    if (!(ft.includes('pptx') || ft === 'pptx') || !presentation || !container || loading) return

    if (pptxViewerRef.current) { pptxViewerRef.current.destroy(); pptxViewerRef.current = null }
    container.innerHTML = ''
    const viewer = new PptxViewer(container, { fitMode: 'contain' })
    viewer.load(presentation)
    viewer.renderSlide(currentIndex).catch(console.error)
    pptxViewerRef.current = viewer
    return () => { viewer.destroy(); if (pptxViewerRef.current === viewer) pptxViewerRef.current = null }
  }, [currentIndex, fileType, loading])

  // Navigation
  const savePosition = (page) => {
    try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: page, timestamp: Date.now() })) } catch {}
  }
  const handlePrev = () => setCurrentIndex(i => { const n = Math.max(0, i - 1); savePosition(selectedPages ? selectedPages[n] : n + 1); return n })
  const handleNext = () => setCurrentIndex(i => { const n = Math.min(visiblePageCount - 1, i + 1); savePosition(selectedPages ? selectedPages[n] : n + 1); return n })

  const handleMarkRead = async () => {
    try {
      const readCount = currentIndex + 1
      await updateTopicProgress(courseId, topicId, {
        pagesRead: Math.max(topic.pagesRead || 0, readCount),
        totalPages: visiblePageCount,
        selectedPages: selectedPages || [],
        totalDocumentPages: topic.totalDocumentPages || totalPages,
      })
      qc.invalidateQueries({ queryKey: ['topics', courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
      qc.invalidateQueries({ queryKey: ['progress'] })
      savePosition(currentPage)
      if (currentIndex < visiblePageCount - 1) {
        setCurrentIndex(i => i + 1)
      }
    } catch (err) { console.error('Failed to mark progress', err) }
  }

  // Notes CRUD
  const addNote = async () => {
    if (!noteText.trim() || savingNote) return
    setSavingNote(true)
    try {
      await createStudyNote(topicId, { type: 'note', page: currentPage, text: noteText.trim() })
      setNoteText('')
      await loadNotes()
    } catch (err) { console.error('Failed to save note', err) }
    setSavingNote(false)
  }

  const removeNote = async (id) => {
    try {
      await deleteStudyNote(id)
      await loadNotes()
    } catch (err) { console.error('Failed to delete note', err) }
  }

  const isPdf = fileType.includes('pdf') || fileType === 'pdf'
  const isDocx = fileType.includes('doc')
  const isPptx = fileType.includes('pptx') || fileType === 'pptx'
  const pageNotes = notes.filter(n => n.page === currentPage)

  if (!topic) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">menu_book</span>
          <p className="text-sm text-on-surface-variant">Topic not found</p>
          <button onClick={() => navigate(-1)} className="mt-3 text-sm font-semibold text-primary">Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-surface-container-low overflow-hidden">
      {/* Compact Mobile Toolbar */}
      <header className="flex items-center justify-between h-12 px-3 bg-white border-b border-outline-variant/30 flex-shrink-0 safe-top">
        <button onClick={() => navigate(`/courses/${courseId}`)} className="p-1.5">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0 mx-2 text-center">
          <p className="text-xs font-semibold text-primary truncate">{topic.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} disabled={currentIndex <= 0} className="p-1.5 disabled:opacity-30">
            <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_left</span>
          </button>
          <span className="text-[11px] font-semibold text-on-surface-variant min-w-[3rem] text-center">
            {currentIndex + 1}/{visiblePageCount || '?'}
          </span>
          <button onClick={handleNext} disabled={currentIndex >= visiblePageCount - 1} className="p-1.5 disabled:opacity-30">
            <span className="material-symbols-outlined text-lg text-on-surface-variant">chevron_right</span>
          </button>
        </div>
      </header>

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant animate-pulse">hourglass_top</span>
              <p className="text-xs text-on-surface-variant mt-2">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">error_outline</span>
              <p className="text-xs text-error">{error}</p>
              <button onClick={() => navigate(`/courses/${courseId}/topics/${topicId}/materials`)}
                className="mt-3 btn-primary text-xs !py-2 !px-4">Upload Materials</button>
            </div>
          </div>
        ) : !topic.hasMaterials ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">auto_stories</span>
              <p className="text-sm text-on-surface-variant">No materials uploaded.</p>
              <button onClick={() => navigate(`/courses/${courseId}/topics/${topicId}/materials`)}
                className="mt-3 btn-primary text-xs !py-2 !px-4">Upload Materials</button>
            </div>
          </div>
        ) : isPdf ? (
          <div className="flex justify-center p-2">
            <div ref={pdfWrapperRef} className="bg-white shadow-sm rounded-sm" />
          </div>
        ) : isDocx ? (
          <div className="p-2">
            <div ref={docxContainerRef} className="bg-white shadow-sm rounded-sm overflow-auto" />
          </div>
        ) : isPptx ? (
          <div className="flex justify-center p-2">
            <div className="bg-white shadow-sm rounded-sm overflow-hidden" style={{ width: '100%', maxWidth: '480px' }}>
              <div ref={pptxContainerRef} style={{ width: '100%', minHeight: '270px', position: 'relative' }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-on-surface-variant">No viewable content</p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between h-14 px-3 bg-white border-t border-outline-variant/30 flex-shrink-0 safe-bottom">
        <button onClick={handleMarkRead}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          Mark Read
        </button>
        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">auto_stories</span>
          {topic.pagesRead ?? 0}/{visiblePageCount} read
        </div>
        <button onClick={() => setNotesOpen(!notesOpen)}
          className="flex items-center gap-1 px-3 py-2 bg-surface-container rounded-lg text-xs font-semibold text-primary active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">edit_note</span>
          Notes {notes.length > 0 ? `(${notes.length})` : ''}
        </button>
      </div>

      {/* Notes Bottom Sheet */}
      {notesOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setNotesOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white rounded-t-2xl max-h-[70vh] flex flex-col safe-bottom"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
              <h3 className="font-serif text-base font-semibold text-primary">Notes (Page {currentPage})</h3>
              <button onClick={() => setNotesOpen(false)} className="p-1">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pageNotes.length === 0 && notes.length === 0 && (
                <p className="text-center text-xs text-on-surface-variant py-4">No notes yet. Add one below.</p>
              )}
              {pageNotes.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">This Page</p>
                  {pageNotes.map(n => (
                    <div key={n.id} className="card p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-on-surface flex-1">{n.text}</p>
                        <button onClick={() => removeNote(n.id)} className="p-0.5 text-on-surface-variant ml-2 flex-shrink-0">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {notes.filter(n => n.page !== currentPage).length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Other Pages</p>
                  {notes.filter(n => n.page !== currentPage).map(n => (
                    <div key={n.id} className="card p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-secondary">Pg {n.page}</span>
                          <p className="text-sm text-on-surface mt-0.5">{n.text}</p>
                        </div>
                        <button onClick={() => removeNote(n.id)} className="p-0.5 text-on-surface-variant ml-2 flex-shrink-0">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-outline-variant/30 flex gap-2">
              <input
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addNote() }}
                placeholder="Write a note..."
                className="input-field !text-sm flex-1"
              />
              <button onClick={addNote} disabled={!noteText.trim() || savingNote}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold disabled:opacity-50 active:scale-95 transition-transform">
                {savingNote ? '...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .docx-viewer .docx-wrapper { background: transparent !important; padding: 0 !important; }
        .docx-viewer .docx-wrapper > section.docx { box-shadow: none !important; margin-bottom: 1rem !important; background: white !important; }
        .safe-top { padding-top: env(safe-area-inset-top, 0px); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
      `}</style>
    </div>
  )
}
