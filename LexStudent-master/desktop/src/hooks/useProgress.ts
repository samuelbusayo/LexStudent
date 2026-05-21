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
