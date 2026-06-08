import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

/** Render structured body nodes inline: text as prose, highlights as clickable chips */
function StructuredBody({ nodes, onHighlightClick }) {
  if (!nodes || nodes.length === 0) return null
  return (
    <div className="prose prose-sm max-w-none text-on-surface leading-relaxed whitespace-pre-wrap">
      {nodes.map((node, i) => {
        if (node.type === 'text') {
          return <span key={i}>{node.value}</span>
        }
        if (node.type === 'highlight') {
          return (
            <span
              key={i}
              onClick={(e) => { e.stopPropagation(); onHighlightClick(node) }}
              className="inline bg-amber-100 border border-amber-300 rounded-md px-1.5 py-0.5 mx-0.5 cursor-pointer hover:bg-amber-200 transition-colors whitespace-normal"
              title={`Page ${node.page}${node.paragraph != null ? ', ¶' + node.paragraph : ''} — click to open in reader`}
            >
              <span className="italic text-amber-900">"{node.text}"</span>
              <span className="text-[10px] text-amber-700 ml-1 not-italic">p.{node.page}{node.paragraph != null ? ` ¶${node.paragraph}` : ''}</span>
            </span>
          )
        }
        return null
      })}
    </div>
  )
}

export default function SummaryView() {
  const { topicId } = useParams()
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['topicSummary', topicId],
    queryFn: () => api.get(`/study-notes/${topicId}/summary`).then(r => r.data),
  })

  // Fetch topic/course names from the revision feed for the header
  const { data: feedData } = useQuery({
    queryKey: ['summaryFeed'],
    queryFn: () => api.get('/study-notes').then(r => r.data),
    staleTime: 30000,
  })

  const topicInfo = (feedData || []).find(f => String(f.topicId) === String(topicId))
  const topicName = topicInfo?.topicName || 'Topic Summary'
  const courseName = topicInfo?.courseName || ''

  // body is now a structured array of nodes
  const bodyNodes = data?.body || []
  const highlightCount = bodyNodes.filter(n => n.type === 'highlight').length

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    } catch { return '' }
  }

  const handleHighlightClick = (node) => {
    const cId = courseId || topicInfo?.courseId
    if (!cId) return
    const url = `/courses/${cId}/topics/${topicId}/read?page=${node.page}${node.paragraph != null ? `&para=${node.paragraph}` : ''}`
    navigate(url, { state: { from: 'summary', topicId } })
  }

  if (isLoading) {
    return (
      <main className="px-container-padding py-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-pulse">hourglass_top</span>
          <p className="font-body-md text-on-surface-variant mt-4">Loading summary...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="px-container-padding py-6 max-w-4xl mx-auto space-y-6">
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
            {highlightCount} highlight{highlightCount !== 1 ? 's' : ''}
            {data?.updatedAt && ` · Last updated ${formatTime(data.updatedAt)}`}
          </p>
        </div>
      </div>

      {/* Summary body with inline highlights */}
      <section className="bg-white rounded-xl p-6 border border-[#E0E0D0]">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary-container">edit_note</span>
          <h2 className="font-h2 text-primary-container">Summary Notes</h2>
        </div>
        {bodyNodes.length > 0 ? (
          <StructuredBody nodes={bodyNodes} onHighlightClick={handleHighlightClick} />
        ) : (
          <p className="text-on-surface-variant font-body-md italic">
            No summary notes written yet. Open the reader to start writing.
          </p>
        )}
      </section>

      {/* Empty state */}
      {bodyNodes.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-[#E0E0D0] text-center">
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
