import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBadges, getQuote, getMilestones, createMilestone, updateMilestone, deleteMilestone } from '../services/db'

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
  })
}

export function useQuote() {
  return useQuery({
    queryKey: ['quote'],
    queryFn: getQuote,
  })
}

export function useMilestone() {
  return useQuery({
    queryKey: ['milestone'],
    queryFn: async () => {
      const milestones = await getMilestones()
      if (!milestones || milestones.length === 0) return null
      const now = new Date()
      const upcoming = milestones
        .map(m => {
          const target = new Date((m.targetDate || m.target_date) + 'T00:00:00')
          const diffMs = target - now
          const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
          return { ...m, daysRemaining, passed: diffMs < 0 }
        })
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
      return upcoming[0] || null
    },
  })
}

export function useMilestoneMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['milestone'] })

  const create = useMutation({
    mutationFn: createMilestone,
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, ...data }) => updateMilestone(id, data),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: deleteMilestone,
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
