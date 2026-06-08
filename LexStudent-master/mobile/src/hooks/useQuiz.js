import { useQuery, useMutation } from '@tanstack/react-query'
import { getQuizCourses, getQuizTopics, getQuizSession, startQuizAttempt, submitQuizAnswer, completeQuizAttempt } from '../services/db'

export function useQuizCourses() {
  return useQuery({
    queryKey: ['quiz', 'courses'],
    queryFn: getQuizCourses,
  })
}

export function useQuizTopics(courseId) {
  return useQuery({
    queryKey: ['quiz', 'topics', courseId],
    queryFn: () => getQuizTopics(courseId),
    enabled: !!courseId,
  })
}

export function useQuizSession(topicId) {
  return useQuery({
    queryKey: ['quiz', 'session', topicId],
    queryFn: () => getQuizSession(topicId),
    enabled: !!topicId,
  })
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: startQuizAttempt,
  })
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({ attemptId, ...data }) => submitQuizAnswer(attemptId, data),
  })
}

export function useCompleteAttempt() {
  return useMutation({
    mutationFn: completeQuizAttempt,
  })
}
