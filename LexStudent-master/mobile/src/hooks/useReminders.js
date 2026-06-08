import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReminders, toggleReminder } from '../services/db'

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: getReminders,
  })
}

export function useToggleReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleReminder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })
}
