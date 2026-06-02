import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import api from '../services/api'

const AUTOSAVE_DELAY = 1200

/** Resolve target page index: ?page= deep-link → localStorage → 0 */
function resolveTargetIndex(
  pageCount: number,
  selPages: number[] | null,
  params: URLSearchParams,
  key: string
): number {
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

interface BodyNode {
  type: 'text' | 'highlight'
  value?: string
  text?: string
  page?: number
  paragraph?: number | null
  anchorText?: string
  sourceId?: number | null
}

/** HTML helpers for contentEditable structured editor */
function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escAttr(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function nodesToHtml(nodes: BodyNode[]) {
  if (!nodes || nodes.length === 0) return ''
  return nodes.map((n) => {
    if (n.type === 'text') return escHtml(n.value || '').replace(/\n/g, '<br>')
    if (n.type === 'highlight') {
      return `<span contenteditable="false" class="hl-chip" data-sid="${n.sourceId || ''}" data-page="${n.page || 1}" data-para="${n.paragraph ?? ''}" data-text="${escAttr(n.text || '')}" data-anchor="${escAttr(n.anchorText || '')}"><span class="hl-quote">"${escHtml(n.text || '')}"</span><span class="hl-ref">p.${n.page || 1}${n.paragraph != null ? ' ¶' + n.paragraph : ''}</span><span class="hl-del" data-del="1">×</span></span>`
    }
    return ''
  }).join('')
}

function parseEditorDom(el: HTMLElement): BodyNode[] {
  const result: BodyNode[] = []
  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent) result.push({ type: 'text', value: node.textContent })
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as HTMLElement
      if (elem.classList?.contains('hl-chip')) {
        result.push({
          type: 'highlight',
          text: elem.dataset.text || '',
          page: parseInt(elem.dataset.page || '1') || 1,
          paragraph: elem.dataset.para !== '' && elem.dataset.para !== undefined ? parseInt(elem.dataset.para) : null,
          anchorText: elem.dataset.anchor || '',
          sourceId: elem.dataset.sid ? parseInt(elem.dataset.sid) : null,
        })
      } else if (elem.tagName === 'BR') {
        result.push({ type: 'text', value: '\n' })
      } else {
        for (const child of Array.from(elem.childNodes)) walk(child)
      }
    }
  }
  for (const child of Array.from(el.childNodes)) walk(child)
  const merged: BodyNode[] = []
  for (const n of result) {
    if (n.type === 'text' && merged.length > 0 && merged[merged.length - 1].type === 'text') {
      merged[merged.length - 1].value = (merged[merged.length - 1].value || '') + (n.value || '')
    } else {
      merged.push({ ...n })
    }
  }
  return merged
}

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

  const [currentIndex, setCurrentIndex] = useState(() =>
    resolveTargetIndex(0, selectedPages, searchParams, storageKey)
  )
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Summary Notes state (structured body: array of text + highlight nodes)
  const [bodyNodes, setBodyNodes] = useState<BodyNode[]>([])
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedBodyRef = useRef('')
  const editorRef = useRef<HTMLDivElement | null>(null)
  const bodyNodesRef = useRef<BodyNode[]>([])

  const visiblePageCount = selectedPages ? selectedPages.length : totalPages
  const currentPage = selectedPages ? selectedPages[currentIndex] : currentIndex + 1

  // ─── Load Summary + Highlights ───
  const loadSummaryData = useCallback(async () => {
    try {
      const res = await api.get(`/study-notes/${topicId}/summary`)
      const nodes: BodyNode[] = (res.data as any).body || []
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
  const syncEditorDom = useCallback((nodes: BodyNode[]) => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = nodesToHtml(nodes)
  }, [])

  useEffect(() => {
    if (summaryLoaded) syncEditorDom(bodyNodes)
  }, [summaryLoaded])

  // ─── Autosave summary (debounced) ───
  const saveSummary = useCallback(async (nodes: BodyNode[]) => {
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

  const handleEditorPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }, [])

  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
  }, [])

  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-del]')) {
      e.preventDefault()
      const chip = target.closest('.hl-chip') as HTMLElement | null
      if (!chip) return
      const sid = parseInt(chip.dataset.sid || '0')
      if (sid) deleteHighlightBySourceId(sid)
      return
    }
    const chip = target.closest('.hl-chip') as HTMLElement | null
    if (!chip) return
    const page = parseInt(chip.dataset.page || '1')
    const para = chip.dataset.para !== '' && chip.dataset.para !== undefined ? parseInt(chip.dataset.para!) : null
    const targetIndex = selectedPages ? selectedPages.indexOf(page) : page - 1
    if (targetIndex >= 0) {
      setCurrentIndex(targetIndex)
      try { localStorage.setItem(storageKey, JSON.stringify({ currentPage: page, timestamp: Date.now() })) } catch {}
    }
  }, [selectedPages, storageKey])

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

  // ─── Position restore (safety net for param changes) ───
  useEffect(() => {
    if (totalPages > 0) {
      const maxPage = selectedPages ? selectedPages.length : totalPages
      const idx = resolveTargetIndex(maxPage, selectedPages, searchParams, storageKey)
      setCurrentIndex((prev) => prev !== idx ? idx : prev)
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

  // ─── Highlight: capture paragraph anchor, append inline ───
  const addHighlight = async () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()
    if (!selectedText) return
    setSavingNote(true)

    let paragraph: number | null = null
    const anchorText = selectedText.slice(0, 60)

    try {
      const res = await api.post(`/study-notes/${topicId}/highlight`, {
        page: currentPage,
        paragraph,
        anchorText,
        text: selectedText,
      })
      const sourceId = (res.data as any).id

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

      bodyNodesRef.current = currentNodes
      setBodyNodes(currentNodes)
      syncEditorDom(currentNodes)

      if (editorRef.current) {
        const range = document.createRange()
        const sel2 = window.getSelection()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        sel2?.removeAllRanges()
        sel2?.addRange(range)
        editorRef.current.focus()
      }

      saveSummary(currentNodes)
      selection?.removeAllRanges()
    } catch (err) {
      console.error('Failed to save highlight', err)
    }
    setSavingNote(false)
  }

  const deleteHighlightBySourceId = async (sourceId: number) => {
    try {
      await api.delete(`/study-notes/${sourceId}`)
      const currentNodes = editorRef.current
        ? parseEditorDom(editorRef.current)
        : [...bodyNodesRef.current]
      const filtered = currentNodes.filter((n) => !(n.type === 'highlight' && n.sourceId === sourceId))
      bodyNodesRef.current = filtered
      setBodyNodes(filtered)
      syncEditorDom(filtered)
      saveSummary(filtered)
    } catch (err) {
      console.error('Failed to delete highlight', err)
    }
  }

  const highlightCount = bodyNodes.filter((n) => n.type === 'highlight').length
  const hasText = bodyNodes.some((n) => n.type === 'text' && (n.value || '').trim())
  const comprehension = Math.min(100, Math.round((hasText ? 20 : 0) + (highlightCount * 8)))

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

        {/* ═══ Right sidebar — Summary Notes (inline editor) ═══ */}
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
              <p className="text-xs text-on-surface-variant mt-0.5">{highlightCount} highlight{highlightCount !== 1 ? 's' : ''}</p>
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
                  className="summary-editor w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[160px] leading-relaxed whitespace-pre-wrap"
                />
                <p className="text-[10px] text-on-surface-variant">Auto-saves as you type. Highlights are embedded inline — click one to jump to that page.</p>
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
              <button onClick={handleBack} className="w-full px-4 py-2.5 border border-outline text-on-surface-variant rounded-xl font-button text-sm hover:bg-surface-container transition-colors text-center">
                {(location.state as any)?.from === 'summary' ? 'Back to Summary' : 'Back to Course'}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Scoped styles for inline highlight chips */}
      <style>{`
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
        .hl-chip .hl-quote { font-style: italic; color: #92400e; }
        .hl-chip .hl-ref { font-size: 10px; color: #b45309; margin-left: 4px; font-style: normal; }
        .hl-chip .hl-del { margin-left: 4px; color: #b45309; cursor: pointer; font-weight: bold; font-style: normal; opacity: 0; transition: opacity 0.15s; }
        .hl-chip:hover .hl-del { opacity: 1; }
        .summary-editor:empty::before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
      `}</style>
    </div>
  )
}
