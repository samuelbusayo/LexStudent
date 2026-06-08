import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCourses, getCourse, getTopics, createTopic, deleteTopic, updateTopicProgress, addMaterial, deleteMaterial } from '../services/db'

export function useCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  return { courses: data, isLoading }
}

export function useCourse(id) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id),
    enabled: !!id,
  })
}

export function useTopics(courseId) {
  return useQuery({
    queryKey: ['topics', courseId],
    queryFn: () => getTopics(courseId),
    enabled: !!courseId,
  })
}

export function useCreateTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, name }) => createTopic(courseId, name),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useUpdateMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, topicId, data }) =>
      addMaterial(topicId, data.originalName, data.storedName, data.mimeType, data.sizeBytes, data.filepath),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, topicId }) => deleteTopic(courseId, topicId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, topicId, materialId }) => deleteMaterial(materialId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] })
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
