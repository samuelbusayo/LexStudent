import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'
import { renderAsync as renderDocx } from 'docx-preview'
import { PptxViewer, parseZip, buildPresentation } from '@aiden0z/pptx-renderer'
import api from '../services/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
const AUTOSAVE_DELAY = 1200 // ms

/** Resolve target page index: ?page= deep-link → localStorage → 0 */
function resolveTargetIndex(pageCount, selPages, params, key) {
  const pageParam = params.get('page')
  if (pageParam) {
    const target = Number(pageParam)
    if (!isNaN(target) && target > 0) {
      const idx = selPages ? selPages.indexOf(target) : target - 1
      if (idx >= 0 && (pageCount <= 0 || idx < pageCount)) return idx
    }
  }
  if (!pageParam) {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.currentPage !== undefined) {
          const idx = selPages ? selPages.indexOf(parsed.currentPage) : parsed.currentPage - 1
          if (idx >= 0 && (pageCount <= 0 || idx < pageCount)) return idx
        }
      }
    } catch {}
  }
  return 0
}

/** HTML helpers for contentEditable structured editor */
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Render structured body nodes → HTML for the contentEditable editor */
function nodesToHtml(nodes) {
  if (!nodes || nodes.length === 0) return ''
  return nodes.map(n => {
    if (n.type === 'text') return escHtml(n.value).replace(/\n/g, '<br>')
    if (n.type === 'highlight') {
      return `<span contenteditable="false" class="hl-chip" data-sid="${n.sourceId || ''}" data-page="${n.page || 1}" data-para="${n.paragraph ?? ''}" data-text="${escAttr(n.text)}" data-anchor="${escAttr(n.anchorText || '')}"><span class="hl-quote">“${escHtml(n.text)}”</span><span class="hl-ref">p.${n.page || 1}${n.paragraph != null ? ' ¶' + n.paragraph : ''}</span><span class="hl-del" data-del="1">×</span></span>`
    }
    return ''
  }).join('')
}

/** Parse contentEditable DOM back into structured body nodes */
function parseEditorDom(el) {
  const result = []
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent) result.push({ type: 'text', value: node.textContent })
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList?.contains('hl-chip')) {
        result.push({
          type: 'highlight',
          text: node.dataset.text || '',
          page: parseInt(node.dataset.page) || 1,
          paragraph: node.dataset.para !== '' && node.dataset.para !== undefined ? parseInt(node.dataset.para) : null,
          anchorText: node.dataset.anchor || '',
          sourceId: node.dataset.sid ? parseInt(node.dataset.sid) : null,
        })
      } else if (node.tagName === 'BR') {
        result.push({ type: 'text', value: '\n' })
      } else {
        for (const child of node.childNodes) walk(child)
      }
    }
  }
  for (const child of el.childNodes) walk(child)
  // Merge adjacent text nodes
  const merged = []
  for (const n of result) {
    if (n.type === 'text' && merged.length > 0 && merged[merged.length - 1].type === 'text') {
      merged[merged.length - 1].value += n.value
    } else {
      merged.push({ ...n })
    }
  }
  return merged
}

