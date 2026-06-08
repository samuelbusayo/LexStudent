import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCases, toggleBookmarkCase } from '../services/db'

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: getCases,
  })
}

export function useFeaturedCase() {
  return useQuery({
    queryKey: ['cases', 'featured'],
    queryFn: async () => {
      const cases = await getCases()
      return cases?.find(c => c.isFeatured) || cases?.[0] || null
    },
  })
}

export function useTags() {
  return useQuery({
    queryKey: ['cases', 'tags'],
    queryFn: async () => {
      const cases = await getCases()
      const allTags = new Set()
      ;(cases || []).forEach(c => {
        const tags = Array.isArray(c.tags) ? c.tags : []
        tags.forEach(t => allTags.add(t))
      })
      return Array.from(allTags)
    },
  })
}

export function useBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => toggleBookmarkCase(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}
