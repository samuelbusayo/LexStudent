import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import BadgeUnlockedToast from './BadgeUnlockedToast'

export default function BadgeToastListener() {
  const [queue, setQueue] = useState<any[]>([])
  const qc = useQueryClient()

  useEffect(() => {
    let canceled = false

    const onEarned = async (event: Event) => {
      const codes = (event as CustomEvent).detail || []
      if (codes.length === 0) return
      try {
        const res = await api.get('/badges')
        if (canceled) return
        const byCode = new Map((res.data as any[]).map(b => [b.code, b]))
        const newOnes = codes
          .map((c: string) => byCode.get(c))
          .filter(Boolean)
          .map((b: any) => ({ ...b, _toastId: `${b.code}-${Date.now()}-${Math.random()}` }))
        if (newOnes.length > 0) {
          setQueue(q => [...q, ...newOnes])
          qc.invalidateQueries({ queryKey: ['badges'] })
        }
      } catch {}
    }

    window.addEventListener('badge:earned', onEarned)
    return () => { canceled = true; window.removeEventListener('badge:earned', onEarned) }
  }, [qc])

  const dismiss = (toastId: string) => setQueue(q => q.filter(b => b._toastId !== toastId))

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
  )
}
