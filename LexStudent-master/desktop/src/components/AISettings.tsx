import { useState, useEffect } from 'react'
import {
  getSidecarHealth,
  downloadModel,
  setLlmBackend,
  onModelDownloadProgress,
} from '../services/tauri-api'
import type { SidecarHealth } from '../services/tauri-api'

const WHISPER_MODELS = [
  { id: 'distil-large-v3', name: 'Distil Large V3', size: '~756 MB', desc: 'Best quality-to-speed' },
  { id: 'small', name: 'Whisper Small', size: '~461 MB', desc: 'Fastest' },
  { id: 'medium', name: 'Whisper Medium', size: '~1.5 GB', desc: 'Highest accuracy' },
]

const LLM_MODELS = [
  { id: 'qwen2.5-3b', name: 'Qwen 2.5 3B', size: '~2.0 GB', desc: 'Best for structured notes' },
  { id: 'phi-3.5-mini', name: 'Phi 3.5 Mini', size: '~2.3 GB', desc: 'Strong reasoning' },
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', size: '~2.0 GB', desc: 'General-purpose' },
  { id: 'gemma-2-2b', name: 'Gemma 2 2B', size: '~1.8 GB', desc: 'Smallest' },
]

export default function AISettings() {
  const [health, setHealth] = useState<SidecarHealth | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadType, setDownloadType] = useState<string | null>(null)
  const [downloadPercent, setDownloadPercent] = useState(0)
  const [backend, setBackend] = useState('local')
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    checkHealth()
    const unsub = onModelDownloadProgress((e) => {
      setDownloadPercent(e.percent)
      if (e.percent >= 100) {
        setDownloading(false)
        setDownloadType(null)
        checkHealth()
      }
    })
    return () => { unsub.then((u) => u()) }
  }, [])

  const checkHealth = () => {
    getSidecarHealth().then(setHealth).catch(() => setHealth(null))
  }

  const handleDownload = async (type: 'whisper' | 'llm', modelId: string) => {
    setDownloading(true)
    setDownloadType(`${type}:${modelId}`)
    setDownloadPercent(0)
    try {
      await downloadModel(type, modelId)
    } catch {
      setDownloading(false)
      setDownloadType(null)
    }
  }

  const handleSaveBackend = async () => {
    try {
      await setLlmBackend(backend, apiKey || undefined)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      checkHealth()
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-h1 text-h1 text-primary-container">AI Settings</h1>
        <p className="font-body-md text-on-surface-variant">Manage your local AI models. Everything runs on your machine.</p>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        health?.status === 'ok' ? 'bg-green-50 border-green-200' : 'bg-surface-container border-outline-variant/30'
      }`}>
        <div className={`w-3 h-3 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-outline-variant'}`} />
        <div className="flex-1">
          <p className="text-sm font-bold">{health?.status === 'ok' ? 'AI Engine Running' : 'AI Engine Offline'}</p>
          <p className="text-xs text-on-surface-variant">
            {health?.gpu && health.gpu !== 'none' ? `GPU: ${health.gpu}` : 'Running on CPU'}
            {health?.llm_loaded && ` · LLM loaded: ${health.llm_loaded}`}
          </p>
        </div>
        <button onClick={checkHealth} className="text-xs text-primary font-button hover:underline">Refresh</button>
      </div>

      {/* Transcription Model Section */}
      <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-secondary">mic</span>
          <h2 className="font-h3 text-h3 text-primary">Transcription Model</h2>
          {health?.whisper_ready && (
            <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">READY</span>
          )}
        </div>
        <p className="text-sm text-on-surface-variant mb-4">Converts lecture audio to text. Choose based on your machine's specs.</p>

        <div className="space-y-2">
          {WHISPER_MODELS.map((model) => {
            const isDownloading = downloadType === `whisper:${model.id}`
            return (
              <div key={model.id} className="flex items-center justify-between p-3 border border-outline-variant/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-on-surface">{model.name}</p>
                  <p className="text-xs text-on-surface-variant">{model.desc} · {model.size}</p>
                </div>
                {isDownloading ? (
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary transition-all" style={{ width: `${downloadPercent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-secondary">{downloadPercent}%</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload('whisper', model.id)}
                    disabled={downloading}
                    className="px-3 py-1.5 text-xs font-button bg-secondary-container/20 text-secondary rounded-lg hover:bg-secondary-container/40 disabled:opacity-50 transition-colors"
                  >
                    Download
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Notes Generation Model Section */}
      <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-secondary">auto_awesome</span>
          <h2 className="font-h3 text-h3 text-primary">Note Generation Model</h2>
          {health?.llm_ready && (
            <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">READY</span>
          )}
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          Generates structured lecture notes from transcripts. Displayed as <strong className="text-secondary">LexGPT-V4.2</strong> in the UI.
        </p>

        {/* Backend selector */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'local', label: 'Local (Private)', icon: 'computer' },
            { id: 'anthropic', label: 'Anthropic', icon: 'cloud' },
            { id: 'openai', label: 'OpenAI', icon: 'cloud' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setBackend(b.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-button transition-colors ${
                backend === b.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{b.icon}</span>
              {b.label}
            </button>
          ))}
        </div>

        {backend === 'local' && (
          <div className="space-y-2">
            {LLM_MODELS.map((model) => {
              const isDownloading = downloadType === `llm:${model.id}`
              return (
                <div key={model.id} className="flex items-center justify-between p-3 border border-outline-variant/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{model.name}</p>
                    <p className="text-xs text-on-surface-variant">{model.desc} · {model.size}</p>
                  </div>
                  {isDownloading ? (
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary transition-all" style={{ width: `${downloadPercent}%` }} />
                      </div>
                      <span className="text-xs font-bold text-secondary">{downloadPercent}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload('llm', model.id)}
                      disabled={downloading}
                      className="px-3 py-1.5 text-xs font-button bg-secondary-container/20 text-secondary rounded-lg hover:bg-secondary-container/40 disabled:opacity-50 transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {(backend === 'anthropic' || backend === 'openai') && (
          <div className="space-y-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter ${backend === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key...`}
              className="w-full px-4 py-2.5 border border-outline-variant rounded-lg bg-surface-container-low font-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <p className="text-xs text-on-surface-variant">
              {backend === 'anthropic' ? 'Uses Claude Sonnet. ~$0.003 per note.' : 'Uses GPT-4o-mini. ~$0.001 per note.'}
            </p>
          </div>
        )}

        <button
          onClick={handleSaveBackend}
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-lg font-button text-sm hover:brightness-110 transition-all"
        >
          {saved ? '✓ Saved' : 'Save Configuration'}
        </button>
      </section>

      {/* Embedding Model (auto-managed) */}
      <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-secondary">data_array</span>
          <h2 className="font-h3 text-h3 text-primary">Embedding Model</h2>
          <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">AUTO</span>
        </div>
        <p className="text-sm text-on-surface-variant">
          <strong>BAAI/bge-small-en-v1.5</strong> (~130 MB) — Downloads automatically on first use. Powers the RAG retrieval for citation accuracy.
        </p>
      </section>
    </div>
  )
}
