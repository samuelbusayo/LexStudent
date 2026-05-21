import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then((r) => r.data),
  })
  return { courses: data, isLoading }
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => api.get(`/courses/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}
