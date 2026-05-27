import { invoke } from '@tauri-apps/api/core'
import { listen, UnlistenFn } from '@tauri-apps/api/event'

export interface AudioDevice {
  id: string
  name: string
}

export interface Session {
  id: string
  module_id: string | null
  topic: string
  title: string
  created_at: string
  duration: number
  language: string
  model: string
}

export interface Segment {
  id: string
  session_id: string
  text: string
  t_start: number
  t_end: number
  speaker: string
}

export interface LectureNote {
  id: string
  session_id: string | null
  module_id: string | null
  title: string
  content_json: string
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  module_id: string
  filename: string
  file_path: string
  page_count: number
  indexed: boolean
  uploaded_at: string
}

export interface TranscriptEvent {
  text: string
  timestamp: string
  speaker: string
}

export interface RecordingStatusEvent {
  state: string
  duration: number
}

export interface NoteBlockEvent {
  block: any
}

export interface SidecarHealth {
  status: string
  whisper_ready: boolean
  llm_ready: boolean
  llm_backend: string
  llm_loaded: string | null
  gpu: string
}

// Audio
export const getAudioDevices = () => invoke<AudioDevice[]>('get_audio_devices')

// Recording
export const startRecording = (deviceId: string, language: string, model: string, moduleId: string, topic: string) =>
  invoke<string>('start_recording', { deviceId, language, model, moduleId, topic })

export const stopRecording = () => invoke<void>('stop_recording')
export const pauseRecording = () => invoke<void>('pause_recording')

// Sessions
export const getSessions = (moduleId?: string) => invoke<Session[]>('get_sessions', { moduleId })
export const getSessionTranscript = (sessionId: string) => invoke<Segment[]>('get_session_transcript', { sessionId })
export const deleteSession = (sessionId: string) => invoke<void>('delete_session', { sessionId })
export const exportTranscript = (sessionId: string, format: string) => invoke<string>('export_transcript', { sessionId, format })

// Materials
export const uploadMaterial = (moduleId: string, filePath: string) => invoke<Material>('upload_material', { moduleId, filePath })
export const listMaterials = (moduleId: string) => invoke<Material[]>('list_materials', { moduleId })
export const deleteMaterial = (materialId: string) => invoke<void>('delete_material', { materialId })

// Notes
export const listNotes = (moduleId: string) => invoke<LectureNote[]>('list_notes', { moduleId })
export const getNote = (noteId: string) => invoke<LectureNote>('get_note', { noteId })
export const saveNote = (noteId: string, contentJson: string, title: string) => invoke<void>('save_note', { noteId, contentJson, title })
export const generateNote = (sessionId: string, moduleId: string) => invoke<LectureNote>('generate_note', { sessionId, moduleId })

// Settings
export const setLlmBackend = (backend: string, apiKey?: string) => invoke<void>('set_llm_backend', { backend, apiKey })
export const downloadModel = (modelType: 'whisper' | 'llm', modelName: string) =>
  invoke<void>('download_model', { modelType, modelName })
export const getSidecarHealth = () => invoke<SidecarHealth>('get_sidecar_health')
export const getServerPort = () => invoke<number>('get_server_port')
export const getSidecarPort = () => invoke<number>('get_sidecar_port')

// Events
export const onTranscriptPartial = (cb: (e: TranscriptEvent) => void): Promise<UnlistenFn> =>
  listen<TranscriptEvent>('transcript-partial', (e) => cb(e.payload))

export const onTranscriptFinal = (cb: (e: TranscriptEvent) => void): Promise<UnlistenFn> =>
  listen<TranscriptEvent>('transcript-final', (e) => cb(e.payload))

export const onRecordingStatus = (cb: (e: RecordingStatusEvent) => void): Promise<UnlistenFn> =>
  listen<RecordingStatusEvent>('recording-status', (e) => cb(e.payload))

export const onNoteBlock = (cb: (e: NoteBlockEvent) => void): Promise<UnlistenFn> =>
  listen<NoteBlockEvent>('note-block', (e) => cb(e.payload))

export const onSidecarError = (cb: (e: { message: string }) => void): Promise<UnlistenFn> =>
  listen<{ message: string }>('sidecar-error', (e) => cb(e.payload))

export const onModelDownloadProgress = (cb: (e: { model: string; percent: number }) => void): Promise<UnlistenFn> =>
  listen<{ model: string; percent: number }>('model-download-progress', (e) => cb(e.payload))

export const onMaterialIngestProgress = (cb: (e: { material_id: string; percent: number; pages_indexed: number }) => void): Promise<UnlistenFn> =>
  listen<{ material_id: string; percent: number; pages_indexed: number }>('material-ingest-progress', (e) => cb(e.payload))
