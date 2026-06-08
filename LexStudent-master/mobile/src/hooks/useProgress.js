import { useQuery } from '@tanstack/react-query'
import { getOverallProgress, getRecentProgress, getStreak, getKnowledgeGaps, getHeatmap } from '../services/db'

export function useOverallProgress() {
  return useQuery({
    queryKey: ['progress', 'overall'],
    queryFn: getOverallProgress,
  })
}

export function useRecentProgress() {
  return useQuery({
    queryKey: ['progress', 'recent'],
    queryFn: getRecentProgress,
  })
}

export function useStreak() {
  return useQuery({
    queryKey: ['progress', 'streak'],
    queryFn: getStreak,
  })
}

export function useKnowledgeGaps() {
  return useQuery({
    queryKey: ['progress', 'gaps'],
    queryFn: getKnowledgeGaps,
  })
}

export function useHeatmap() {
  return useQuery({
    queryKey: ['progress', 'heatmap'],
    queryFn: getHeatmap,
  })
}
