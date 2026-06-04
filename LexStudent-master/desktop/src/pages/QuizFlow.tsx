import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  useQuizCourses,
  useQuizTopics,
  useQuizSession,
  useStartAttempt,
  useSubmitAnswer,
  useCompleteAttempt,
} from '../hooks/useQuiz'

const STEP_COURSE = 'course'
const STEP_TOPIC = 'topic'
const STEP_OPTIONS = 'options'
const STEP_QUIZ = 'quiz'
const STEP_RESULTS = 'results'

type Step = typeof STEP_COURSE | typeof STEP_TOPIC | typeof STEP_OPTIONS | typeof STEP_QUIZ | typeof STEP_RESULTS

interface QuizCourse { id: number; name: string; type: string; questionTopicCount: number }
interface QuizTopic { id: number; name: string; questionCount: number }
interface Scenario { id: number; text: string; orderIndex: number }
interface Question { id: number; scenarioId: number | null; blankNumber: number | null; prompt: string | null; options: string[]; orderIndex: number }
interface ReviewQuestion extends Question { correctIndex: number; explanation: string | null; selectedIndex: number | null; isCorrect: number; timeTakenSeconds: number | null }
interface Results { attemptId: number; correctCount: number; totalCount: number; scorePercent: number; rating: string; scenarios: Scenario[]; questions: ReviewQuestion[] }

function TimerRing({ secondsLeft, total }: { secondsLeft: number; total: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? secondsLeft / total : 0
  const isUrgent = secondsLeft <= 5
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-container-high" />
        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3"
          stroke={isUrgent ? '#ef4444' : '#d4a843'}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
      </svg>
      <span className={`absolute text-sm font-bold ${isUrgent ? 'text-red-500' : 'text-on-surface'}`}>{secondsLeft}</span>
    </div>
  )
}

function ScenarioPanel({ scenario, currentBlank, collapsed, onToggle }: { scenario: Scenario; currentBlank: number | null; collapsed: boolean; onToggle: () => void }) {
  const renderText = (text: string) => {
    const parts = text.split(/(\{\{\d+\}\})/g)
    return parts.map((part, i) => {
      const match = part.match(/^\{\{(\d+)\}\}$/)
      if (match) {
        const num = parseInt(match[1])
        const isCurrent = num === currentBlank
        return (
          <span key={i} className={`inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 mx-0.5 rounded text-xs font-bold ${
            isCurrent
              ? 'bg-amber-400 text-primary-container ring-2 ring-amber-500'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}>
            [{num}]
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 md:hidden text-left">
        <span className="font-h3 text-primary-container text-sm">Scenario</span>
        <span className="material-symbols-outlined text-on-surface-variant">{collapsed ? 'expand_more' : 'expand_less'}</span>
      </button>
      <div className={`p-5 pt-0 md:p-5 ${collapsed ? 'hidden md:block' : ''}`}>
        <p className="hidden md:block font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-3">SCENARIO</p>
        <div className="font-body-md text-on-surface leading-relaxed whitespace-pre-line">{renderText(scenario.text)}</div>
      </div>
    </div>
  )
}

function ReviewCard({ index, question, scenario, isBlank, optionLetters }: { index: number; question: ReviewQuestion; scenario: Scenario | null; isBlank: boolean; optionLetters: string[] }) {
  const [showScenario, setShowScenario] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-on-surface-variant text-xs">Question {index + 1}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          question.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {question.isCorrect ? 'Correct' : question.selectedIndex === null ? 'Unanswered' : 'Incorrect'}
        </span>
      </div>

      {scenario && (
        <button onClick={() => setShowScenario(!showScenario)} className="text-xs text-secondary font-button flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">{showScenario ? 'expand_less' : 'expand_more'}</span>
          {showScenario ? 'Hide Scenario' : 'View Scenario'}
        </button>
      )}
      {showScenario && scenario && (
        <div className="bg-surface-container/50 rounded-lg p-3 text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
          {scenario.text.replace(/\{\{(\d+)\}\}/g, '[$1]')}
        </div>
      )}

      <p className="font-body-md text-primary-container font-medium">
        {isBlank ? `Select the value for blank [${question.blankNumber}]` : question.prompt}
      </p>

      <div className="space-y-1.5">
        {question.options.map((opt, idx) => {
          const isSelected = question.selectedIndex === idx
          const isCorrectOption = question.correctIndex === idx
          let classes = 'border-outline-variant/30 bg-surface-container-lowest text-on-surface'
          if (isCorrectOption) classes = 'border-green-400 bg-green-50 text-green-800'
          if (isSelected && !isCorrectOption) classes = 'border-red-400 bg-red-50 text-red-800'
          return (
            <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg border-2 ${classes}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isCorrectOption ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-surface-container text-on-surface-variant'
              }`}>{optionLetters[idx]}</span>
              <span className="text-sm flex-1">{opt}</span>
              {isSelected && !isCorrectOption && <span className="material-symbols-outlined text-red-500 text-sm">close</span>}
              {isCorrectOption && <span className="material-symbols-outlined text-green-500 text-sm">check</span>}
            </div>
          )
        })}
      </div>

      {question.explanation && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
          <span className="font-bold">Explanation:</span> {question.explanation}
        </div>
      )}
    </div>
  )
}

