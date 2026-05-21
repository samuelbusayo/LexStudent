import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function AddTopic() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const handleNext = () => {
    navigate(`/courses/${courseId}/topics/new/materials`, {
      state: { name: name.trim(), file: selectedFile }
    })
  }

  return (
    <div>
      <div className="mb-stack-lg">
        <Link to={`/courses/${courseId}`} className="text-on-surface-variant font-body-md hover:text-primary-container transition-colors inline-flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Course
        </Link>
        <h1 className="font-h1 text-h1 text-primary-container">Add New Topic</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Create a new topic and upload supporting materials.</p>
      </div>

      <div className="max-w-2xl bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/30">
        <div className="space-y-stack-md">
          <div>
            <label className="font-label-caps text-label-caps text-primary-container block mb-unit">Topic Name <span className="text-error">*</span></label>
            <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body-md text-body-md focus:ring-2 focus:ring-primary" placeholder="e.g., Duty of Care" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="font-label-caps text-label-caps text-primary-container block mb-unit">Upload Materials</label>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:border-primary-container transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">cloud_upload</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Drag & drop files here or click to browse</p>
              <p className="text-xs text-on-surface-variant mt-1">{selectedFile ? selectedFile.name : 'Supports PDF, DOC, PPT'}</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx" />
            {selectedFile && (
              <div className="mt-stack-sm flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <span className="material-symbols-outlined text-primary-container">description</span>
                <span className="flex-1 font-body-md text-body-md truncate">{selectedFile.name}</span>
                <span className="text-xs text-on-surface-variant">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
                <button className="text-on-surface-variant hover:text-error transition-colors" onClick={() => setSelectedFile(null)}>
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-stack-lg pt-stack-md border-t border-outline-variant/30">
          <Link to={`/courses/${courseId}`} className="flex-1 px-6 py-3 border border-outline text-on-surface-variant rounded-xl font-button text-button text-center hover:bg-surface-container-low transition-colors">
            Cancel
          </Link>
          <button onClick={handleNext} disabled={!name.trim()} className="flex-1 px-6 py-3 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
            Next <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>


    </div>
  )
}
