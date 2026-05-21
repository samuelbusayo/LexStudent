import { useState, useRef, useCallback, useEffect, memo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import { parseZip, buildPresentation, renderSlide as renderPptxSlideToElement } from '@aiden0z/pptx-renderer'
import api from '../services/api'

import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'

let _pdfjsWorker = new PdfjsWorker()
pdfjsLib.GlobalWorkerOptions.workerPort = _pdfjsWorker

function resetPdfjsWorker() {
  try { _pdfjsWorker.terminate() } catch {}
  _pdfjsWorker = new PdfjsWorker()
  pdfjsLib.GlobalWorkerOptions.workerPort = _pdfjsWorker
}

const BATCH_SIZE = 10
const MAX_PDF_PAGES = 200

function usePptxSlide(slideIndex, presentation) {
  const containerRef = useRef(null)
  const handleRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !presentation) return
    el.innerHTML = ''
    try {
      const slide = presentation.slides[slideIndex]
      if (!slide) return
      const handle = renderPptxSlideToElement(presentation, slide)
      handleRef.current = handle
      el.appendChild(handle.element)
    } catch (err) {
      console.error(`Slide ${slideIndex} render error`, err)
    }
    return () => {
      handleRef.current?.dispose()
      handleRef.current = null
    }
  }, [slideIndex, presentation])

  return containerRef
}

