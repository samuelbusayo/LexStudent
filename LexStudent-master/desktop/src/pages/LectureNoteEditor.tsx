import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNote, saveNote } from '../services/tauri-api'
import type { LectureNote } from '../services/tauri-api'

export default function LectureNoteEditor() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState<LectureNote | null>(null)
  const [blocks, setBlocks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!noteId) return
    getNote(noteId).then((n) => {
      setNote(n)
      setTitle(n.title)
      try {
        setBlocks(JSON.parse(n.content_json))
      } catch {
        setBlocks([])
      }
    })
  }, [noteId])

  const debouncedSave = useCallback(
    (newBlocks: any[], newTitle: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(async () => {
        if (!noteId) return
        setSaving(true)
        try {
          await saveNote(noteId, JSON.stringify(newBlocks), newTitle)
          setLastSaved(new Date().toLocaleTimeString())
        } catch (err) {
          console.error('Autosave failed:', err)
        } finally {
          setSaving(false)
        }
      }, 1500)
    },
    [noteId]
  )

  const updateBlock = (idx: number, field: string, value: string) => {
    const updated = [...blocks]
    if (field === 'text' && updated[idx].content?.[0]) {
      updated[idx] = {
        ...updated[idx],
        content: [{ ...updated[idx].content[0], text: value }],
      }
    }
    setBlocks(updated)
    debouncedSave(updated, title)
  }

  const addBlock = (type: string) => {
    const id = `blk_${Date.now()}`
    let newBlock: any = { id, type, content: [{ type: 'text', text: '' }] }
    if (type === 'heading') newBlock.props = { level: 2 }
    if (type === 'keyConcept') newBlock.props = { title: 'Key Concept' }
    if (type === 'qaBlock') newBlock.props = { question: '', confidence: 'HIGH', citation: '' }
    const updated = [...blocks, newBlock]
    setBlocks(updated)
    debouncedSave(updated, title)
  }

  const deleteBlock = (idx: number) => {
    const updated = blocks.filter((_, i) => i !== idx)
    setBlocks(updated)
    debouncedSave(updated, title)
  }

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= blocks.length) return
    const updated = [...blocks]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setBlocks(updated)
    debouncedSave(updated, title)
  }

  const renderEditableBlock = (block: any, idx: number) => {
    const text = block.content?.[0]?.text || ''

    return (
      <div key={idx} className="group relative flex gap-2 mb-2 hover:bg-surface-container-low/50 rounded-lg transition-colors">
        {/* Drag handle + controls */}
        <div className="w-8 flex flex-col items-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => moveBlock(idx, -1)} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined text-[14px]">expand_less</span>
          </button>
          <span className="material-symbols-outlined text-on-surface-variant text-[14px] cursor-grab">drag_indicator</span>
          <button onClick={() => moveBlock(idx, 1)} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </div>

        {/* Block content */}
        <div className="flex-1 min-w-0">
          {block.type === 'heading' && (
            <input
              value={text}
              onChange={(e) => updateBlock(idx, 'text', e.target.value)}
              className={`w-full bg-transparent border-none outline-none text-primary ${
                block.props?.level === 1 ? 'font-h1 text-h1' : block.props?.level === 2 ? 'font-h2 text-h2' : 'font-h3 text-h3'
              }`}
              placeholder="Heading..."
            />
          )}
          {block.type === 'paragraph' && (
            <textarea
              value={text}
              onChange={(e) => updateBlock(idx, 'text', e.target.value)}
              className="w-full bg-transparent border-none outline-none font-body-md text-on-surface resize-none min-h-[24px]"
              placeholder="Type something..."
              rows={Math.max(1, text.split('\n').length)}
            />
          )}
          {block.type === 'bulletListItem' && (
            <div className="flex gap-2 items-start">
              <span className="text-primary mt-1">&#x2022;</span>
              <textarea
                value={text}
                onChange={(e) => updateBlock(idx, 'text', e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-body-md text-on-surface resize-none min-h-[24px]"
                placeholder="List item..."
                rows={1}
              />
            </div>
          )}
          {block.type === 'keyConcept' && (
            <div className="border-l-4 border-secondary-container bg-secondary-container/10 rounded-r-lg p-4">
              <textarea
                value={text}
                onChange={(e) => updateBlock(idx, 'text', e.target.value)}
                className="w-full bg-transparent border-none outline-none font-body-md text-on-surface italic resize-none min-h-[40px]"
                placeholder="Key concept..."
                rows={2}
              />
            </div>
          )}
          {block.type === 'qaBlock' && (
            <div className="bg-primary rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">FAQ</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  block.props?.confidence === 'HIGH' ? 'bg-secondary-container text-on-secondary-container' : 'bg-white/20 text-white/70'
                }`}>
                  {block.props?.confidence === 'HIGH' ? 'HIGH CONFIDENCE' : 'LOW CONF'}
                </span>
              </div>
              <input
                value={block.props?.question || ''}
                onChange={(e) => {
                  const updated = [...blocks]
                  updated[idx] = { ...updated[idx], props: { ...updated[idx].props, question: e.target.value } }
                  setBlocks(updated)
                  debouncedSave(updated, title)
                }}
                className="w-full bg-transparent border-none outline-none font-h3 text-white italic mb-2"
                placeholder="Question..."
              />
              <textarea
                value={text}
                onChange={(e) => updateBlock(idx, 'text', e.target.value)}
                className="w-full bg-transparent border-none outline-none font-body-md text-white/90 resize-none min-h-[40px]"
                placeholder="Answer..."
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={() => deleteBlock(idx)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-error p-1 self-start mt-2"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-on-surface-variant">Loading note...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                debouncedSave(blocks, e.target.value)
              }}
              className="font-h2 text-h2 text-primary bg-transparent border-none outline-none w-full"
              placeholder="Note title..."
            />
            <p className="text-xs text-on-surface-variant">
              {note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}
              {lastSaved && ` · Last saved ${lastSaved}`}
              {saving && ' · Saving...'}
            </p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-xl border border-outline-variant/30 p-6 min-h-[60vh]">
        {blocks.map((block, idx) => renderEditableBlock(block, idx))}

        {/* Add block buttons (slash menu) */}
        <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-wrap gap-2">
          <button onClick={() => addBlock('heading')} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded text-xs font-button text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[14px]">title</span>
            Heading
          </button>
          <button onClick={() => addBlock('paragraph')} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded text-xs font-button text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[14px]">notes</span>
            Paragraph
          </button>
          <button onClick={() => addBlock('bulletListItem')} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded text-xs font-button text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
            Bullet
          </button>
          <button onClick={() => addBlock('keyConcept')} className="flex items-center gap-1 px-3 py-1.5 bg-secondary-container/30 rounded text-xs font-button text-secondary hover:bg-secondary-container/50 transition-colors">
            <span className="material-symbols-outlined text-[14px]">lightbulb</span>
            Key Concept
          </button>
          <button onClick={() => addBlock('qaBlock')} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded text-xs font-button text-primary hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[14px]">help</span>
            Q&A Block
          </button>
        </div>
      </div>
    </div>
  )
}
