import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'
import TopicCard from '../components/courses/TopicCard'

export default function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { data: course, isLoading } = useCourse(courseId)
  const { data: topics } = useTopics(courseId)
  const [search, setSearch] = useState('')

  const filteredTopics = (topics || []).filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
        </div>
      </div>
    )
  }

  const topicsArr = topics || []
  const totalTopicCount = topicsArr.length
  const completedCount = topicsArr.filter(t => {
    const selected = t.selectedPages || []
    const total = selected.length
    return t.pagesRead >= total && total > 0
  }).length

  let courseProgress = 0
  if (totalTopicCount > 0) {
    let totalPages = 0
    let readPages = 0
    topicsArr.forEach(t => {
      const selected = t.selectedPages || []
      const total = selected.length
      totalPages += total
      readPages += Math.min(t.pagesRead || 0, total)
    })
    courseProgress = totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-on-surface-variant text-sm mb-2 active:opacity-60">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-xl font-semibold text-primary truncate">{course?.name}</h1>
            <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{course?.description}</p>
          </div>
          <Link
            to={`/courses/${courseId}/topics/new`}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Topics</p>
          <p className="font-serif text-xl font-bold text-primary mt-0.5">{totalTopicCount}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Progress</p>
          <p className="font-serif text-xl font-bold text-primary mt-0.5">{courseProgress}%</p>
          <p className="text-[9px] text-on-surface-variant">{completedCount}/{totalTopicCount} done</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Files</p>
          <p className="font-serif text-xl font-bold text-primary mt-0.5">
            {topicsArr.filter(t => t.hasMaterials).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        <input
          className="input-field pl-10 !rounded-lg !text-sm"
          placeholder="Search topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Topic List */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 block">menu_book</span>
          <p className="text-sm">No topics yet. Tap "Add" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} courseId={courseId} />
          ))}
        </div>
      )}
    </div>
  )
}
