interface StudyGuideCardProps {
  guide: any
}

export default function StudyGuideCard({ guide }: StudyGuideCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-secondary text-[20px]">menu_book</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-body-md font-bold text-on-surface truncate">{guide.title}</h4>
          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{guide.description}</p>
          {guide.pages && (
            <span className="text-[10px] text-on-surface-variant mt-2 inline-block">
              {guide.pages} pages
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
