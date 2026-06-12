import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import BadgeUnlockedToast from './BadgeUnlockedToast';

// Global listener for `badge:earned` window events fired by the api response
// interceptor. Resolves each badge code to its catalogue metadata and stacks
// the resulting toasts in the bottom-right corner.
export default function BadgeToastListener() {
  const [queue, setQueue] = useState([]);
  const qc = useQueryClient();

  useEffect(() => {
    let canceled = false;

    const onEarned = async (event) => {
      const codes = event.detail || [];
      if (codes.length === 0) return;
      try {
        const res = await api.get('/badges');
        if (canceled) return;
        const byCode = new Map(res.data.map(b => [b.code, b]));
        const newOnes = codes
          .map(c => byCode.get(c))
          .filter(Boolean)
          .map(b => ({ ...b, _toastId: `${b.code}-${Date.now()}-${Math.random()}` }));
        if (newOnes.length > 0) {
          setQueue(q => [...q, ...newOnes]);
          // Invalidate the badges query so any open Badges page refetches
          qc.invalidateQueries({ queryKey: ['badges'] });
        }
      } catch {}
    };

    window.addEventListener('badge:earned', onEarned);
    return () => { canceled = true; window.removeEventListener('badge:earned', onEarned); };
  }, [qc]);

  const dismiss = (toastId) => {
    setQueue(q => q.filter(b => b._toastId !== toastId));
  };

  return (
    <>
      {queue.map((badge, i) => (
        <BadgeUnlockedToast
          key={badge._toastId}
          badge={badge}
          offset={i * 110}
          onClose={() => dismiss(badge._toastId)}
        />
      ))}
    </>
  );
}
