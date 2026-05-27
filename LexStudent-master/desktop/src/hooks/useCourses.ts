import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useTopics(courseId: string) {
  return useQuery({
    queryKey: ['topics', courseId],
    queryFn: () => api.get(`/courses/${courseId}/topics`).then((r) => r.data),
    enabled: !!courseId,
  })
}

export function useCreateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { courseId: string; name?: string; data?: any }) =>
      api.post(`/courses/${vars.courseId}/topics`, vars.data || { name: vars.name }).then((r) => r.data),
    onSuccess: (_: any, vars: any) => {
      qc.invalidateQueries({ queryKey: ['topics', vars.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useUpdateMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { courseId: string; topicId: string; data: any }) =>
      api.put(`/courses/${vars.courseId}/topics/${vars.topicId}/materials`, vars.data).then((r) => r.data),
    onSuccess: (_: any, vars: any) => {
      qc.invalidateQueries({ queryKey: ['topics', vars.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { courseId: string; topicId: string }) =>
      api.delete(`/courses/${vars.courseId}/topics/${vars.topicId}`).then((r) => r.data),
    onSuccess: (_: any, vars: any) => {
      qc.invalidateQueries({ queryKey: ['topics', vars.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { courseId: string; topicId: string }) =>
      api.delete(`/courses/${vars.courseId}/topics/${vars.topicId}/materials`).then((r) => r.data),
    onSuccess: (_: any, vars: any) => {
      qc.invalidateQueries({ queryKey: ['topics', vars.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
