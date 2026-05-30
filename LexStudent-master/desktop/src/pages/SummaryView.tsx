import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export default function SummaryView() {
  const { topicId } = useParams<{ topicId: string }>()
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['topicSummary', topicId],
    queryFn: () => api.get(`/study-notes/${topicId}/summary`).then((r) => r.data),
  })

  const { data: feedData } = useQuery({
    queryKey: ['summaryFeed'],
    queryFn: () => api.get('/study-notes').then((r) => r.data),
    staleTime: 30000,
  })

  const topicInfo = ((feedData as any[]) || []).find((f: any) => String(f.topicId) === String(topicId))
  const topicName = topicInfo?.topicName || 'Topic Summary'
  const courseName = topicInfo?.courseName || ''

  const highlights: any[] = (data as any)?.highlights || []
  const summaryBody: string = (data as any)?.body || ''

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    } catch { return '' }
  }

  const handleHighlightClick = (highlight: any) => {
    const cId = courseId || topicInfo?.courseId
    if (!cId) return
    const url = `/courses/${cId}/topics/${topicId}/read?page=${highlight.page}${highlight.paragraph != null ? `&para=${highlight.paragraph}` : ''}`
    navigate(url, { state: { from: 'summary', topicId } })
  }

  if (isLoading) {
    return (
      <main className="px-5 py-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body-md text-on-surface-variant">Loading summary...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="px-5 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/revision"
          className="mt-1 p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </Link>
        <div className="flex-1">
          {courseName && (
            <span className="font-label-caps text-secondary">{courseName}</span>
          )}
          <h1 className="font-h1 text-primary-container">{topicName}</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {highlights.length} highlight{highlights.length !== 1 ? 's' : ''}
            {(data as any)?.updatedAt && ` · Last updated ${formatTime((data as any).updatedAt)}`}
          </p>
        </div>
      </div>

      {/* Summary body */}
      <section className="bg-white rounded-xl p-6 border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary-container">edit_note</span>
          <h2 className="font-h2 text-primary-container">Summary Notes</h2>
        </div>
        {summaryBody ? (
          <div className="prose prose-sm max-w-none text-on-surface leading-relaxed whitespace-pre-wrap">
            {summaryBody}
          </div>
        ) : (
          <p className="text-on-surface-variant font-body-md italic">
            No summary notes written yet. Open the reader to start writing.
          </p>
        )}
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">highlight</span>
            <h2 className="font-h2 text-primary-container">Highlights</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h: any) => (
              <button
                key={h.id}
                onClick={() => handleHighlightClick(h)}
                className="text-left bg-amber-50 rounded-xl p-4 border border-amber-200 hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">highlight</span>
                    p.{h.page}{h.paragraph != null ? ` ¶${h.paragraph}` : ''}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{formatTime(h.createdAt || h.created_at)}</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed italic">{h.text}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  Open in reader
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!summaryBody && highlights.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-outline-variant/30 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">note_add</span>
          <h3 className="font-h2 text-primary-container mb-2">No notes yet</h3>
          <p className="text-on-surface-variant font-body-md max-w-md mx-auto mb-6">
            Start reading this topic and add summary notes or highlight key passages to build your revision material.
          </p>
          {courseId && (
            <Link
              to={`/courses/${courseId}/topics/${topicId}/read`}
              state={{ from: 'summary', topicId }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-xl font-button text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">auto_stories</span>
              Open Reader
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
