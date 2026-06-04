import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../services/api'

export function useQuizCourses() {
  return useQuery({
    queryKey: ['quiz', 'courses'],
    queryFn: () => api.get('/quiz/courses').then((r) => r.data),
  })
}

export function useQuizTopics(courseId: number | null) {
  return useQuery({
    queryKey: ['quiz', 'topics', courseId],
    queryFn: () => api.get(`/quiz/courses/${courseId}/topics`).then((r) => r.data),
    enabled: !!courseId,
  })
}

export function useQuizSession(topicId: number | null) {
  return useQuery({
    queryKey: ['quiz', 'session', topicId],
    queryFn: () => api.get(`/quiz/topics/${topicId}/session`).then((r) => r.data),
    enabled: !!topicId,
  })
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: (data: { topicId: number; secondsPerQuestion: number; questionOrder: string; numQuestions: string | number }) =>
      api.post('/quiz/attempts', data).then((r) => r.data),
  })
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({ attemptId, ...data }: { attemptId: number; questionId: number; selectedIndex: number | null; timeTakenSeconds: number }) =>
      api.post(`/quiz/attempts/${attemptId}/answer`, data).then((r) => r.data),
  })
}

export function useCompleteAttempt() {
  return useMutation({
    mutationFn: (attemptId: number) =>
      api.post(`/quiz/attempts/${attemptId}/complete`).then((r) => r.data),
  })
}
