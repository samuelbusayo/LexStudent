import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/auth/me').then((r) => r.data),
  });
}

export function useActivityLog() {
  return useQuery({
    queryKey: ['activity', 'log'],
    queryFn: () => api.get('/auth/activity').then((r) => r.data),
  });
}

export function useUserHeatmap() {
  return useQuery({
    queryKey: ['activity', 'heatmap'],
    queryFn: () => api.get('/auth/heatmap').then((r) => r.data),
  });
}

export function useProfileMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['profile'] });
    qc.invalidateQueries({ queryKey: ['auth'] });
    qc.invalidateQueries({ queryKey: ['badges'] });
  };

  const updateProfile = useMutation({
    mutationFn: (data) => api.put('/auth/me', data).then((r) => r.data),
    onSuccess: invalidate,
  });

  const changePassword = useMutation({
    mutationFn: (data) => api.put('/auth/password', data).then((r) => r.data),
  });

  return { updateProfile, changePassword };
}
