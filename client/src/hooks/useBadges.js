import { useQuery } from '@tanstack/react-query';
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

export function useCountdown() {
  return useQuery({
    queryKey: ['countdown'],
    queryFn: () => api.get('/badges/countdown').then((r) => r.data),
  });
}
