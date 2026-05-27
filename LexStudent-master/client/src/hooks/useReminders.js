import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => api.get('/reminders').then((r) => r.data),
  });
}

export function useToggleReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      api.put(`/reminders/${id}/toggle`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  });
}
