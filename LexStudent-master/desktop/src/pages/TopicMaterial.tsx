import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCourse, useTopics, useUpdateMaterial, useDeleteMaterial } from '../hooks/useCourses'
import api from '../services/api'

export default function TopicMaterial() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>()
  const navigate = useNavigate()
  const { data: course } = useCourse(courseId!)
  const { data: topics, isLoading } = useTopics(courseId!)
  const updateMaterial = useUpdateMaterial()
  const deleteMaterial = useDeleteMaterial()

  const topic = topics?.find((t: any) => t.id === Number(topicId))
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setProcessing(false)
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

      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
      await updateMaterial.mutateAsync({
        courseId: courseId!,
        topicId: topicId!,
        data: {
          materialFile: file.name,
          materialType: ext,
          hasMaterials: true,
        },
      })
      setMessage({ type: 'success', text: 'Material saved successfully!' })
      setTimeout(() => navigate(`/courses/${courseId}`), 1200)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save material' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!topic) return
    setSaving(true)
    try {
      await deleteMaterial.mutateAsync({ courseId: courseId!, topicId: topicId! })
      setShowUploader(true)
      setFile(null)
      setMessage({ type: 'success', text: 'Material removed' })
    } catch {
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
            <p className="font-body-md text-body-md text-on-surface-variant">{course?.name} — Materials</p>
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

      {/* Upload area */}
      {(!topic.hasMaterials || showUploader) && !file && (
        <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <div
            className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center hover:border-primary-container transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">cloud_upload</span>
            <p className="font-body-lg text-on-surface-variant">Upload PDF file for this topic</p>
            <p className="text-xs text-on-surface-variant mt-2">PDF files will be indexed for AI-powered note generation</p>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={handleFileSelect} />
        </div>
      )}

      {/* File selected */}
      {file && (
        <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3 mb-stack-md">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">description</span>
              <div>
                <p className="font-body-md font-bold text-primary-container">{file.name}</p>
                <p className="text-xs text-on-surface-variant">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-error transition-colors" onClick={() => setFile(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-stack-lg pt-stack-md border-t border-outline-variant/30">
            <button onClick={() => setFile(null)}
              className="flex-1 px-6 py-3 border border-outline text-on-surface-variant rounded-xl font-button text-button hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 px-6 py-3 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Material'}
            </button>
          </div>
        </div>
      )}

      {/* Existing material */}
      {topic.hasMaterials && !showUploader && !file && (
        <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-h3 text-h3 text-primary-container">Current Material</h3>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Uploaded
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">picture_as_pdf</span>
            <p className="font-body-md font-bold text-primary-container">{topic.materialFile || 'material.pdf'}</p>
            <p className="text-xs text-on-surface-variant mt-1">{(topic.materialType || 'PDF').toUpperCase()}</p>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={handleFileSelect} />
    </div>
  )
}
