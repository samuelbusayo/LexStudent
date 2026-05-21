import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'
import { renderAsync as renderDocx } from 'docx-preview'
import { PptxViewer, parseZip, buildPresentation } from '@aiden0z/pptx-renderer'
import api from '../services/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

export default function TopicReader() {
  const { courseId, topicId } = useParams()
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
  const [zoomIndex, setZoomIndex] = useState(2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fileType, setFileType] = useState('')

  // Study Notes state
  const [notes, setNotes] = useState([])
  const [highlights, setHighlights] = useState([])
  const [activeTab, setActiveTab] = useState('notes')
  const [noteText, setNoteText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingNote, setEditingNote] = useState(null)
  const [editText, setEditText] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // Refs
  const pdfWrapperRef = useRef(null)
  const pdfDocRef = useRef(null)
  const renderTaskRef = useRef(null)
  const docxContainerRef = useRef(null)
  const docxRendered = useRef(false)
  const pptxContainerRef = useRef(null)
  const pptxViewerRef = useRef(null)
  const pptxPresentationRef = useRef(null)
  const fileBufferRef = useRef(null)

  const zoom = ZOOM_LEVELS[zoomIndex]
  const currentPage = selectedPages ? selectedPages[currentIndex] : currentIndex + 1
  const visiblePageCount = selectedPages ? selectedPages.length : totalPages

  // ─── Load Study Notes from server ───
  const loadStudyNotes = useCallback(async () => {
    try {
      const res = await api.get(`/study-notes/${topicId}`)
      const all = res.data
      setNotes(all.filter(n => n.type === 'note'))
      setHighlights(all.filter(n => n.type === 'highlight'))
    } catch (err) {
      console.error('Failed to load study notes', err)
    }
  }, [topicId])

  useEffect(() => {
    if (topicId) loadStudyNotes()
  }, [topicId, loadStudyNotes])

  // ─── Load Document ───
  const loadDocument = useCallback(async () => {
    if (!topic?.hasMaterials) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    docxRendered.current = false

    try {
      const res = await api.get(`/materials/${topicId}`)
      const materials = res.data
      if (materials.length === 0) {
        setError('No materials found for this topic')
        setLoading(false)
        return
      }
      const material = materials[0]
      const ft = (topic.materialType || material.mimeType || '').toLowerCase()
      setFileType(ft)
      const fileUrl = `/api/materials/download/${material.id}`
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
      } else if (ft.includes('docx') || ft.includes('doc') || ft === 'docx' || ft === 'doc') {
        setTotalPages(1)
        setCurrentIndex(0)
      } else {
        setError(`Unsupported file type: ${ft}`)
      }
      setLoading(false)
    } catch (err) {
      console.error('Document load error', err)
      setError(`Failed to load document: ${err.message}`)
      setLoading(false)
    }
  }, [topic, topicId])

  useEffect(() => {
    loadDocument()
  }, [loadDocument])

  // Restore position after totalPages/selectedPages are known
  useEffect(() => {
    const ft = fileType
    const isDoc = ft && (ft.includes('docx') || ft.includes('doc') || ft === 'docx' || ft === 'doc')
    const isP = ft && (ft.includes('pdf') || ft === 'pdf' || ft.includes('pptx') || ft === 'pptx')
    if ((isP || isDoc) && totalPages > 0) {
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
  }, [totalPages, selectedPages, storageKey, fileType])

  // ─── PDF: Render page with canvas + text layer ───
  const renderPdfPage = useCallback(async (pageNum, scale) => {
    if (!pdfDocRef.current || !pdfWrapperRef.current) return

    // Cancel any in-flight render
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel() } catch {}
      renderTaskRef.current = null
    }

    try {
      const page = await pdfDocRef.current.getPage(pageNum)
      const baseScale = scale * 1.5
      const viewport = page.getViewport({ scale: baseScale })

      const wrapper = pdfWrapperRef.current
      wrapper.innerHTML = ''
      wrapper.style.width = `${viewport.width}px`
      wrapper.style.height = `${viewport.height}px`
      wrapper.style.position = 'relative'

      // 1. Canvas layer (the rendered PDF image)
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

      // 2. Text layer (invisible text positioned over canvas for selection)
      const textContent = await page.getTextContent()
      const textLayerDiv = document.createElement('div')
      textLayerDiv.className = 'textLayer'
      wrapper.style.setProperty('--total-scale-factor', baseScale)
      wrapper.appendChild(textLayerDiv)

      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport,
      })
      await textLayer.render()

      renderTaskRef.current = null
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error', err)
      }
    }
  }, [])

  useEffect(() => {
    if (pdfDocRef.current && currentPage > 0 && currentPage <= totalPages) {
      renderPdfPage(currentPage, zoom)
    }
  }, [currentPage, totalPages, zoom, renderPdfPage])

  // ─── DOCX: Render with docx-preview ───
  useEffect(() => {
    const ft = fileType
    const isDoc = ft.includes('docx') || ft.includes('doc') || ft === 'docx' || ft === 'doc'
    if (!isDoc || !fileBufferRef.current || !docxContainerRef.current || docxRendered.current || loading) return

    docxRendered.current = true
    const container = docxContainerRef.current
    container.innerHTML = ''

    renderDocx(fileBufferRef.current, container, undefined, {
      className: 'docx-viewer',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: true,
      experimental: false,
      trimXmlDeclaration: true,
      useBase64URL: true,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
    }).catch(err => {
      console.error('DOCX render error', err)
      container.innerHTML = '<p style="padding:2rem;color:#666;">Failed to render document. If this is a .doc file, please re-save as .docx.</p>'
    })
  }, [fileType, loading])

  useEffect(() => {
    const ft = fileType
    const container = pptxContainerRef.current
    const presentation = pptxPresentationRef.current
    if (!(ft.includes('pptx') || ft === 'pptx') || !presentation || !container || loading) return

    if (pptxViewerRef.current) {
      pptxViewerRef.current.destroy()
      pptxViewerRef.current = null
    }
    container.innerHTML = ''

    const viewer = new PptxViewer(container, { fitMode: 'contain' })
    viewer.load(presentation)
    viewer.renderSlide(currentIndex).catch(err => {
      console.error('PPTX slide render error', err)
    })
    pptxViewerRef.current = viewer

    return () => {
      viewer.destroy()
      if (pptxViewerRef.current === viewer) pptxViewerRef.current = null
    }
  }, [currentIndex, fileType, loading])

  // ─── Navigation ───
  const handleZoomIn = () => setZoomIndex(i => Math.min(ZOOM_LEVELS.length - 1, i + 1))
  const handleZoomOut = () => setZoomIndex(i => Math.max(0, i - 1))
  const handlePrevPage = () => setCurrentIndex(i => {
    const next = Math.max(0, i - 1)
    const nextPage = selectedPages ? selectedPages[next] : next + 1
    try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: nextPage, timestamp: Date.now() })) } catch {}
    return next
  })
  const handleNextPage = () => setCurrentIndex(i => {
    const next = Math.min(visiblePageCount - 1, i + 1)
    const nextPage = selectedPages ? selectedPages[next] : next + 1
    try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: nextPage, timestamp: Date.now() })) } catch {}
    return next
  })

  const handleMarkRead = async () => {
    try {
      const readCount = currentIndex + 1
      await api.put(`/courses/${courseId}/topics/${topicId}/progress`, {
        pagesRead: Math.max(topic.pagesRead || 0, readCount),
        totalPages: visiblePageCount,
      })

      try {
        localStorage.setItem(storageKey, JSON.stringify({ currentPage, timestamp: Date.now() }))
      } catch {}

      setCurrentIndex(i => {
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

  // ─── Study Notes CRUD ───
  const addNote = async () => {
    if (!noteText.trim() || savingNote) return
    setSavingNote(true)
    try {
      const res = await api.post(`/study-notes/${topicId}`, {
        type: 'note',
        page: currentPage,
        text: noteText.trim(),
      })
      setNotes(prev => [...prev, res.data])
      setNoteText('')
    } catch (err) {
      console.error('Failed to save note', err)
    }
    setSavingNote(false)
  }

  const addHighlight = async () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()
    if (!selectedText) return
    setSavingNote(true)
    try {
      const res = await api.post(`/study-notes/${topicId}`, {
        type: 'highlight',
        page: currentPage,
        text: selectedText,
      })
      setHighlights(prev => [...prev, res.data])

      // Visually mark the selection in the document
      try {
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const mark = document.createElement('mark')
          mark.style.cssText = 'background:rgba(255,213,79,0.4);border-radius:2px;padding:0 1px;'
          range.surroundContents(mark)
        }
      } catch (e) { /* cross-element selections can fail — that's fine */ }
      selection.removeAllRanges()
    } catch (err) {
      console.error('Failed to save highlight', err)
    }
    setSavingNote(false)
  }

  const startEditNote = (note) => {
    setEditingNote(note.id)
    setEditText(note.text)
  }

  const saveEditNote = async (noteId, type) => {
    if (!editText.trim()) return
    setSavingNote(true)
    try {
      const res = await api.put(`/study-notes/${noteId}`, { text: editText.trim() })
      if (type === 'note') {
        setNotes(prev => prev.map(n => n.id === noteId ? res.data : n))
      } else {
        setHighlights(prev => prev.map(h => h.id === noteId ? res.data : h))
      }
      setEditingNote(null)
      setEditText('')
    } catch (err) {
      console.error('Failed to update note', err)
    }
    setSavingNote(false)
  }

  const deleteNote = async (noteId, type) => {
    try {
      await api.delete(`/study-notes/${noteId}`)
      if (type === 'note') {
        setNotes(prev => prev.filter(n => n.id !== noteId))
      } else {
        setHighlights(prev => prev.filter(h => h.id !== noteId))
      }
    } catch (err) {
      console.error('Failed to delete note', err)
    }
  }

  // ─── Computed values ───
  const isPdf = fileType.includes('pdf') || fileType === 'pdf'
  const isDocx = fileType.includes('docx') || fileType.includes('doc') || fileType === 'docx' || fileType === 'doc'
  const isPptx = fileType.includes('pptx') || fileType === 'pptx'
  const pageNotes = notes.filter(n => n.page === currentPage)
  const pageHighlights = highlights.filter(h => h.page === currentPage)
  const comprehension = Math.min(100, Math.round(((notes.length * 5) + (highlights.length * 3))))

  if (!topic) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">menu_book</span>
          <p className="font-body-md text-on-surface-variant">Topic not found</p>
          <Link to={`/courses/${courseId}`} className="text-primary font-button mt-4 inline-block hover:underline">Back to Course</Link>
        </div>
      </div>
    )
  }

  const formatTime = (iso) => {
    try { return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  // ─── Render a note/highlight card ───
  const renderNoteCard = (item, type) => {
    const isEditing = editingNote === item.id
    const bgClass = type === 'highlight' ? 'bg-amber-50 border-amber-200' : 'bg-surface-container-low border-outline-variant/20'
    const labelClass = type === 'highlight' ? 'text-amber-700' : 'text-primary-container'

    return (
      <div key={item.id} className={`rounded-lg p-3 border ${bgClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-bold ${labelClass}`}>Page {item.page}</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-on-surface-variant">{formatTime(item.createdAt || item.created_at)}</span>
            {!isEditing && (
              <>
                <button onClick={() => startEditNote(item)} className="p-0.5 text-on-surface-variant hover:text-primary-container transition-colors" title="Edit">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
                <button onClick={() => deleteNote(item.id, type)} className="p-0.5 text-on-surface-variant hover:text-error transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full bg-white border border-outline-variant/30 rounded-lg p-2 text-sm font-body resize-none focus:ring-2 focus:ring-primary outline-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => saveEditNote(item.id, type)} disabled={savingNote || !editText.trim()} className="flex-1 px-2 py-1.5 bg-primary-container text-white rounded-lg font-button text-xs hover:opacity-90 disabled:opacity-50">
                {savingNote ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => { setEditingNote(null); setEditText('') }} className="px-2 py-1.5 border border-outline text-on-surface-variant rounded-lg font-button text-xs hover:bg-surface-container">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-on-surface leading-relaxed">{item.text}</p>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-surface-container-low overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-surface-container-lowest border-b border-outline-variant/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to={`/courses/${courseId}`} className="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-h3 text-h3 text-primary-container truncate max-w-md">Reading: {topic.name}</h1>
            <span className="text-xs text-on-surface-variant uppercase">{fileType || topic.materialType}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(isPdf || isPptx) && (
            <>
              <button onClick={handleZoomOut} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors" title="Zoom Out">
                <span className="material-symbols-outlined text-lg">zoom_out</span>
              </button>
              <button onClick={() => setZoomIndex(2)} className="px-2 py-1 text-sm font-body text-on-surface-variant hover:bg-surface-container rounded transition-colors min-w-[3rem]">
                {Math.round(zoom * 100)}%
              </button>
              <button onClick={handleZoomIn} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors" title="Zoom In">
                <span className="material-symbols-outlined text-lg">zoom_in</span>
              </button>
              <div className="w-px h-6 bg-outline-variant/30 mx-1" />
            </>
          )}
          <button onClick={handlePrevPage} disabled={currentIndex <= 0} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-30" title="Previous Page">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <span className="text-sm font-body text-on-surface-variant min-w-[4rem] text-center">
            {selectedPages
              ? `Page ${currentPage} (${currentIndex + 1}/${visiblePageCount})`
              : `${isPptx ? 'Slide' : 'Page'} ${currentPage} / ${totalPages || topic.totalPages || '?'}`}
          </span>
          <button onClick={handleNextPage} disabled={currentIndex >= visiblePageCount - 1} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-30" title="Next Page">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/30 mx-1" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors" title="Toggle Sidebar">
            <span className="material-symbols-outlined text-lg">{sidebarOpen ? 'right_panel_close' : 'right_panel_open'}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ═══ Document viewer ═══ */}
        <div className="flex-1 overflow-auto bg-surface-container-low flex items-start justify-center p-6">
          {loading ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-pulse mb-4">hourglass_top</span>
              <p className="font-body-md text-on-surface-variant">Loading document...</p>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 max-w-2xl w-full">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">description</span>
                <h3 className="font-h3 text-h3 text-primary-container mb-2">{topic.name}</h3>
                <p className="text-sm text-error mb-4">{error}</p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button onClick={handleMarkRead} className="px-4 py-2 bg-primary-container text-white rounded-lg font-button text-sm hover:opacity-90 transition-opacity">Mark as Reading</button>
                  <Link to={`/courses/${courseId}/topics/${topicId}/materials`} className="px-4 py-2 border border-outline text-on-surface-variant rounded-lg font-button text-sm hover:bg-surface-container transition-colors">Upload Materials</Link>
                </div>
              </div>
            </div>
          ) : !topic.hasMaterials ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 max-w-2xl w-full">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">auto_stories</span>
                <h3 className="font-h3 text-h3 text-primary-container mb-2">{topic.name}</h3>
                <p className="text-sm text-on-surface-variant mb-4">No materials uploaded for this topic yet.</p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Link to={`/courses/${courseId}/topics/${topicId}/materials`} className="px-4 py-2 bg-primary-container text-white rounded-lg font-button text-sm hover:opacity-90 transition-opacity">Upload Materials</Link>
                </div>
              </div>
            </div>
          ) : isPdf ? (
            <div className="flex items-start justify-center w-full">
              <div
                ref={pdfWrapperRef}
                className="shadow-lg rounded-sm bg-white flex-shrink-0"
              />
            </div>
          ) : isDocx ? (
            <div className="max-w-4xl w-full">
              <div
                ref={docxContainerRef}
                className="docx-viewer-wrapper bg-white shadow-lg rounded-sm overflow-auto"
              />
            </div>
          ) : isPptx ? (
            <div className="flex items-start justify-center w-full">
              <div
                className="shadow-lg rounded-sm overflow-hidden bg-white flex-shrink-0 origin-top"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                <div
                  ref={pptxContainerRef}
                  style={{ width: '960px', minHeight: '540px', position: 'relative', userSelect: 'text' }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 max-w-2xl w-full">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">description</span>
                <p className="font-body-md text-on-surface-variant">No viewable content for this topic</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══ Right sidebar — Study Notes ═══ */}
        {sidebarOpen && (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
              <h2 className="font-h3 text-h3 text-primary-container">Study Tools</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">{notes.length} notes &middot; {highlights.length} highlights</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-outline-variant/30 flex-shrink-0">
              {['notes', 'highlights', 'summary'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-button capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary-container border-b-2 border-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >{tab}{tab === 'notes' && notes.length > 0 ? ` (${notes.length})` : tab === 'highlights' && highlights.length > 0 ? ` (${highlights.length})` : ''}</button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Comprehension bar — always visible */}
              <div className="bg-secondary-container/10 rounded-xl p-3 border border-secondary-container/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-label-caps text-on-surface-variant">Comprehension</span>
                  <span className="text-sm font-bold text-secondary">{comprehension}%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${comprehension}%` }} />
                </div>
              </div>

              {/* ── Notes tab ── */}
              {activeTab === 'notes' && (
                <>
                  {/* Add note form */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary-container">edit_note</span>
                      <span className="text-xs font-label-caps text-on-surface-variant">Add Note (Page {currentPage})</span>
                    </div>
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote() }}
                      placeholder="Write a note about this page..."
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-sm font-body resize-none focus:ring-2 focus:ring-primary outline-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addNote}
                        disabled={!noteText.trim() || savingNote}
                        className="flex-1 px-3 py-2 bg-primary-container text-white rounded-lg font-button text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {savingNote ? 'Saving...' : 'Save Note'}
                      </button>
                      <button
                        onClick={addHighlight}
                        className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-button text-xs hover:bg-amber-200 transition-colors flex items-center gap-1"
                        title="Highlight selected text"
                      >
                        <span className="material-symbols-outlined text-sm">highlight</span>
                        Highlight
                      </button>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">Tip: Select text in the document, then click Highlight to save it. Press Ctrl+Enter to save a note.</p>
                  </div>

                  {/* Notes for current page */}
                  {pageNotes.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-label-caps text-on-surface-variant">This Page</span>
                      {pageNotes.map(n => renderNoteCard(n, 'note'))}
                    </div>
                  )}

                  {/* Highlights for current page */}
                  {pageHighlights.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-label-caps text-on-surface-variant">Page Highlights</span>
                      {pageHighlights.map(h => renderNoteCard(h, 'highlight'))}
                    </div>
                  )}

                  {/* All notes from other pages */}
                  {notes.filter(n => n.page !== currentPage).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                      <span className="text-xs font-label-caps text-on-surface-variant">Other Pages</span>
                      {notes.filter(n => n.page !== currentPage).map(n => renderNoteCard(n, 'note'))}
                    </div>
                  )}
                </>
              )}

              {/* ── Highlights tab ── */}
              {activeTab === 'highlights' && (
                <div className="space-y-2">
                  {highlights.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl mb-2">highlight</span>
                      <p className="text-sm font-bold">No highlights yet</p>
                      <p className="text-xs mt-2 leading-relaxed">Select text in the document, then click the <strong>Highlight</strong> button in the Notes tab to save it.</p>
                    </div>
                  ) : (
                    <>
                      {/* Group highlights by page */}
                      {[...new Set(highlights.map(h => h.page))].sort((a, b) => a - b).map(page => (
                        <div key={page}>
                          <p className="text-xs font-label-caps text-on-surface-variant mb-1.5 mt-2 first:mt-0">Page {page}</p>
                          {highlights.filter(h => h.page === page).map(h => renderNoteCard(h, 'highlight'))}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* ── Summary tab ── */}
              {activeTab === 'summary' && (
                <div className="space-y-3">
                  <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
                    <h4 className="text-xs font-bold text-primary-container mb-2">Topic Overview</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {topic.subtitle || topic.name}. Part of {course?.name || 'this course'}.
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">auto_stories</span>
                        {topic.pagesRead ?? 0}/{visiblePageCount || topic.totalPages || 10} pages read
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">edit_note</span>
                        {notes.length} notes
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">highlight</span>
                        {highlights.length} highlights
                      </span>
                    </div>
                  </div>

                  {/* Auto-generated summary from highlights */}
                  {highlights.length > 0 && (
                    <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
                      <h4 className="text-xs font-bold text-primary-container mb-2">Key Highlights</h4>
                      <ul className="space-y-1.5">
                        {highlights.slice(0, 8).map(h => (
                          <li key={h.id} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0">&bull;</span>
                            <span className="italic">"{h.text.length > 80 ? h.text.slice(0, 80) + '...' : h.text}"</span>
                          </li>
                        ))}
                        {highlights.length > 8 && (
                          <li className="text-xs text-on-surface-variant pl-4">+ {highlights.length - 8} more highlights</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Study progress */}
                  <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
                    <h4 className="text-xs font-bold text-primary-container mb-2">Study Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">Reading progress</span>
                        <span className="font-bold text-primary-container">{Math.min(100, Math.round(((topic.pagesRead ?? 0) / (visiblePageCount || topic.totalPages || 10)) * 100))}%</span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((topic.pagesRead ?? 0) / (visiblePageCount || topic.totalPages || 10)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-outline-variant/30 space-y-2 flex-shrink-0">
              <button onClick={handleMarkRead} className="w-full px-4 py-2.5 bg-primary-container text-white rounded-xl font-button text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>Mark Page as Read
              </button>
              <Link to={`/courses/${courseId}`} className="w-full px-4 py-2.5 border border-outline text-on-surface-variant rounded-xl font-button text-sm hover:bg-surface-container transition-colors text-center block">
                Back to Course
              </Link>
            </div>
          </aside>
        )}
      </div>

      {/* Scoped styles for document viewers */}
      <style>{`
        /* docx-preview wrapper */
        .docx-viewer-wrapper {
          user-select: text;
          -webkit-user-select: text;
        }
        .docx-viewer-wrapper .docx-wrapper {
          background: transparent !important;
          padding: 0 !important;
        }
        .docx-viewer-wrapper .docx-wrapper > section.docx {
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
          margin-bottom: 1.5rem !important;
          background: white !important;
        }

        /* PPTX slide container */
        .pptx-slide {
          user-select: text;
        }
        .pptx-slide ::selection {
          background: rgba(0, 100, 200, 0.3);
        }
      `}</style>
    </div>
  )
}
