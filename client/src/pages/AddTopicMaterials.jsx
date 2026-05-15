import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import api from '../services/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`

export default function AddTopicMaterials() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const topicData = location.state || {}
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [docxHtml, setDocxHtml] = useState('')
  const [pdfPages, setPdfPages] = useState([])
  const [selectedPages, setSelectedPages] = useState(new Set())
  const [processing, setProcessing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const ext = f.name.split('.').pop().toLowerCase()
    setFileType(ext)
    setPreviewUrl(URL.createObjectURL(f))
    setSelectedPages(new Set())
    setPdfPages([])
    setDocxHtml('')
    setProcessing(true)

    if (ext === 'pdf') {
      try {
        const arrayBuffer = await f.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const pages = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 0.5 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          await page.render({ canvasContext: ctx, viewport }).promise
          pages.push({ number: i, dataUrl: canvas.toDataURL() })
        }
        setPdfPages(pages)
      } catch (err) {
        console.error('PDF parse error', err)
      }
    } else if (ext === 'docx' || ext === 'doc') {
      try {
        const arrayBuffer = await f.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setDocxHtml(result.value)
      } catch (err) {
        console.error('DOCX parse error', err)
      }
    }
    setProcessing(false)
  }

  const togglePage = (pageNum) => {
    setSelectedPages(prev => {
      const next = new Set(prev)
      if (next.has(pageNum)) next.delete(pageNum)
      else next.add(pageNum)
      return next
    })
  }

  const selectAll = () => {
    const all = new Set(pdfPages.map(p => p.number))
    setSelectedPages(all === selectedPages ? new Set() : all)
  }

  const handleSubmit = async () => {
    if (!topicData.name || submitting) return
    setSubmitting(true)
    try {
      const payload = {
        name: topicData.name,
        subtitle: topicData.subtitle || '',
        totalPages: Number(topicData.totalPages) || 10,
        hasMaterials: !!file,
        materialFile: file ? file.name : null,
        materialType: fileType,
        selectedPages: Array.from(selectedPages).sort((a, b) => a - b),
        totalDocumentPages: pdfPages.length || 0,
      }
      await api.post(`/courses/${courseId}/topics`, payload)
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
            <p className="text-xs text-on-surface-variant mt-2">Supports .pdf, .docx, .doc</p>
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
            <button className="text-on-surface-variant hover:text-error transition-colors" onClick={() => { setFile(null); setPdfPages([]); setDocxHtml(''); setSelectedPages(new Set()) }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {processing && (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl animate-pulse mb-2">hourglass_top</span>
            <p>Processing document...</p>
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
                  onClick={() => togglePage(page.number)}
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

        {file && !processing && pdfPages.length === 0 && !docxHtml && (
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
    </div>
  )
}
