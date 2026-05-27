import { useState, useEffect, useCallback } from 'react'
import {
  listMaterials,
  uploadMaterial,
  deleteMaterial,
  onMaterialIngestProgress,
} from '../services/tauri-api'
import type { Material } from '../services/tauri-api'

interface Props {
  moduleId: string
  moduleName: string
  onClose: () => void
}

export default function MaterialsManager({ moduleId, moduleName, onClose }: Props) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [ingesting, setIngesting] = useState<Record<string, number>>({})
  const [isDragOver, setIsDragOver] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const mats = await listMaterials(moduleId)
      setMaterials(mats)
    } catch (err) {
      console.error('Failed to load materials:', err)
    } finally {
      setLoading(false)
    }
  }, [moduleId])

  useEffect(() => {
    refresh()
    const unsub = onMaterialIngestProgress((e) => {
      setIngesting((prev) => ({ ...prev, [e.material_id]: e.percent }))
      if (e.percent >= 100) {
        setTimeout(refresh, 500)
      }
    })
    return () => { unsub.then((u) => u()) }
  }, [refresh])

  const handleUpload = async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog')
      const selected = await open({
        multiple: false,
        filters: [{ name: 'PDF Documents', extensions: ['pdf'] }],
      })
      if (selected) {
        const filePath = typeof selected === 'string' ? selected : (selected as any).path
        if (filePath) {
          setIngesting((prev) => ({ ...prev, uploading: 0 }))
          await uploadMaterial(moduleId, filePath)
          refresh()
        }
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleDelete = async (materialId: string) => {
    try {
      await deleteMaterial(materialId)
      setMaterials((prev) => prev.filter((m) => m.id !== materialId))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-xl mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="font-h2 text-h2 text-primary">Materials</h2>
            <p className="text-sm text-on-surface-variant">{moduleName}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragOver ? 'border-secondary bg-secondary-container/10' : 'border-outline-variant hover:border-primary'
            }`}
            onClick={handleUpload}
          >
            <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">upload_file</span>
            <p className="font-body-md text-on-surface-variant">
              Drop PDF files here or <span className="text-primary font-bold">browse</span>
            </p>
            <p className="text-xs text-outline mt-1">PDF files only — materials will be indexed for AI note generation</p>
          </div>

          {/* Ingestion Progress */}
          {Object.entries(ingesting).filter(([_, v]) => v < 100).map(([id, percent]) => (
            <div key={id} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary animate-spin text-sm">progress_activity</span>
              <div className="flex-1">
                <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
              <span className="text-xs text-on-surface-variant">{percent}%</span>
            </div>
          ))}

          {/* Materials List */}
          {loading ? (
            <div className="text-center py-8 text-on-surface-variant">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading materials...
            </div>
          ) : materials.length === 0 ? (
            <p className="text-center py-8 text-on-surface-variant italic">No materials uploaded yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center justify-between p-3 bg-surface-container-lowest rounded border border-outline-variant/20 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-error text-xl">picture_as_pdf</span>
                    <div>
                      <p className="font-body-md text-on-surface text-sm font-medium">{mat.filename}</p>
                      <p className="text-xs text-on-surface-variant">
                        {mat.page_count} pages
                        {mat.indexed && (
                          <span className="ml-2 text-green-600 font-bold">
                            <span className="material-symbols-outlined text-[12px] align-middle">check_circle</span> Indexed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
