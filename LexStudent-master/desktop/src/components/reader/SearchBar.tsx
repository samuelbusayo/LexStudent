import { useEffect, useRef } from 'react'

interface SearchBarProps {
  query: string
  onQueryChange: (q: string) => void
  currentMatch: number
  totalMatches: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

export default function SearchBar({ query, onQueryChange, currentMatch, totalMatches, onNext, onPrev, onClose }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) onPrev()
      else onNext()
    }
  }

  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 shadow-md">
      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Find in document..."
        className="bg-transparent border-none outline-none text-sm font-body text-on-surface w-40 placeholder:text-on-surface-variant/50"
      />
      {query.length >= 2 && (
        <span className="text-xs text-on-surface-variant whitespace-nowrap min-w-[4rem] text-center">
          {totalMatches > 0 ? `${currentMatch + 1} of ${totalMatches}` : 'No matches'}
        </span>
      )}
      <div className="flex items-center gap-0.5">
        <button onClick={onPrev} disabled={totalMatches === 0} className="p-0.5 text-on-surface-variant hover:text-on-surface rounded transition-colors disabled:opacity-30" title="Previous (Shift+Enter)">
          <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
        </button>
        <button onClick={onNext} disabled={totalMatches === 0} className="p-0.5 text-on-surface-variant hover:text-on-surface rounded transition-colors disabled:opacity-30" title="Next (Enter)">
          <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
        </button>
      </div>
      <button onClick={onClose} className="p-0.5 text-on-surface-variant hover:text-on-surface rounded transition-colors" title="Close (Esc)">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  )
}
