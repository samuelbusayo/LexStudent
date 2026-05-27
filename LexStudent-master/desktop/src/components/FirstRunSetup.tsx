import { useState, useEffect } from 'react'
import {
  getSidecarHealth,
  downloadModel,
  setLlmBackend,
  onModelDownloadProgress,
} from '../services/tauri-api'

interface Props {
  onComplete: () => void
}

type Step = 'check' | 'whisper' | 'llm' | 'ready'

const WHISPER_MODELS = [
  { id: 'distil-large-v3', name: 'Distil Large V3', size: '~756 MB', desc: 'Best quality-to-speed ratio', recommended: true },
  { id: 'small', name: 'Whisper Small', size: '~461 MB', desc: 'Fastest, good accuracy' },
  { id: 'medium', name: 'Whisper Medium', size: '~1.5 GB', desc: 'High accuracy, slower' },
]

const LLM_MODELS = [
  { id: 'qwen2.5-3b', name: 'Qwen 2.5 3B', size: '~2.0 GB', desc: 'Best for structured notes', recommended: true },
  { id: 'phi-3.5-mini', name: 'Phi 3.5 Mini', size: '~2.3 GB', desc: 'Strong reasoning' },
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', size: '~2.0 GB', desc: 'Solid general-purpose' },
  { id: 'gemma-2-2b', name: 'Gemma 2 2B', size: '~1.8 GB', desc: 'Smallest and fastest' },
]

export default function FirstRunSetup({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('check')
  const [downloadPercent, setDownloadPercent] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadingType, setDownloadingType] = useState<'whisper' | 'llm' | null>(null)
  const [whisperDone, setWhisperDone] = useState(false)
  const [llmDone, setLlmDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onModelDownloadProgress((e) => {
      setDownloadPercent(e.percent)
      if (e.percent >= 100) {
        setDownloading(false)
        if (downloadingType === 'whisper') {
          setWhisperDone(true)
          setStep('llm')
        } else if (downloadingType === 'llm') {
          setLlmDone(true)
          setStep('ready')
        }
        setDownloadingType(null)
      }
    })
    return () => { unsub.then((u) => u()) }
  }, [downloadingType])

  useEffect(() => {
    getSidecarHealth()
      .then((health) => {
        if (health.whisper_ready && health.llm_ready) {
          setStep('ready')
        } else if (health.whisper_ready) {
          setWhisperDone(true)
          setStep('llm')
        } else {
          setStep('whisper')
        }
      })
      .catch(() => {
        setError('AI engine is starting up. Please wait...')
        setTimeout(() => { setError(''); setStep('whisper') }, 3000)
      })
  }, [])

  const handleDownload = async (type: 'whisper' | 'llm', modelId: string) => {
    setDownloading(true)
    setDownloadPercent(0)
    setDownloadingType(type)
    setError('')
    try {
      await downloadModel(type, modelId)
    } catch (err) {
      setError(`Download failed: ${err}. Check your internet connection.`)
      setDownloading(false)
      setDownloadingType(null)
    }
  }

  const handleSkipLLM = () => {
    setStep('ready')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-white rounded-xl border border-outline-variant/30 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-white">
          <h1 className="font-h2 text-h2">Welcome to LexScholar</h1>
          <p className="text-sm text-white/70 mt-1">Let's set up your AI-powered study environment. No other apps needed.</p>
        </div>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {(['whisper', 'llm', 'ready'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s ? 'bg-secondary-container text-on-secondary-container' :
                  (['whisper', 'llm', 'ready'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                  'bg-surface-container text-on-surface-variant'
                }`}>
                  {(['whisper', 'llm', 'ready'].indexOf(step) > i) ? '✓' : i + 1}
                </div>
                {i < 2 && <div className="w-12 h-0.5 bg-surface-container" />}
              </div>
            ))}
            <div className="ml-auto text-xs text-on-surface-variant">
              {step === 'whisper' && 'Transcription'}
              {step === 'llm' && 'Note Generation'}
              {step === 'ready' && 'Complete'}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container rounded text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          {step === 'check' && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-on-surface-variant">Checking AI engine status...</p>
            </div>
          )}

          {/* ─── STEP 1: WHISPER MODEL ─── */}
          {step === 'whisper' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-h3 text-h3 text-primary">Step 1: Transcription Model</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  This model converts your lecture audio into text. Runs entirely on your machine.
                </p>
              </div>

              {downloading && downloadingType === 'whisper' ? (
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Downloading transcription model...</span>
                    <span className="font-bold text-secondary">{downloadPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-500 rounded-full" style={{ width: `${downloadPercent}%` }} />
                  </div>
                  <p className="text-xs text-on-surface-variant">This may take a few minutes depending on your connection.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {WHISPER_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleDownload('whisper', model.id)}
                      className={`w-full p-4 border rounded-lg text-left hover:bg-secondary/5 transition-colors ${
                        model.recommended ? 'border-secondary/30' : 'border-outline-variant/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-body-md text-on-surface font-medium">
                          {model.name}
                          {model.recommended && <span className="ml-2 text-xs text-secondary font-bold">RECOMMENDED</span>}
                        </p>
                        <span className="text-xs font-bold text-on-surface-variant">{model.size}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{model.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 2: LLM MODEL ─── */}
          {step === 'llm' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-h3 text-h3 text-primary">Step 2: Note Generation Model</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  This model generates structured lecture notes from your transcripts. Runs locally — your data never leaves your machine.
                </p>
              </div>

              {downloading && downloadingType === 'llm' ? (
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Downloading notes model...</span>
                    <span className="font-bold text-secondary">{downloadPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-500 rounded-full" style={{ width: `${downloadPercent}%` }} />
                  </div>
                  <p className="text-xs text-on-surface-variant">This may take a few minutes depending on your connection.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {LLM_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleDownload('llm', model.id)}
                        className={`w-full p-4 border rounded-lg text-left hover:bg-secondary/5 transition-colors ${
                          model.recommended ? 'border-secondary/30' : 'border-outline-variant/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-body-md text-on-surface font-medium">
                            {model.name}
                            {model.recommended && <span className="ml-2 text-xs text-secondary font-bold">RECOMMENDED</span>}
                          </p>
                          <span className="text-xs font-bold text-on-surface-variant">{model.size}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">{model.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Cloud alternative */}
                  <div className="pt-3 border-t border-outline-variant/20">
                    <p className="text-xs text-on-surface-variant mb-2">Or use a cloud API instead (requires internet + API key):</p>
                    <button
                      onClick={handleSkipLLM}
                      className="w-full p-3 border border-outline-variant/30 rounded-lg text-left hover:bg-surface-container-low transition-colors"
                    >
                      <p className="font-body-md text-on-surface-variant font-medium">Skip — I'll configure a cloud API later</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Set up Anthropic or OpenAI in Settings</p>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── STEP 3: READY ─── */}
          {step === 'ready' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary">All Set!</h3>
              <p className="text-sm text-on-surface-variant">
                Your AI study environment is configured. Everything runs locally on your machine.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-green-500 text-[14px]">check</span>
                  Transcription {whisperDone ? 'ready' : 'skipped'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-green-500 text-[14px]">check</span>
                  Notes {llmDone ? 'ready' : '(configure in Settings)'}
                </span>
              </div>
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded font-button hover:brightness-110 transition-all"
              >
                Start Using LexScholar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
