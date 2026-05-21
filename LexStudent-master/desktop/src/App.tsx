import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-stack-lg">
        <h1 className="font-h1 text-h1 text-primary">LexStudent Desktop</h1>
        <p className="font-body-md text-on-surface-variant">
          Your law study companion — now as a native desktop app.
        </p>
        <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 max-w-md mx-auto">
          <p className="text-sm text-on-surface-variant">
            This desktop shell mirrors the web app's component structure.
            Connect it to the shared component library to start building.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
