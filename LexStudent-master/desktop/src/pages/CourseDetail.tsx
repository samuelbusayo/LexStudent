import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import { listNotes } from '../services/tauri-api'
import type { LectureNote } from '../services/tauri-api'
import NewLectureRecordingModal from '../components/recording/NewLectureRecordingModal'
import MaterialsManager from '../components/MaterialsManager'

interface ModuleData {
  id: string
  name: string
  orderIndex: number
  progress: number
  locked?: boolean
  notes: LectureNote[]
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const { data: course, isLoading } = useCourse(courseId!)
  const { data: topics } = useTopics(courseId!)
  const [modules, setModules] = useState<ModuleData[]>([])
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [materialsModule, setMaterialsModule] = useState<{ id: string; name: string } | null>(null)
  const [notesView, setNotesView] = useState<string | null>(null)

  useEffect(() => {
    if (!topics) return
    const mods: ModuleData[] = (topics || []).map((t: any, i: number) => ({
      id: t.id?.toString() || `mod_${i}`,
      name: t.name || `Module ${i + 1}`,
      orderIndex: i,
      progress: (() => {
        const studied = t.studiedPages || (t.selectedPages?.length > 0 ? t.selectedPages.length : (t.totalPages || 0));
        return studied > 0 ? Math.round((Math.min(t.pagesRead || 0, studied) / studied) * 100) : 0;
      })(),
      locked: false,
      notes: [],
    }))
    setModules(mods)

    mods.forEach(async (mod) => {
      try {
        const notes = await listNotes(mod.id)
        setModules((prev) =>
          prev.map((m) => (m.id === mod.id ? { ...m, notes } : m))
        )
      } catch { /* sidecar may not be running */ }
    })
  }, [topics])

  if (isLoading) {
    return <div className="font-body-md text-on-surface-variant">Loading course...</div>
  }

  const totalProgress = modules.length > 0
    ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
    : 0

  return (
    <div>
      {/* Course Header */}
      <div className="relative bg-gradient-to-r from-primary via-primary-container to-primary rounded-xl p-6 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <span className="material-symbols-outlined text-[180px]">school</span>
        </div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full mb-3 tracking-widest">
              CORE MODULE
            </span>
            <h1 className="font-h1 text-h1 text-white mb-2">{course?.name || 'Course'}</h1>
            <p className="font-body-md text-white/70 max-w-xl">{course?.description}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" fill="none" r="34" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                <circle cx="40" cy="40" fill="none" r="34" stroke="#fed65b" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - totalProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-h2 text-white">{totalProgress}%</span>
            </div>
            <span className="text-xs text-white/60 mt-1">Completed</span>
          </div>
        </div>
      </div>

      {/* Curriculum Breakdown Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-h2 text-h2 text-primary">Curriculum Breakdown</h2>
          <p className="font-body-md text-on-surface-variant">Manage topics, track progress, and upload necessary case files.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-secondary text-secondary rounded font-button text-sm hover:bg-secondary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
            Record Live Lecture
          </button>
          <Link
            to={`/courses/${courseId}/topics/new`}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded font-button text-sm hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Topic
          </Link>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`bg-surface-container-lowest rounded-xl border p-5 transition-shadow ${
              mod.locked
                ? 'border-outline-variant/20 opacity-60'
                : 'border-secondary/30 hover:shadow-md'
            }`}
          >
            {/* Module Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
                  MODULE {mod.orderIndex + 1}
                </span>
                <h3 className="font-h3 text-h3 text-primary mt-1">{mod.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                {!mod.locked ? (
                  <>
                    <button
                      onClick={() => setNotesView(notesView === mod.id ? null : mod.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded text-xs font-button text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">notes</span>
                      Lecture Notes
                    </button>
                    <button
                      onClick={() => setMaterialsModule({ id: mod.id, name: mod.name })}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded text-xs font-button text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">folder</span>
                      Materials
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded text-xs font-button text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    Locked
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span className="font-medium">Progress</span>
                <span className="font-bold">{mod.progress}%</span>
              </div>
              <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-700"
                  style={{ width: `${mod.progress}%` }}
                />
              </div>
            </div>

            {/* Saved Lecture Notes */}
            {!mod.locked && (
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2">
                  SAVED LECTURE NOTES
                </p>
                {mod.notes.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic">No notes recorded yet</p>
                ) : (
                  <div className="space-y-1">
                    {mod.notes.map((note) => (
                      <Link
                        key={note.id}
                        to={`/notes/${note.id}`}
                        className="flex items-center gap-2 py-1.5 text-sm text-on-surface hover:text-primary transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                        <span className="group-hover:underline">{note.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recording Modal */}
      <NewLectureRecordingModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        modules={modules}
        courseId={courseId!}
      />

      {/* Materials Manager Modal */}
      {materialsModule && (
        <MaterialsManager
          moduleId={materialsModule.id}
          moduleName={materialsModule.name}
          onClose={() => setMaterialsModule(null)}
        />
      )}
    </div>
  )
}