export default function TopicReader() {
  const { courseId, topicId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: course } = useCourse(courseId)
  const { data: topics } = useTopics(courseId)
  const topic = topics?.find(t => t.id === Number(topicId))

  // Memoize so the reference is stable across renders — otherwise the
  // restore-position effect re-runs constantly and forces the user back
  // to the deep-linked ?page= every time React re-renders.
  const selectedPages = useMemo(() => (
    topic?.selectedPages?.length > 0
      ? [...topic.selectedPages].sort((a, b) => a - b)
      : null
  ), [topic?.selectedPages])

  const storageKey = `topic-reader-position-${topicId}`
  const hasRestoredRef = useRef(false)

  const [currentIndex, setCurrentIndex] = useState(() =>
    resolveTargetIndex(0, selectedPages, searchParams, storageKey)
  )
  const [totalPages, setTotalPages] = useState(0)
  const [zoomIndex, setZoomIndex] = useState(2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fileType, setFileType] = useState('')

  // Summary Notes state (structured body: array of text + highlight nodes)
  const [bodyNodes, setBodyNodes] = useState([])
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // '', 'saving', 'saved'

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
  const autosaveTimerRef = useRef(null)
  const lastSavedBodyRef = useRef('')
  const editorRef = useRef(null)
  const bodyNodesRef = useRef([])

  const zoom = ZOOM_LEVELS[zoomIndex]
  const currentPage = selectedPages ? selectedPages[currentIndex] : currentIndex + 1
  const visiblePageCount = selectedPages ? selectedPages.length : totalPages

  // ─── Load Summary + Highlights from server ───
  const loadSummaryData = useCallback(async () => {
    try {
      const res = await api.get(`/study-notes/${topicId}/summary`)
      const nodes = res.data.body || []
      setBodyNodes(nodes)
      bodyNodesRef.current = nodes
      lastSavedBodyRef.current = JSON.stringify(nodes)
      setSummaryLoaded(true)
    } catch (err) {
      console.error('Failed to load summary data', err)
      setSummaryLoaded(true)
    }
  }, [topicId])

  useEffect(() => {
    if (topicId) loadSummaryData()
  }, [topicId, loadSummaryData])

  // Sync contentEditable DOM after data loads
  const syncEditorDom = useCallback((nodes) => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = nodesToHtml(nodes)
  }, [])

  useEffect(() => {
    if (summaryLoaded) syncEditorDom(bodyNodes)
  }, [summaryLoaded]) // only on initial load

  // ─── Autosave summary (debounced) ───
  const saveSummary = useCallback(async (nodes) => {
    const json = JSON.stringify(nodes)
    if (json === lastSavedBodyRef.current) return
    setSaveStatus('saving')
    try {
      await api.put(`/study-notes/${topicId}/summary`, { body: nodes })
      lastSavedBodyRef.current = json
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (err) {
      console.error('Failed to save summary', err)
      setSaveStatus('')
    }
  }, [topicId])

  const handleEditorInput = useCallback(() => {
    if (!editorRef.current) return
    const newNodes = parseEditorDom(editorRef.current)
    bodyNodesRef.current = newNodes
    setBodyNodes(newNodes)
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => saveSummary(newNodes), AUTOSAVE_DELAY)
  }, [saveSummary])

  const handleEditorPaste = useCallback((e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }, [])

  const handleEditorKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
  }, [])

  const handleEditorClick = useCallback((e) => {
    // Delete button on highlight chip
    if (e.target.closest('[data-del]')) {
      e.preventDefault()
      const chip = e.target.closest('.hl-chip')
      if (!chip) return
      const sid = parseInt(chip.dataset.sid)
      if (sid) deleteHighlightBySourceId(sid)
      return
    }
    // Click on highlight chip → jump to that page
    const chip = e.target.closest('.hl-chip')
    if (!chip) return
    const page = parseInt(chip.dataset.page)
    const para = chip.dataset.para !== '' && chip.dataset.para !== undefined ? parseInt(chip.dataset.para) : null
    const targetIndex = selectedPages ? selectedPages.indexOf(page) : page - 1
    if (targetIndex >= 0) {
      setCurrentIndex(targetIndex)
      try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: page, timestamp: Date.now() })) } catch {}
    }
  }, [selectedPages, storageKey])

  // Flush pending autosave on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
        const json = JSON.stringify(bodyNodesRef.current)
        if (json !== lastSavedBodyRef.current) {
          navigator.sendBeacon?.(`/api/study-notes/${topicId}/summary`,
            new Blob([JSON.stringify({ body: bodyNodesRef.current })], { type: 'application/json' }))
        }
      }
    }
  }, [topicId])

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
        setCurrentIndex(resolveTargetIndex(pdf.numPages, selectedPages, searchParams, storageKey))
      } else if (ft.includes('pptx') || ft === 'pptx') {
        const files = await parseZip(arrayBuffer)
        const presentation = buildPresentation(files)
        pptxPresentationRef.current = presentation
        const slideCount = presentation.slides.length || 1
        setTotalPages(slideCount)
        setCurrentIndex(resolveTargetIndex(slideCount, selectedPages, searchParams, storageKey))
      } else if (ft.includes('docx') || ft.includes('doc') || ft === 'docx' || ft === 'doc') {
        setTotalPages(1)
        setCurrentIndex(resolveTargetIndex(1, selectedPages, searchParams, storageKey))
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

  // Restore position once, after the document has loaded. Don't re-run
  // on subsequent renders — that would fight user navigation by snapping
  // back to ?page= every time a re-render happens.
  useEffect(() => {
    if (totalPages > 0 && !hasRestoredRef.current) {
      hasRestoredRef.current = true
      const maxPage = selectedPages ? selectedPages.length : totalPages
      const idx = resolveTargetIndex(maxPage, selectedPages, searchParams, storageKey)
      setCurrentIndex(prev => prev !== idx ? idx : prev)
    }
  }, [totalPages, selectedPages, storageKey, searchParams])

  // Reset the restore guard if the user navigates to a different topic
  useEffect(() => { hasRestoredRef.current = false }, [topicId])

  // ─── Deep-link paragraph scrolling ───
  useEffect(() => {
    const paraParam = searchParams.get('para')
    if (!paraParam || loading) return
    const paraIdx = Number(paraParam)
    if (isNaN(paraIdx)) return

    // Wait a tick for the page to finish rendering
    const timer = setTimeout(() => {
      const wrapper = pdfWrapperRef.current || docxContainerRef.current
      if (!wrapper) return
      const textSpans = wrapper.querySelectorAll('.textLayer span, p, [class*="docx"] p')
      if (paraIdx < textSpans.length) {
        const target = textSpans[paraIdx]
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Flash highlight
        target.style.transition = 'background 0.3s'
        target.style.background = 'rgba(255,213,79,0.5)'
        setTimeout(() => { target.style.background = '' }, 2000)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [loading, currentPage, searchParams])

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

  // Back button: honor router state — go back if we came from summary or planner
  const handleBack = () => {
    const from = location.state?.from
    if (from === 'summary' || from === 'planner') {
      navigate(-1)
    } else {
      navigate(`/courses/${courseId}`)
    }
  }

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

  // ─── Highlight: capture paragraph anchor, append inline ───
  const addHighlight = async () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()
    if (!selectedText) return
    setSavingNote(true)

    // Compute paragraph index from selection
    let paragraph = null
    let anchorText = selectedText.slice(0, 60)
    try {
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = range.startContainer
        const wrapper = pdfWrapperRef.current || docxContainerRef.current
        if (wrapper) {
          const textSpans = wrapper.querySelectorAll('.textLayer span, p, [class*="docx"] p')
          const parentEl = container.nodeType === 3 ? container.parentElement : container
          for (let i = 0; i < textSpans.length; i++) {
            if (textSpans[i] === parentEl || textSpans[i].contains(parentEl)) {
              paragraph = i
              break
            }
          }
        }
      }
    } catch (e) { /* fall back to page-only */ }

    try {
      // 1. Create study_notes row to get sourceId
      const res = await api.post(`/study-notes/${topicId}/highlight`, {
        page: currentPage,
        paragraph,
        anchorText,
        text: selectedText,
      })
      const sourceId = res.data.id

      // 2. Parse current editor DOM and append highlight node
      const currentNodes = editorRef.current
        ? parseEditorDom(editorRef.current)
        : [...bodyNodesRef.current]
      currentNodes.push({
        type: 'highlight',
        text: selectedText,
        page: currentPage,
        paragraph,
        anchorText,
        sourceId,
      })

      // 3. Update state + DOM
      bodyNodesRef.current = currentNodes
      setBodyNodes(currentNodes)
      syncEditorDom(currentNodes)

      // 4. Place cursor at end of editor
      if (editorRef.current) {
        const range = document.createRange()
        const sel2 = window.getSelection()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        sel2.removeAllRanges()
        sel2.addRange(range)
        editorRef.current.focus()
      }

      // 5. Save immediately
      saveSummary(currentNodes)

      // 6. Visual mark in document
      try {
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const mark = document.createElement('mark')
          mark.style.cssText = 'background:rgba(255,213,79,0.4);border-radius:2px;padding:0 1px;'
          range.surroundContents(mark)
        }
      } catch (e) { /* cross-element selections can fail */ }
      selection.removeAllRanges()
    } catch (err) {
      console.error('Failed to save highlight', err)
    }
    setSavingNote(false)
  }

  const deleteHighlightBySourceId = async (sourceId) => {
    try {
      await api.delete(`/study-notes/${sourceId}`)
      const currentNodes = editorRef.current
        ? parseEditorDom(editorRef.current)
        : [...bodyNodesRef.current]
      const filtered = currentNodes.filter(n => !(n.type === 'highlight' && n.sourceId === sourceId))
      bodyNodesRef.current = filtered
      setBodyNodes(filtered)
      syncEditorDom(filtered)
      saveSummary(filtered)
    } catch (err) {
      console.error('Failed to delete highlight', err)
    }
  }

  // ─── Computed values ───
  const isPdf = fileType.includes('pdf') || fileType === 'pdf'
  const isDocx = fileType.includes('docx') || fileType.includes('doc') || fileType === 'docx' || fileType === 'doc'
  const isPptx = fileType.includes('pptx') || fileType === 'pptx'
  const highlightCount = bodyNodes.filter(n => n.type === 'highlight').length
  const hasText = bodyNodes.some(n => n.type === 'text' && n.value.trim())
  const comprehension = Math.min(100, Math.round((hasText ? 20 : 0) + (highlightCount * 8)))

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

  return (
    <div className="h-screen flex flex-col bg-surface-container-low overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-surface-container-lowest border-b border-outline-variant/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
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
        <div className="flex-1 overflow-auto bg-surface-container-low flex items-start justify-center p-6 select-none">
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

        {/* ═══ Right sidebar — Summary Notes (inline editor) ═══ */}
        {sidebarOpen && (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-outline-variant/30 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-h3 text-h3 text-primary-container">Summary Notes</h2>
                {saveStatus && (
                  <span className={`text-[10px] font-label-caps ${saveStatus === 'saving' ? 'text-on-surface-variant' : 'text-green-600'}`}>
                    {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{highlightCount} highlight{highlightCount !== 1 ? 's' : ''}</p>
            </div>

            {/* Scrollable content */}
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

              {/* Inline structured editor (contentEditable) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary-container">edit_note</span>
                  <span className="text-xs font-label-caps text-on-surface-variant">Summary &amp; Highlights</span>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onPaste={handleEditorPaste}
                  onKeyDown={handleEditorKeyDown}
                  onClick={handleEditorClick}
                  data-placeholder="Write your summary notes here. Select text in the document and click Highlight to embed passages inline."
                  className="summary-editor w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-sm font-body focus:ring-2 focus:ring-primary outline-none min-h-[160px] leading-relaxed whitespace-pre-wrap"
                />
                <p className="text-[10px] text-on-surface-variant">Auto-saves as you type. Highlights are embedded inline — click one to jump to that page.</p>
              </div>

              {/* Highlight button */}
              <button
                onClick={addHighlight}
                disabled={savingNote}
                className="w-full px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-button text-xs hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                title="Highlight selected text from the document"
              >
                <span className="material-symbols-outlined text-sm">highlight</span>
                {savingNote ? 'Saving...' : 'Highlight Selected Text'}
              </button>

              {/* Empty state */}
              {bodyNodes.length === 0 && summaryLoaded && (
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
              <button onClick={handleBack} className="w-full px-4 py-2.5 border border-outline text-on-surface-variant rounded-xl font-button text-sm hover:bg-surface-container transition-colors text-center block">
                {location.state?.from === 'summary' ? 'Back to Summary'
                  : location.state?.from === 'planner' ? 'Back to Planner'
                  : 'Back to Course'}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Scoped styles for document viewers + inline highlight chips */}
      <style>{`
        .docx-viewer-wrapper { user-select: text; -webkit-user-select: text; }
        .docx-viewer-wrapper .docx-wrapper { background: transparent !important; padding: 0 !important; }
        .docx-viewer-wrapper .docx-wrapper > section.docx {
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
          margin-bottom: 1.5rem !important; background: white !important;
        }
        .pptx-slide { user-select: text; }
        .pptx-slide ::selection { background: rgba(0, 100, 200, 0.3); }

        /* Prevent over-selection in PDF text layer */
        .textLayer {
          user-select: none;
          -webkit-user-select: none;
        }
        .textLayer span {
          user-select: text;
          -webkit-user-select: text;
        }

        /* Inline highlight chips inside contentEditable */
        .hl-chip {
          display: inline-block;
          vertical-align: baseline;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 1px 6px;
          margin: 0 2px;
          cursor: pointer;
          user-select: none;
          white-space: normal;
          line-height: 1.8;
        }
        .hl-chip .hl-quote {
          font-style: italic;
          color: #92400e;
        }
        .hl-chip .hl-ref {
          font-size: 10px;
          color: #b45309;
          margin-left: 4px;
          font-style: normal;
        }
        .hl-chip .hl-del {
          margin-left: 4px;
          color: #b45309;
          cursor: pointer;
          font-weight: bold;
          font-style: normal;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .hl-chip:hover .hl-del { opacity: 1; }

        /* Placeholder for empty contentEditable */
        .summary-editor:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