export default function QuizFlow() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState<Step>(STEP_COURSE)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedCourseName, setSelectedCourseName] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [selectedTopicName, setSelectedTopicName] = useState('')

  const [secondsPerQ, setSecondsPerQ] = useState(20)
  const [questionOrder, setQuestionOrder] = useState('sequential')
  const [numQuestions, setNumQuestions] = useState<string>('all')

  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [questionIds, setQuestionIds] = useState<number[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [scenarioCollapsed, setScenarioCollapsed] = useState(false)
  const [lastScenarioId, setLastScenarioId] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isAdvancingRef = useRef(false)

  const [results, setResults] = useState<Results | null>(null)

  const { data: courses, isLoading: coursesLoading } = useQuizCourses()
  const { data: topics, isLoading: topicsLoading } = useQuizTopics(selectedCourseId)
  const { data: sessionData } = useQuizSession(selectedTopicId)
  const startAttempt = useStartAttempt()
  const submitAnswer = useSubmitAnswer()
  const completeAttempt = useCompleteAttempt()

  const currentQuestionId = questionIds[currentQIndex]
  const currentQuestion = (sessionData as any)?.questions?.find((q: any) => q.id === currentQuestionId)
  const currentScenario = currentQuestion?.scenarioId
    ? (sessionData as any)?.scenarios?.find((s: any) => s.id === currentQuestion.scenarioId)
    : null

  useEffect(() => {
    if (currentScenario && currentScenario.id !== lastScenarioId) {
      setScenarioCollapsed(false)
      setLastScenarioId(currentScenario.id)
    }
  }, [currentScenario, lastScenarioId])

  useEffect(() => {
    if (step !== STEP_QUIZ) return
    setTimeLeft(secondsPerQ)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [step, currentQIndex, secondsPerQ])

  const advanceQuestion = useCallback(async (optionIdx: number | null) => {
    if (isAdvancingRef.current || !attemptId) return
    isAdvancingRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    try {
      await submitAnswer.mutateAsync({ attemptId, questionId: currentQuestionId, selectedIndex: optionIdx ?? null, timeTakenSeconds: secondsPerQ - timeLeft })
      if (currentQIndex < questionIds.length - 1) {
        setTimeLeft(secondsPerQ)
        setCurrentQIndex((prev) => prev + 1)
        setSelectedOption(null)
      } else {
        const result = await completeAttempt.mutateAsync(attemptId)
        setResults(result as Results)
        setStep(STEP_RESULTS)
        queryClient.invalidateQueries({ queryKey: ['progress'] })
      }
    } finally { isAdvancingRef.current = false }
  }, [attemptId, currentQuestionId, currentQIndex, questionIds.length, secondsPerQ, timeLeft, submitAnswer, completeAttempt, queryClient])

  useEffect(() => {
    if (step === STEP_QUIZ && timeLeft === 0 && !isAdvancingRef.current) {
      advanceQuestion(selectedOption)
    }
  }, [timeLeft, step, selectedOption, advanceQuestion])

  const handleSelectCourse = (course: QuizCourse) => {
    if (course.questionTopicCount === 0) return
    setSelectedCourseId(course.id)
    setSelectedCourseName(course.name)
    setStep(STEP_TOPIC)
  }

  const handleSelectTopic = (topic: QuizTopic) => {
    if (topic.questionCount === 0) return
    setSelectedTopicId(topic.id)
    setSelectedTopicName(topic.name)
    setStep(STEP_OPTIONS)
  }

  const handleStartQuiz = async () => {
    if (!selectedTopicId) return
    try {
      const data = await startAttempt.mutateAsync({ topicId: selectedTopicId, secondsPerQuestion: secondsPerQ, questionOrder, numQuestions: numQuestions === 'all' ? 'all' : Number(numQuestions) })
      setAttemptId((data as any).attemptId)
      setQuestionIds((data as any).questionIds)
      setCurrentQIndex(0)
      setSelectedOption(null)
      setTimeLeft(secondsPerQ)
      setStep(STEP_QUIZ)
    } catch (err) { console.error('Failed to start quiz:', err) }
  }

  const handleNext = () => { advanceQuestion(selectedOption) }

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit? Your progress on this attempt will be discarded.')) {
      navigate('/revision')
    }
  }

  // ── COURSE PICKER ──
  if (step === STEP_COURSE) {
    return (
      <div className="px-5 py-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/revision')} className="text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-h1 text-primary-container">Choose a Course</h1>
            <p className="font-body-md text-on-surface-variant">Select a course to start your quiz</p>
          </div>
        </div>
        {coursesLoading ? (
          <p className="text-on-surface-variant">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {((courses as QuizCourse[]) || []).map((course) => {
              const disabled = course.questionTopicCount === 0
              return (
                <button key={course.id} onClick={() => handleSelectCourse(course)} disabled={disabled}
                  className={`text-left bg-surface-container-lowest p-5 rounded-xl border transition-all ${disabled ? 'border-outline-variant/20 opacity-50 cursor-not-allowed' : 'border-outline-variant/30 hover:shadow-md hover:border-secondary/50 cursor-pointer'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-on-primary-container/10 text-on-primary-container text-[10px] px-2 py-1 rounded font-bold">{course.type || 'CORE'}</span>
                    {!disabled && <span className="material-symbols-outlined text-secondary text-sm">quiz</span>}
                  </div>
                  <h3 className="font-h3 text-primary mb-1">{course.name}</h3>
                  <p className="text-xs text-on-surface-variant">{disabled ? 'No quiz questions available yet' : `${course.questionTopicCount} topic${course.questionTopicCount !== 1 ? 's' : ''} with questions`}</p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── TOPIC PICKER ──
  if (step === STEP_TOPIC) {
    return (
      <div className="px-5 py-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setStep(STEP_COURSE); setSelectedCourseId(null) }} className="text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-h1 text-primary-container">Choose a Topic</h1>
            <p className="font-body-md text-on-surface-variant">{selectedCourseName}</p>
          </div>
        </div>
        {topicsLoading ? (
          <p className="text-on-surface-variant">Loading topics...</p>
        ) : (
          <div className="space-y-2">
            {((topics as QuizTopic[]) || []).length === 0 && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-on-surface-variant text-[48px] mb-2">info</span>
                <p className="text-on-surface-variant font-body-md">No topics found in this course.</p>
                <button onClick={() => { setStep(STEP_COURSE); setSelectedCourseId(null) }} className="mt-4 text-secondary font-button">Go back</button>
              </div>
            )}
            {((topics as QuizTopic[]) || []).map((topic) => {
              const hasQuestions = topic.questionCount > 0
              return (
                <button key={topic.id} onClick={() => handleSelectTopic(topic)} disabled={!hasQuestions}
                  className={`w-full text-left flex items-center justify-between p-4 rounded-xl border transition-all ${hasQuestions ? 'bg-surface-container-lowest border-outline-variant/30 hover:shadow-md hover:border-secondary/50' : 'bg-surface-container-lowest border-outline-variant/20 opacity-50 cursor-not-allowed'}`}>
                  <div className="flex-1">
                    <h3 className="font-body-md font-bold text-primary-container">{topic.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{hasQuestions ? `${topic.questionCount} question${topic.questionCount !== 1 ? 's' : ''}` : 'Questions coming soon'}</p>
                  </div>
                  {hasQuestions ? <span className="material-symbols-outlined text-secondary">chevron_right</span> : <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── OPTIONS ──
  if (step === STEP_OPTIONS) {
    const totalAvailable = (sessionData as any)?.questions?.length || 0
    return (
      <div className="px-5 py-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setStep(STEP_TOPIC); setSelectedTopicId(null) }} className="text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-h1 text-primary-container">Quiz Options</h1>
            <p className="font-body-md text-on-surface-variant">{selectedTopicName}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-outline-variant/30 p-6 space-y-6">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">TIME PER QUESTION</label>
            <div className="flex gap-2">
              {[10, 15, 20, 30].map((sec) => (
                <button key={sec} onClick={() => setSecondsPerQ(sec)}
                  className={`px-4 py-2 rounded-lg text-sm font-button transition-all ${secondsPerQ === sec ? 'bg-secondary text-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{sec}s</button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">QUESTION ORDER</label>
            <div className="flex gap-2">
              {[{ value: 'sequential', label: 'Sequential' }, { value: 'shuffled', label: 'Shuffled' }].map((opt) => (
                <button key={opt.value} onClick={() => setQuestionOrder(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-button transition-all ${questionOrder === opt.value ? 'bg-secondary text-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{opt.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-2 block">
              NUMBER OF QUESTIONS {totalAvailable > 0 && <span className="normal-case font-normal">({totalAvailable} available)</span>}
            </label>
            <div className="flex gap-2">
              {['all', '10', '20'].map((opt) => (
                <button key={opt} onClick={() => setNumQuestions(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-button transition-all ${numQuestions === opt ? 'bg-secondary text-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{opt === 'all' ? 'All' : opt}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleStartQuiz} disabled={startAttempt.isPending}
          className="w-full bg-primary-container text-white py-4 rounded-xl font-button hover:brightness-110 transition-all disabled:opacity-50">
          {startAttempt.isPending ? 'Starting...' : 'Start Quiz'}
        </button>
      </div>
    )
  }

  // ── QUIZ ──
  if (step === STEP_QUIZ && currentQuestion) {
    const isBlank = currentQuestion.blankNumber != null
    const optionLetters = ['A', 'B', 'C', 'D']
    return (
      <div className="px-5 py-6 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={handleQuit} className="text-on-surface-variant hover:text-red-500 flex items-center gap-1 font-button text-sm">
            <span className="material-symbols-outlined text-sm">close</span> Quit
          </button>
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-on-surface-variant">Question {currentQIndex + 1} of {questionIds.length}</span>
            <TimerRing secondsLeft={timeLeft} total={secondsPerQ} />
          </div>
        </div>
        <div className="w-full h-1 bg-primary-container/10 rounded-full overflow-hidden">
          <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${(currentQIndex / questionIds.length) * 100}%` }} />
        </div>
        <div className={`grid gap-4 ${currentScenario ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-3xl mx-auto'}`}>
          {currentScenario && (
            <div className="md:sticky md:top-4 md:self-start">
              <ScenarioPanel scenario={currentScenario} currentBlank={isBlank ? currentQuestion.blankNumber : null} collapsed={scenarioCollapsed} onToggle={() => setScenarioCollapsed(!scenarioCollapsed)} />
            </div>
          )}
          <div className="bg-white rounded-xl border border-outline-variant/30 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="bg-primary-container/5 text-primary-container px-2 py-0.5 rounded-full font-bold tracking-widest uppercase text-[10px]">{selectedCourseName}</span>
              <span>|</span>
              <span className="truncate">{selectedTopicName}</span>
            </div>
            <div className="font-body-lg text-primary-container font-medium">
              {isBlank
                ? <span>Select the value for blank <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded text-xs font-bold bg-amber-400 text-primary-container">[{currentQuestion.blankNumber}]</span> above.</span>
                : currentQuestion.prompt}
            </div>
            <div className="space-y-2">
              {currentQuestion.options.map((opt: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${selectedOption === idx ? 'border-secondary bg-secondary/10' : 'border-outline-variant/30 hover:border-secondary/50 bg-surface-container-lowest'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${selectedOption === idx ? 'bg-secondary text-primary-container' : 'bg-surface-container text-on-surface-variant'}`}>{optionLetters[idx]}</span>
                  <span className="font-body-md text-on-surface">{opt}</span>
                </button>
              ))}
            </div>
            <button onClick={handleNext} disabled={selectedOption === null || submitAnswer.isPending}
              className="w-full bg-primary-container text-white py-3 rounded-xl font-button transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed">
              {currentQIndex < questionIds.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── RESULTS ──
  if (step === STEP_RESULTS && results) {
    const avgTime = results.questions.length > 0
      ? Math.round(results.questions.reduce((sum, q) => sum + (q.timeTakenSeconds || 0), 0) / results.questions.length)
      : 0
    const scenarioMap: Record<number, Scenario> = {}
    for (const s of results.scenarios || []) scenarioMap[s.id] = s
    const optionLetters = ['A', 'B', 'C', 'D']

    return (
      <div className="px-5 py-6 max-w-3xl mx-auto space-y-6">
        <div className="bg-primary-container rounded-2xl p-8 text-center text-white space-y-3">
          <span className="material-symbols-outlined text-[64px] text-secondary">
            {results.scorePercent >= 80 ? 'emoji_events' : results.scorePercent >= 40 ? 'sentiment_neutral' : 'sentiment_dissatisfied'}
          </span>
          <h1 className="font-h1 text-4xl">{results.correctCount} / {results.totalCount}</h1>
          <p className="text-2xl font-bold text-secondary">{results.scorePercent}%</p>
          <div className="flex justify-center gap-6 text-sm text-white/70 pt-2">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">timer</span> Avg {avgTime}s / question
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              {results.rating === 'got_it' ? 'Great — interval extended!' : results.rating === 'shaky' ? 'Decent — keep practicing' : 'Needs work — review soon'}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-h2 text-primary-container">Question Review</h2>
          {results.questions.map((q, i) => {
            const scenario = q.scenarioId ? scenarioMap[q.scenarioId] : null
            const isBlank = q.blankNumber != null
            return <ReviewCard key={q.id} index={i} question={q} scenario={scenario} isBlank={isBlank} optionLetters={optionLetters} />
          })}
        </div>
        <div className="text-center pb-8">
          <button onClick={() => navigate('/revision')} className="bg-primary-container text-white px-8 py-3 rounded-xl font-button hover:brightness-110 transition-all">Back to Revision</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-on-surface-variant font-body-md">Loading...</p>
    </div>
  )
}
