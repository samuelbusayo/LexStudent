import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import CourseDetail from './pages/CourseDetail'
import AddTopic from './pages/AddTopic'
import AddTopicMaterials from './pages/AddTopicMaterials'
import TopicReader from './pages/TopicReader'
import TopicMaterial from './pages/TopicMaterial'
import RevisionMode from './pages/RevisionMode'
import RevisionSession from './pages/RevisionSession'
import SummaryView from './pages/SummaryView'
import Badges from './pages/Badges'
import Milestone from './pages/Milestone'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
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
      <Route path="/courses/:courseId/topics/:topicId/read" element={<ProtectedRoute><TopicReader /></ProtectedRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/courses/:courseId/topics/new" element={<AddTopic />} />
        <Route path="/courses/:courseId/topics/new/materials" element={<AddTopicMaterials />} />
        <Route path="/courses/:courseId/topics/:topicId/materials" element={<TopicMaterial />} />
        <Route path="/revision" element={<RevisionMode />} />
        <Route path="/revision/summary/:topicId" element={<SummaryView />} />
        <Route path="/revision/session" element={<RevisionSession />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/milestone" element={<Milestone />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
