import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCourse, useTopics } from '../hooks/useCourses'

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
      <div className="space-y-5">
        <div className="skeleton h-72 rounded-2xl" />
        <div className="skeleton h-12 rounded-full" />
        <div className="skeleton h-6 w-48 rounded" />
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
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

  const circumference = 2 * Math.PI * 52
  const offset = circumference - (courseProgress / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Hero Card — centered progress ring + course info */}
      <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 text-center">
        {/* Progress Ring */}
        <div className="relative w-36 h-36 mx-auto mb-5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#f0eded" strokeWidth="6" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#735c00" strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-h1 text-3xl text-primary">{courseProgress}%</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mt-0.5">COMPLETE</span>
          </div>
        </div>

        {/* Course type tag */}
        <span className="inline-block px-3 py-1 bg-secondary-container/30 rounded-full font-label-caps text-label-caps text-secondary tracking-widest">
          {course?.type || 'CORE'}
        </span>

        {/* Course name */}
        <h1 className="font-h1 text-3xl text-primary mt-3">{course?.name}</h1>

        {/* Description */}
        <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed max-w-sm mx-auto">
          {course?.description}
        </p>
      </section>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
        <input
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full pl-12 pr-4 py-3 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
          placeholder="Search subtopics or modules..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Curriculum Breakdown */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-h2 text-xl text-primary">Curriculum Breakdown</h2>
          <Link
            to={`/courses/${courseId}/topics/new`}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-white rounded-xl font-button text-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Topic
          </Link>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block">menu_book</span>
            <p className="font-body-md">No topics yet. Tap "Add Topic" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTopics.map(topic => {
              const selectedPages = topic.selectedPages || []
              const totalPages = selectedPages.length
              const pagesRead = Math.min(topic.pagesRead ?? 0, totalPages)
              const pct = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0

              return (
                <Link
                  key={topic.id}
                  to={`/courses/${courseId}/topics/${topic.id}/read`}
                  className="block bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 active:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <h4 className="font-h3 text-base text-primary font-semibold">{topic.name}</h4>
                      {topic.description && (
                        <p className="text-sm text-on-surface-variant mt-0.5">{topic.description}</p>
                      )}
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); navigate(`/courses/${courseId}/topics/${topic.id}/materials`) }}
                      className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center active:bg-primary-container active:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl text-primary-container">description</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-label-caps text-[10px] text-secondary tracking-widest">PROGRESS</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">{pagesRead}/{totalPages} PAGES READ</span>
                  </div>
                  <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-secondary h-full transition-all duration-700 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Study Guide CTA — dark banner */}
      <section className="bg-primary-container rounded-2xl p-6 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <span className="material-symbols-outlined text-[80px]">menu_book</span>
        </div>
        <h3 className="font-h2 text-xl text-white relative z-10">Study Guide: Exam Prep</h3>
        <p className="text-white/70 font-body-md mt-2 relative z-10 leading-relaxed">
          Download the curated review materials for the upcoming {course?.name} mock exam.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-button text-button relative z-10 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-lg">download</span>
          Get Study Guide
        </button>
      </section>
    </div>
  )
}
