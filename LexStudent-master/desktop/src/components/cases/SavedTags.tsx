interface SavedTagsProps {
  tags: string[]
  activeTag?: string
  onTagSelect: (tag: string) => void
}

export default function SavedTags({ tags, activeTag, onTagSelect }: SavedTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect('')}
        className={`text-xs px-3 py-1.5 rounded-full font-button transition-colors ${
          !activeTag
            ? 'bg-secondary-container text-on-secondary-container'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`text-xs px-3 py-1.5 rounded-full font-button transition-colors ${
            activeTag === tag
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