const PptxSlideThumbnail = memo(function PptxSlideThumbnail({ slideIndex, presentation }) {
  const containerRef = usePptxSlide(slideIndex, presentation)
  const w = presentation?.width || 960
  const h = presentation?.height || 540
  return (
    <div
      style={{ width: '100%', aspectRatio: `${w}/${h}`, overflow: 'hidden', position: 'relative' }}
    >
      <div
        ref={containerRef}
        style={{
          width: `${w}px`,
          height: `${h}px`,
          transform: `scale(${1 / (w / 200)})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
})

function PptxSlidePreview({ slideIndex, presentation }) {
  const containerRef = usePptxSlide(slideIndex, presentation)
  return <div ref={containerRef} style={{ width: '100%' }} />
}

export default function AddTopicMaterials() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const topicData = location.state || {}
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('')
  const [docxHtml, setDocxHtml] = useState('')
  const [pdfPages, setPdfPages] = useState([])
  const [pptxPages, setPptxPages] = useState([])
  const [totalPdfPages, setTotalPdfPages] = useState(0)
  const [selectedPages, setSelectedPages] = useState(new Set())
  const [processing, setProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [pdfWarning, setPdfWarning] = useState('')
  const [previewPage, setPreviewPage] = useState(null)
  const [previewHiResUrl, setPreviewHiResUrl] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const fileInputRef = useRef(null)
  const cancelRef = useRef(false)
  const pdfDocRef = useRef(null)
  const pptxPresentationRef = useRef(null)

  const processPdf = useCallback(async (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (ext !== 'pdf') return
    cancelRef.current = false
    setProcessing(true)
    setProcessingProgress(0)
    setError('')
    setPdfWarning('')

    try {
      const arrayBuffer = await f.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      pdfDocRef.current = pdf
      const total = pdf.numPages

      if (total > MAX_PDF_PAGES) {
        setPdfWarning(`This PDF has ${total} pages. Only the first ${MAX_PDF_PAGES} pages are shown. Save to attach the full document.`)
      }
      if (total === 0) {
        setError('This PDF appears to have no pages.')
        setProcessing(false)
        return
      }

      setTotalPdfPages(total)
      const pagesToRender = Math.min(total, MAX_PDF_PAGES)
      const allPages = []

      for (let batchStart = 0; batchStart < pagesToRender; batchStart += BATCH_SIZE) {
        if (cancelRef.current) break
        const batchEnd = Math.min(batchStart + BATCH_SIZE, pagesToRender)
        const batch = []

        for (let i = batchStart; i < batchEnd; i++) {
          if (cancelRef.current) break
          const pageNum = i + 1
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: 0.4 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          await page.render({ canvasContext: ctx, viewport }).promise
          batch.push({ number: pageNum, dataUrl: canvas.toDataURL() })
          setProcessingProgress(Math.round(((i + 1) / pagesToRender) * 100))
        }
        allPages.push(...batch)

        if (batchStart + BATCH_SIZE < pagesToRender) {
          await new Promise(r => setTimeout(r, 0))
        }
      }

      if (!cancelRef.current) {
        setPdfPages(allPages)
      }
    } catch (err) {
      console.error('PDF parse error', err)
      resetPdfjsWorker()
      if (err.name === 'PasswordException') {
        setError('This PDF is password-protected. Please use an unlocked version.')
      } else if (err.name === 'UnknownErrorException') {
        setError('Failed to parse PDF. The file may be corrupted, password-protected, or an unsupported format.')
      } else {
        setError(`PDF error: ${err.message || 'Unknown error parsing PDF'}`)
      }
      setPdfPages([])
    }
    if (!cancelRef.current) {
      setProcessing(false)
    }
  }, [])

  const processDocx = useCallback(async (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (ext !== 'docx' && ext !== 'doc') return
    setProcessing(true)
    setError('')
    try {
      const arrayBuffer = await f.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setDocxHtml(result.value)
    } catch (err) {
      console.error('DOCX parse error', err)
      setError(`DOCX error: ${err.message || 'Failed to parse document'}`)
    }
    setProcessing(false)
  }, [])

  const processPptx = useCallback(async (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (ext !== 'pptx') return
    cancelRef.current = false
    setProcessing(true)
    setProcessingProgress(0)
    setError('')
    setPdfWarning('')
    try {
      const arrayBuffer = await f.arrayBuffer()
      const files = await parseZip(arrayBuffer)
      const presentation = buildPresentation(files)
      pptxPresentationRef.current = presentation
      const total = presentation.slides.length || 1
      setTotalPdfPages(total)
      if (total > MAX_PDF_PAGES) {
        setPdfWarning(`This PPTX has ${total} slides. Only the first ${MAX_PDF_PAGES} slides are shown. Save to attach the full document.`)
      }
      const slidesToShow = Math.min(total, MAX_PDF_PAGES)
      const allSlides = []
      for (let i = 0; i < slidesToShow; i++) {
        if (cancelRef.current) break
        allSlides.push({ number: i + 1 })
        setProcessingProgress(Math.round(((i + 1) / slidesToShow) * 100))
      }
      if (!cancelRef.current) {
        setPptxPages(allSlides)
      }
    } catch (err) {
      console.error('PPTX parse error', err)
      setError(`PPTX error: ${err.message || 'Failed to parse presentation'}`)
    }
    if (!cancelRef.current) setProcessing(false)
  }, [])

  const handleFileSelect = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    cancelRef.current = true
    await new Promise(r => setTimeout(r, 50))
    cancelRef.current = false

    setFile(f)
    setError('')
    setPdfWarning('')
    setSelectedPages(new Set())
    setPdfPages([])
    setPptxPages([])
    setDocxHtml('')

    const ext = f.name.split('.').pop().toLowerCase()
    setFileType(ext)

    await processPdf(f)
    if (!cancelRef.current) {
      await processDocx(f)
    }
    if (!cancelRef.current) {
      await processPptx(f)
    }
  }

  const initFromState = useCallback(async (f) => {
    if (!f) return
    cancelRef.current = false
    setFile(f)
    setError('')
    setPdfWarning('')
    setSelectedPages(new Set())
    setPdfPages([])
    setPptxPages([])
    setDocxHtml('')

    const ext = f.name.split('.').pop().toLowerCase()
    setFileType(ext)

    await processPdf(f)
    if (!cancelRef.current) {
      await processDocx(f)
    }
    if (!cancelRef.current) {
      await processPptx(f)
    }
  }, [processPdf, processDocx, processPptx])

  const stateFile = location.state?.file
  const stateFileHandled = useRef(false)
  if (stateFile && !stateFileHandled.current) {
    stateFileHandled.current = true
    setTimeout(() => initFromState(stateFile), 0)
  }

  const togglePage = (pageNum) => {
    setSelectedPages(prev => {
      const next = new Set(prev)
      if (next.has(pageNum)) next.delete(pageNum)
      else next.add(pageNum)
      return next
    })
  }

  const handlePageClick = (pageNum) => {
    togglePage(pageNum)
  }

  const handlePageDoubleClick = (page) => {
    setPreviewPage(page)
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

  const selectAll = () => {
    const pages = pptxPages.length > 0 ? pptxPages : pdfPages
    const all = new Set(pages.map(p => p.number))
    setSelectedPages(selectedPages.size === pages.length ? new Set() : all)
  }

  const handleSubmit = async () => {
    if (!topicData.name || submitting) return
    setSubmitting(true)
    try {
      const payload = {
        name: topicData.name,
        hasMaterials: !!file,
        materialFile: file ? file.name : null,
        materialType: fileType,
        selectedPages: Array.from(selectedPages).sort((a, b) => a - b),
        totalDocumentPages: totalPdfPages || pdfPages.length || pptxPages.length || 0,
      }
      const { data: newTopic } = await api.post(`/courses/${courseId}/topics`, payload)

      if (file && newTopic?.id) {
        const formData = new FormData()
        formData.append('file', file)
        await api.post(`/materials/upload/${newTopic.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      setSuccess(true)
      setTimeout(() => navigate(`/courses/${courseId}`), 1500)
    } catch (err) {
      console.error('Save error', err)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-stack-lg">
        <Link to={`/courses/${courseId}/topics/new`} className="text-on-surface-variant font-body-md hover:text-primary-container transition-colors inline-flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Topic Details
        </Link>
        <h1 className="font-h1 text-h1 text-primary-container">Upload Materials</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Upload a document and select the pages for "{topicData.name || 'this topic'}"</p>
      </div>

      <div className="max-w-4xl bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
        {!file && (
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center hover:border-primary-container transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">cloud_upload</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Upload PDF, DOCX, or PPTX file</p>
            <p className="text-xs text-on-surface-variant mt-2">Supports .pdf, .docx, .doc, .pptx</p>
          </div>
        )}

        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.pptx" onChange={handleFileSelect} />

        {file && (
          <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3 mb-stack-md">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">description</span>
              <div>
                <p className="font-body-md font-bold text-primary-container">{file.name}</p>
                <p className="text-xs text-on-surface-variant">{(file.size / 1024 / 1024).toFixed(1)} MB &bull; {fileType.toUpperCase()}</p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-error transition-colors" onClick={() => { setFile(null); setPdfPages([]); setPptxPages([]); setDocxHtml(''); setSelectedPages(new Set()); pptxPresentationRef.current = null }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {error && (
          <div className="mb-stack-md p-4 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-lg mt-0.5">error</span>
            <div>
              <p className="font-body-md font-bold text-error">Processing Error</p>
              <p className="text-sm text-on-surface-variant mt-1">{error}</p>
            </div>
          </div>
        )}

        {pdfWarning && (
          <div className="mb-stack-md p-4 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-warning text-lg mt-0.5">warning</span>
            <p className="text-sm text-on-surface-variant">{pdfWarning}</p>
          </div>
        )}

        {processing && (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl animate-pulse mb-2">hourglass_top</span>
            <p className="font-body-md mb-2">
              {processingProgress > 0 ? `Rendering pages... ${processingProgress}%` : 'Processing document...'}
            </p>
            {processingProgress > 0 && (
              <div className="max-w-xs mx-auto bg-surface-container-low rounded-full h-2 overflow-hidden">
                <div className="bg-primary-container h-full rounded-full transition-all duration-300" style={{ width: `${processingProgress}%` }} />
              </div>
            )}
          </div>
        )}

        {pdfPages.length > 0 && !processing && (
          <div>
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-h3 text-h3 text-primary-container">Select Pages for this Topic</h3>
              <button onClick={selectAll} className="text-sm text-primary font-button hover:underline">
                {selectedPages.size === pdfPages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex items-center gap-2 mb-stack-sm text-xs text-on-surface-variant">
              <span>{selectedPages.size} of {pdfPages.length} pages selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-2">
              {pdfPages.map(page => (
                <div
                  key={page.number}
                  onClick={() => handlePageClick(page.number)}
                  onDoubleClick={() => handlePageDoubleClick(page)}
                  className={`rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                    selectedPages.has(page.number)
                      ? 'border-primary-container bg-primary-container/5 shadow-md'
                      : 'border-outline-variant/40 hover:border-outline-variant'
                  }`}
                >
                  <img src={page.dataUrl} alt={`Page ${page.number}`} className="w-full" />
                  <div className={`text-center py-1.5 text-xs font-bold ${
                    selectedPages.has(page.number) ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {page.number}
                  </div>
                  <div className="text-center pb-1 text-[10px] text-on-surface-variant opacity-70">
                    Double click to view
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pptxPages.length > 0 && !processing && (
          <div>
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-h3 text-h3 text-primary-container">Select Slides for this Topic</h3>
              <button onClick={selectAll} className="text-sm text-primary font-button hover:underline">
                {selectedPages.size === pptxPages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex items-center gap-2 mb-stack-sm text-xs text-on-surface-variant">
              <span>{selectedPages.size} of {pptxPages.length} slides selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-2">
              {pptxPages.map(slide => (
                <div
                  key={slide.number}
                  onClick={() => handlePageClick(slide.number)}
                  onDoubleClick={() => handlePageDoubleClick(slide)}
                  className={`rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                    selectedPages.has(slide.number)
                      ? 'border-primary-container bg-primary-container/5 shadow-md'
                      : 'border-outline-variant/40 hover:border-outline-variant'
                  }`}
                >
                  <div className="bg-white">
                    <PptxSlideThumbnail slideIndex={slide.number - 1} presentation={pptxPresentationRef.current} />
                  </div>
                  <div className={`text-center py-1.5 text-xs font-bold ${
                    selectedPages.has(slide.number) ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    Slide {slide.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {docxHtml && !processing && (
          <div>
            <h3 className="font-h3 text-h3 text-primary-container mb-stack-md">Document Preview</h3>
            <div className="prose max-w-none border border-outline-variant/30 rounded-xl p-stack-md max-h-[500px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: docxHtml }} />
            <p className="text-xs text-on-surface-variant mt-stack-sm">Entire document shown. Save to attach to topic.</p>
          </div>
        )}

        {file && !processing && pdfPages.length === 0 && pptxPages.length === 0 && !docxHtml && (
          <div className="text-center py-8 border border-dashed border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">visibility</span>
            <p className="font-body-md text-on-surface-variant">Preview not available for this format</p>
            <p className="text-xs text-on-surface-variant mt-1">Save to attach file without page selection</p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-stack-lg pt-stack-md border-t border-outline-variant/30">
          <Link to={`/courses/${courseId}/topics/new`} className="flex-1 px-6 py-3 border border-outline text-on-surface-variant rounded-xl font-button text-button text-center hover:bg-surface-container-low transition-colors">
            Back
          </Link>
          <button onClick={handleSubmit} disabled={!topicData.name || submitting} className="flex-1 px-6 py-3 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Saving...' : 'Save Topic'}
          </button>
        </div>
      </div>

      {success && (
        <div className="mt-stack-md p-4 bg-secondary-container/20 border border-secondary-container/30 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">check_circle</span>
          <p className="font-body-md">Topic and materials saved! Redirecting...</p>
        </div>
      )}

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
              {fileType === 'pptx' && pptxPresentationRef.current ? (
                <div className="w-full max-w-3xl bg-white shadow-lg">
                  <PptxSlidePreview slideIndex={previewPage.number - 1} presentation={pptxPresentationRef.current} />
                </div>
              ) : previewLoading && !previewHiResUrl ? (
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
