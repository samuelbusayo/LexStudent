import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Module {
  id: string
  name: string
  locked?: boolean
}

interface Props {
  open: boolean
  onClose: () => void
  modules: Module[]
  courseId: string
}

export default function NewLectureRecordingModal({ open, onClose, modules, courseId }: Props) {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [moduleId, setModuleId] = useState('')

  if (!open) return null

  const handleStart = () => {
    if (!topic.trim() || !moduleId) return
    navigate(`/recording?courseId=${courseId}&moduleId=${moduleId}&topic=${encodeURIComponent(topic)}`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-h2 text-h2 text-primary">New Lecture Recording</h2>
              <p className="font-body-md text-on-surface-variant mt-1">Ready to capture institutional knowledge?</p>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary transition-colors p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Audio Quality Banner */}
        <div className="mx-6 mt-4 rounded-lg overflow-hidden relative h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container to-primary" />
          <div className="absolute inset-0 flex items-center px-4 gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary-container text-2xl">mic</span>
            </div>
            <span className="text-secondary-container font-button text-sm tracking-wide">Audio Quality Optimized</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Topic Input */}
          <div>
            <label className="flex items-center gap-2 font-button text-sm text-secondary mb-2">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              Enter Lecture Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Analysis of Torts in Digital Commerce"
              className="w-full px-4 py-3 border border-outline-variant rounded bg-surface-container-low text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Module Selector */}
          <div>
            <label className="flex items-center gap-2 font-button text-sm text-secondary mb-2">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Select Module
            </label>
            <div className="relative">
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded bg-surface-container-low text-on-surface font-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="">Choose a module...</option>
                {modules.filter(m => !m.locked).map((mod) => (
                  <option key={mod.id} value={mod.id}>{mod.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!topic.trim() || !moduleId}
            className="w-full py-4 bg-primary text-on-primary rounded font-button text-button flex items-center justify-center gap-2 hover:brightness-110 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
            Start Recording
          </button>

          {/* Footer Note */}
          <p className="text-center font-label-caps text-label-caps text-on-surface-variant tracking-widest">
            RECORDING SESSION WILL BE TRANSCRIBED AUTOMATICALLY
          </p>
        </div>
      </div>
    </div>
  )
}
