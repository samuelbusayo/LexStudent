import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { getServerPort, getSidecarHealth } from './services/tauri-api'
import { setServerPort } from './services/api'
import Layout from './components/layout/Layout'
import FirstRunSetup from './components/FirstRunSetup'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import CourseDetail from './pages/CourseDetail'
import RevisionMode from './pages/RevisionMode'
import Badges from './pages/Badges'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Settings from './pages/Settings'
import LiveLectureRecording from './pages/LiveLectureRecording'
import LectureNoteEditor from './pages/LectureNoteEditor'
import Milestone from './pages/Milestone'
import AddTopic from './pages/AddTopic'
import TopicReader from './pages/TopicReader'
import TopicMaterial from './pages/TopicMaterial'
import SummaryView from './pages/SummaryView'
import RevisionSession from './pages/RevisionSession'
import QuizFlow from './pages/QuizFlow'
import BadgeToastListener from './components/badges/BadgeToastListener'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function LogoutRoute() {
  const { logout } = useAuth()
  logout()
  return <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/logout" element={<LogoutRoute />} />
      <Route path="/recording" element={<ProtectedRoute><LiveLectureRecording /></ProtectedRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/courses/:courseId/add-topic" element={<AddTopic />} />
        <Route path="/courses/:courseId/topics/:topicId/read" element={<TopicReader />} />
        <Route path="/courses/:courseId/topics/:topicId/materials" element={<TopicMaterial />} />
        <Route path="/revision" element={<RevisionMode />} />
        <Route path="/revision/summary/:topicId" element={<SummaryView />} />
        <Route path="/revision/session" element={<RevisionSession />} />
        <Route path="/revision/quiz" element={<QuizFlow />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/milestone" element={<Milestone />} />
        <Route path="/notes/:noteId" element={<LectureNoteEditor />} />
      </Route>
    </Routes>
  )
}

function AppInit({ children }: { children: React.ReactNode }) {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null)

  useEffect(() => {
    // Get server port from Tauri sidecar
    getServerPort()
      .then((port) => setServerPort(port))
      .catch(() => {
        // Sidecar not available, use default port
      })

    // Check if first-run setup is needed
    getSidecarHealth()
      .then((health) => {
        if (health.whisper_ready && health.llm_ready) {
          setSetupComplete(true)
        } else {
          setSetupComplete(false)
        }
      })
      .catch(() => {
        // Sidecar not running — skip first-run (user can configure in Settings)
        setSetupComplete(true)
      })
  }, [])

  // Show loading while checking
  if (setupComplete === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-on-surface-variant">Initializing LexScholar...</p>
        </div>
      </div>
    )
  }

  // Show first-run wizard if AI hasn't been configured
  if (!setupComplete) {
    return <FirstRunSetup onComplete={() => setSetupComplete(true)} />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppInit>
            <AppRoutes />
          </AppInit>
          <BadgeToastListener />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
