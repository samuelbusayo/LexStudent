import { useEffect } from 'react'

interface Props {
  badge: any
  offset: number
  onClose: () => void
}

export default function BadgeUnlockedToast({ badge, offset, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className="fixed right-6 z-[9999] w-72 rounded-2xl shadow-2xl overflow-hidden animate-slide-in-right"
      style={{ bottom: `${24 + offset}px` }}
    >
      <div className="bg-gradient-to-br from-primary-container to-primary p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center flex-shrink-0">
          <span
            className="material-symbols-outlined text-secondary-container text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {badge.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-container mb-0.5">
            Badge Unlocked!
          </p>
          <p className="font-semibold text-white text-sm truncate">{badge.name}</p>
          <p className="text-[11px] text-white/70 line-clamp-2 mt-0.5">{badge.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white flex-shrink-0 self-start"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  )
}
