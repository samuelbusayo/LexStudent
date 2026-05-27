import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export function useCases(tag?: string) {
  return useQuery({
    queryKey: ['cases', tag],
    queryFn: () => api.get('/cases', { params: { tag } }).then((r) => r.data),
  })
}

export function useFeaturedCase() {
  return useQuery({
    queryKey: ['cases', 'featured'],
    queryFn: () => api.get('/cases/featured').then((r) => r.data),
  })
}

export function useTags() {
  return useQuery({
    queryKey: ['cases', 'tags'],
    queryFn: () => api.get('/cases/tags').then((r) => r.data),
  })
}

export function useBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.put(`/cases/${id}/bookmark`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
  })
}
