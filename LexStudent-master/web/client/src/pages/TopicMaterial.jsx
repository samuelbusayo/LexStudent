import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import api from '../services/api'
import { useCourse, useTopics, useUpdateMaterial, useDeleteMaterial } from '../hooks/useCourses'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`

export default function TopicMaterial() {
  const { courseId, topicId } = useParams()
  const navigate = useNavigate()
  const { data: course } = useCourse(courseId)
  const { data: topics, isLoading } = useTopics(courseId)
  const updateMaterial = useUpdateMaterial()
  const deleteMaterial = useDeleteMaterial()

  const topic = topics?.find(t => t.id === Number(topicId))
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [pdfPages, setPdfPages] = useState([])
  const [docxHtml, setDocxHtml] = useState('')
  const [processing, setProcessing] = useState(false)
  const [selectedPages, setSelectedPages] = useState(new Set())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [showUploader, setShowUploader] = useState(false)
  const [previewPage, setPreviewPage] = useState(null)
  const [previewHiResUrl, setPreviewHiResUrl] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const fileInputRef = useRef(null)
  const pdfDocRef = useRef(null)

  useEffect(() => {
    if (topic?.hasMaterials && topic.selectedPages) {
      setSelectedPages(new Set(topic.selectedPages))
    }
  }, [topic])

  const handleFileSelect = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const ext = f.name.split('.').pop().toLowerCase()
    setFileType(ext)
    setPreviewUrl(URL.createObjectURL(f))
    setProcessing(true)
    setPdfPages([])
    setDocxHtml('')

    if (ext === 'pdf') {
      try {
        const arrayBuffer = await f.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        pdfDocRef.current = pdf
        const pages = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 0.4 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          await page.render({ canvasContext: ctx, viewport }).promise
          pages.push({ number: i, dataUrl: canvas.toDataURL() })
        }
        setPdfPages(pages)
      } catch (err) { console.error('PDF error', err) }
    } else if (ext === 'docx' || ext === 'doc') {
      try {
        const arrayBuffer = await f.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setDocxHtml(result.value)
      } catch (err) { console.error('DOCX error', err) }
    }
    setProcessing(false)
  }

  const togglePage = (num) => {
    setSelectedPages(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  const handlePageClick = (pageNum) => {
    togglePage(pageNum)
  }

  useEffect(() => {
    if (!previewPage || !pdfDocRef.current) {
      setPreviewHiResUrl('')
      return
    }
    let cancelled = false
    setPreviewLoading(true)
    setPreviewHiResUrl('')
    ;(async () => {
      try {
        const page = await pdfDocRef.current.getPage(previewPage.number)
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const viewport = page.getViewport({ scale: 2.0 * dpr })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        if (!cancelled) setPreviewHiResUrl(canvas.toDataURL())
      } catch (err) {
        console.error('Preview render error', err)
      }
      if (!cancelled) setPreviewLoading(false)
    })()
    return () => { cancelled = true }
  }, [previewPage])

  const handlePageDoubleClick = (page) => {
    setPreviewPage(page)
  }

  const handleSave = async () => {
    if (!file || !topic) return
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.post(`/materials/upload/${topicId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      await updateMaterial.mutateAsync({
        courseId,
        topicId,
        data: {
          materialFile: file.name,
          materialType: fileType,
          selectedPages: Array.from(selectedPages).sort((a, b) => a - b),
          totalDocumentPages: pdfPages.length || 0,
          hasMaterials: true,
        },
      })
      setMessage({ type: 'success', text: 'Material saved successfully!' })
      setTimeout(() => navigate(`/courses/${courseId}`), 1200)
    } catch (err) {
      console.error('Save material error', err)
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save material' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!topic) return
    if (!confirm('Remove all materials from this topic?')) return
    setSaving(true)
    try {
      await deleteMaterial.mutateAsync({ courseId, topicId })
      setShowUploader(true)
      setFile(null)
      setPdfPages([])
      setDocxHtml('')
      setSelectedPages(new Set())
      setMessage({ type: 'success', text: 'Material removed' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove material' })
    }
    setSaving(false)
  }

  if (isLoading) return <div className="py-12 text-center text-on-surface-variant">Loading...</div>
  if (!topic) return (
    <div className="py-20 text-center">
      <span className="material-symbols-outlined text-4xl text-outline mb-4">error</span>
      <p className="font-body-md">Topic not found</p>
      <Link to={`/courses/${courseId}`} className="text-primary font-button mt-4 inline-block hover:underline">Back</Link>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-stack-lg">
        <Link to={`/courses/${courseId}`} className="text-on-surface-variant font-body-md hover:text-primary-container transition-colors inline-flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Course
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-h1 text-h1 text-primary-container">{topic.name}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{topic.subtitle || course?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {topic.hasMaterials && !showUploader && (
              <>
                <button onClick={() => setShowUploader(true)}
                  className="px-4 py-2.5 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  Upload New
                </button>
                <button onClick={handleDelete}
                  className="px-4 py-2.5 border border-error/30 text-error rounded-xl font-button text-button hover:bg-error/5 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-stack-md p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-secondary-container/20 border border-secondary-container/30' : 'bg-error-container/20 border border-error/30'
        }`}>
          <span className="material-symbols-outlined text-secondary">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          <p className="font-body-md">{message.text}</p>
        </div>
      )}

      {/* No materials state or uploader visible */}
      {(!topic.hasMaterials || showUploader) && !file && (
        <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center hover:border-primary-container transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">cloud_upload</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Upload PDF, DOCX, or DOC file</p>
            <p className="text-xs text-on-surface-variant mt-2">Supports .pdf, .docx, .doc, .pptx</p>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.pptx" onChange={handleFileSelect} />
        </div>
      )}

      {/* File selected - show preview and page selection */}
      {file && (
        <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          {/* File info */}
          <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3 mb-stack-md">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">description</span>
              <div>
                <p className="font-body-md font-bold text-primary-container">{file.name}</p>
                <p className="text-xs text-on-surface-variant">{(file.size / 1024 / 1024).toFixed(1)} MB • {fileType.toUpperCase()}</p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-error transition-colors" onClick={() => { setFile(null); setPdfPages([]); setDocxHtml(''); setSelectedPages(new Set()) }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Processing */}
          {processing && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl animate-pulse mb-2">hourglass_top</span>
              <p>Processing document...</p>
            </div>
          )}

          {/* PDF pages */}
          {pdfPages.length > 0 && !processing && (
            <div>
              <div className="flex items-center justify-between mb-stack-md">
                <h3 className="font-h3 text-h3 text-primary-container">Select pages for this topic</h3>
                <button onClick={() => setSelectedPages(selectedPages.size === pdfPages.length ? new Set() : new Set(pdfPages.map(p => p.number)))}
                  className="text-sm text-primary font-button hover:underline">
                  {selectedPages.size === pdfPages.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mb-stack-sm">{selectedPages.size} of {pdfPages.length} pages selected</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto p-2">
                {pdfPages.map(page => (
                  <div key={page.number}
                    onClick={() => handlePageClick(page.number)}
                    onDoubleClick={() => handlePageDoubleClick(page)}
                    className={`rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                      selectedPages.has(page.number) ? 'border-primary-container bg-primary-container/5 shadow-md' : 'border-outline-variant/40 hover:border-outline-variant'
                    }`}>
                    <img src={page.dataUrl} alt={`Page ${page.number}`} className="w-full" />
                    <div className={`text-center py-1.5 text-xs font-bold ${
                      selectedPages.has(page.number) ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}>{page.number}</div>
                    <div className="text-center pb-1 text-[10px] text-on-surface-variant opacity-70">
                      Double click to view
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCX preview */}
          {docxHtml && !processing && (
            <div>
              <h3 className="font-h3 text-h3 text-primary-container mb-stack-md">Document Preview</h3>
              <div className="prose max-w-none border border-outline-variant/30 rounded-xl p-stack-md max-h-[500px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: docxHtml }} />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-stack-lg pt-stack-md border-t border-outline-variant/30">
            <button onClick={() => { setFile(null); setPdfPages([]); setDocxHtml(''); setSelectedPages(new Set()) }}
              className="flex-1 px-6 py-3 border border-outline text-on-surface-variant rounded-xl font-button text-button hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || (!pdfPages.length && !docxHtml)}
              className="flex-1 px-6 py-3 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Material'}
            </button>
          </div>
        </div>
      )}

      {/* Existing material display */}
      {topic.hasMaterials && !showUploader && !file && (
        <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-h3 text-h3 text-primary-container">Current Material</h3>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {topic.selectedPages?.length || 0} pages selected
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">
              {topic.materialType === 'pdf' ? 'picture_as_pdf' : 'description'}
            </span>
            <p className="font-body-md font-bold text-primary-container">{topic.materialFile || 'material.' + (topic.materialType || 'pdf')}</p>
            <p className="text-xs text-on-surface-variant mt-1">{topic.materialType?.toUpperCase() || 'DOCUMENT'} • {topic.totalDocumentPages || 0} pages total</p>
          </div>

          {/* Selected pages strip */}
          {topic.selectedPages?.length > 0 && (
            <div className="mt-4">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SELECTED PAGES</p>
              <div className="flex gap-2 flex-wrap">
                {topic.selectedPages.map(p => (
                  <span key={p} className="w-10 h-10 rounded-lg bg-primary-container text-white flex items-center justify-center text-xs font-bold">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* External file upload ref */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.pptx" onChange={handleFileSelect} />

      {/* Page Preview Modal */}
      {previewPage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewPage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-surface-container-lowest rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-outline-variant/30">
              <span className="font-body-md font-bold text-primary-container">Page {previewPage.number}</span>
              <button
                onClick={() => setPreviewPage(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div
              className="overflow-auto p-4 flex flex-col items-center max-h-[calc(90vh-4rem)]"
            >
              {previewLoading && !previewHiResUrl ? (
                <div className="relative w-full max-w-3xl">
                  <img src={previewPage.dataUrl} alt={`Page ${previewPage.number}`} className="w-full opacity-40 shadow-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-surface-container-lowest/90 px-4 py-2 rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined animate-pulse text-sm">hourglass_top</span>
                      <span className="text-sm font-body text-on-surface-variant">Loading high-res preview...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={previewHiResUrl || previewPage.dataUrl}
                  alt={`Page ${previewPage.number}`}
                  className="w-full max-w-3xl shadow-lg"
                  style={{ imageRendering: 'auto' }}
                />
              )}
              <p className="mt-4 text-sm text-on-surface-variant">
                Click to {selectedPages.has(previewPage.number) ? 'deselect' : 'select'} this page
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
