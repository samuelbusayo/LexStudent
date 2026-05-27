import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useOverallProgress() {
  return useQuery({
    queryKey: ['progress', 'overall'],
    queryFn: () => api.get('/progress/overall').then((r) => r.data),
  })
}

export function useRecentProgress() {
  return useQuery({
    queryKey: ['progress', 'recent'],
    queryFn: () => api.get('/progress/recent').then((r) => r.data),
  })
}

export function useStreak() {
  return useQuery({
    queryKey: ['progress', 'streak'],
    queryFn: () => api.get('/progress/streak').then((r) => r.data),
  })
}

export function useKnowledgeGaps() {
  return useQuery({
    queryKey: ['progress', 'gaps'],
    queryFn: () => api.get('/progress/gaps').then((r) => r.data),
  })
}

export function useHeatmap() {
  return useQuery({
    queryKey: ['progress', 'heatmap'],
    queryFn: () => api.get('/progress/heatmap').then((r) => r.data),
  })
}
