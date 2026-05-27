import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  startRecording,
  stopRecording,
  pauseRecording,
  onTranscriptFinal,
  onTranscriptPartial,
  onNoteBlock,
  generateNote,
  saveNote as saveNoteCmd,
} from '../services/tauri-api'

interface TranscriptSegment {
  text: string
  timestamp: string
  speaker: string
  time: string
}

interface NoteBlock {
  id: string
  type: string
  props?: any
  content?: any[]
}

export default function LiveLectureRecording() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const courseId = params.get('courseId') || ''
  const moduleId = params.get('moduleId') || ''
  const topic = params.get('topic') || 'Untitled Lecture'

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [noteBlocks, setNoteBlocks] = useState<NoteBlock[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const transcriptRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  useEffect(() => {
    const start = async () => {
      try {
        const sid = await startRecording('default', 'en', 'distil-large-v3', moduleId, topic)
        setSessionId(sid)
        setIsRecording(true)
        timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
      } catch (err) {
        console.error('Failed to start recording:', err)
      }
    }
    start()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [moduleId, topic])

  useEffect(() => {
    const unsubs: Array<() => void> = []

    onTranscriptFinal((e) => {
      const mins = Math.floor(elapsed / 60)
      const secs = elapsed % 60
      setSegments((prev) => [
        ...prev,
        {
          ...e,
          time: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:00`,
        },
      ])
      if (transcriptRef.current) {
        setTimeout(() => {
          transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
        }, 100)
      }
    }).then((u) => unsubs.push(u))

    onTranscriptPartial(() => {}).then((u) => unsubs.push(u))

    onNoteBlock((e) => {
      setNoteBlocks((prev) => [...prev, e.block])
    }).then((u) => unsubs.push(u))

    return () => unsubs.forEach((u) => u())
  }, [elapsed])

  const handlePause = async () => {
    await pauseRecording()
    setIsPaused(!isPaused)
    if (isPaused) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleStop = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    await stopRecording()
    setIsRecording(false)

    if (sessionId) {
      setIsGenerating(true)
      try {
        const note = await generateNote(sessionId, moduleId)
        if (note.content_json) {
          try {
            const blocks = JSON.parse(note.content_json)
            setNoteBlocks(blocks)
          } catch { /* keep existing blocks */ }
        }
      } catch (err) {
        console.error('Note generation failed:', err)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const handleSave = async () => {
    if (!sessionId) return
    try {
      await saveNoteCmd(sessionId, JSON.stringify(noteBlocks), topic)
      setIsSaved(true)
      setTimeout(() => navigate(`/courses/${courseId}`), 1500)
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const renderBlock = useCallback((block: NoteBlock, idx: number) => {
    const text = block.content?.map((c: any) => c.text || '').join('') || ''

    switch (block.type) {
      case 'heading': {
        const level = block.props?.level || 2
        if (level === 1) return <h1 key={idx} className="font-h1 text-h1 text-primary mb-2">{text}</h1>
        if (level === 2) return <h2 key={idx} className="font-h2 text-h2 text-primary mt-6 mb-2">{text}</h2>
        return <h3 key={idx} className="font-h3 text-h3 text-primary mt-4 mb-2">{text}</h3>
      }
      case 'paragraph':
        return <p key={idx} className="font-body-md text-on-surface mb-3 leading-relaxed">{text}</p>
      case 'bulletListItem':
        return (
          <div key={idx} className="flex gap-2 mb-2 ml-4">
            <span className="text-primary mt-1.5 text-xs">&#x2022;</span>
            <p className="font-body-md text-on-surface flex-1"><strong>Holding:</strong> {text}</p>
          </div>
        )
      case 'numberedListItem':
        return (
          <div key={idx} className="flex gap-2 mb-2 ml-4">
            <span className="text-primary font-bold text-sm mt-0.5">{idx + 1}.</span>
            <p className="font-body-md text-on-surface flex-1">{text}</p>
          </div>
        )
      case 'keyConcept':
        return (
          <div key={idx} className="my-4 border-l-4 border-secondary-container bg-secondary-container/10 rounded-r-lg p-4">
            <p className="font-body-md text-on-surface italic leading-relaxed">
              <span className="font-bold text-secondary">Key Concept: </span>
              {block.props?.title || ''} {text}
            </p>
          </div>
        )
      case 'qaBlock': {
        const question = block.props?.question || ''
        const confidence = block.props?.confidence || 'HIGH'
        const citation = block.props?.citation || ''
        const isHigh = confidence === 'HIGH'
        return (
          <div key={idx} className="my-4 bg-primary rounded-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-label-caps text-label-caps text-secondary-container">DIRECT QUESTION</span>
              <span className="text-xs text-white/50">{formatTime(elapsed)}</span>
            </div>
            <p className="font-h3 text-h3 italic mb-3">{question}</p>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">FAQ</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isHigh ? 'bg-secondary-container text-on-secondary-container' : 'bg-white/20 text-white/70'
              }`}>
                {isHigh ? 'HIGH CONFIDENCE' : 'LOW CONF'}
              </span>
            </div>
            <p className="font-body-md text-white/90 leading-relaxed mb-3">{text}</p>
            {citation && (
              <p className="text-xs text-secondary-container/80 italic">
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">menu_book</span>
                {citation}
              </p>
            )}
          </div>
        )
      }
      default:
        return <p key={idx} className="font-body-md text-on-surface mb-3">{text}</p>
    }
  }, [elapsed])

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-primary text-white">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>REVISION CENTER</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>LIVE RECORDING</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 pb-3">
          <div>
            <h1 className="font-h2 text-h2 text-white">{topic}</h1>
            <p className="text-sm text-white/60">LAW 401 · Prof. Carter</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
              <span className="font-h3 text-white tabular-nums">{formatTime(elapsed)}</span>
              <span className="text-xs text-white/50 uppercase">Recording</span>
            </div>
            {/* Audio Level Indicator */}
            <div className="flex items-center gap-0.5 h-5">
              {[3, 5, 7, 4, 6, 3, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-secondary-container rounded-full transition-all"
                  style={{ height: isRecording && !isPaused ? `${h * 2 + Math.random() * 6}px` : '3px' }}
                />
              ))}
            </div>
            {/* Controls */}
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 rounded text-sm font-button hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">{isPaused ? 'play_arrow' : 'pause'}</span>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-2 bg-error/80 rounded text-sm font-button hover:bg-error transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">stop</span>
              Stop
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white/10 rounded text-sm font-button hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Two-pane content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane — Live Transcript */}
        <div className="w-1/2 border-r border-outline-variant flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">LIVE TRANSCRIPT</h3>
            <span className="text-xs text-on-surface-variant">{segments.length} SEGMENTS</span>
          </div>
          <div ref={transcriptRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-surface-container-lowest">
            {segments.map((seg, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    seg.speaker === 'PROFESSOR'
                      ? 'bg-primary text-white'
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {seg.speaker}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">{seg.time}</span>
                </div>
                <p className="font-body-md text-on-surface leading-relaxed pl-1">{seg.text}</p>
              </div>
            ))}
            {isRecording && (
              <div className="flex items-center gap-2 text-on-surface-variant italic text-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                This is being transcribed in real time...
              </div>
            )}
          </div>
        </div>

        {/* Right Pane — Structured Notes */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container-lowest">
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">STRUCTURED NOTES</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">Q&A EMBEDDED</span>
              <span className="text-xs px-2 py-0.5 bg-error/10 text-error rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
            {noteBlocks.length > 0 ? (
              <>
                {noteBlocks.map((block, idx) => renderBlock(block, idx))}
              </>
            ) : isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
                <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                <p className="font-body-md">Generating structured notes...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">notes</span>
                <p className="font-body-md">AI notes will appear here as the lecture progresses</p>
              </div>
            )}

            {/* Save Button (after stopping) */}
            {!isRecording && sessionId && noteBlocks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-outline-variant">
                <button
                  onClick={handleSave}
                  disabled={isSaved}
                  className="w-full py-3 bg-secondary-container text-on-secondary-container rounded font-button text-button flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {isSaved ? 'Lecture Note Saved!' : 'Save Lecture Note'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-primary text-white text-[10px] tracking-widest font-label-caps">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            CONNECTED
          </div>
          <span>LATENCY: 24MS</span>
        </div>
        <div className="flex items-center gap-6">
          <span>AI MODEL: LEXGPT-V4.2</span>
          <span>&copy; 2026 LEXSCHOLAR LEGAL RESEARCH</span>
        </div>
      </div>
    </div>
  )
}
