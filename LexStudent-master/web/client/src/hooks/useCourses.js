import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then((r) => r.data),
  });
  return { courses: data, isLoading };
}

export function useCourse(id) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => api.get(`/courses/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useTopics(courseId) {
  return useQuery({
    queryKey: ['topics', courseId],
    queryFn: () => api.get(`/courses/${courseId}/topics`).then((r) => r.data),
    enabled: !!courseId,
  });
}

export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }) =>
      api.post(`/courses/${courseId}/topics`, data).then((r) => r.data),
    onSuccess: (topic, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, topicId, data }) =>
      api.put(`/courses/${courseId}/topics/${topicId}/materials`, data).then((r) => r.data),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, topicId }) =>
      api.delete(`/courses/${courseId}/topics/${topicId}`).then((r) => r.data),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, topicId }) =>
      api.delete(`/courses/${courseId}/topics/${topicId}/materials`).then((r) => r.data),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['topics', variables.courseId] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
