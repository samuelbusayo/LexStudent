import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then((r) => r.data),
  });
}

export function useQuote() {
  return useQuery({
    queryKey: ['quote'],
    queryFn: () => api.get('/badges/quote').then((r) => r.data),
  });
}

export function useMilestone() {
  return useQuery({
    queryKey: ['milestone'],
    queryFn: () => api.get('/badges/milestone').then((r) => r.data),
  });
}

export function useMilestoneMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['milestone'] });

  const create = useMutation({
    mutationFn: (data) => api.post('/badges/milestone', data).then(r => r.data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/badges/milestone/${id}`, data).then(r => r.data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/badges/milestone/${id}`).then(r => r.data),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
