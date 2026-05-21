import React from 'react';

export default function FeaturedCase({ case: c, onBookmark }) {
  return (
    <article className="col-span-2 md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <button className="text-primary/40 hover:text-primary transition-colors" onClick={onBookmark}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
        </button>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-unit">
          <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded uppercase tracking-wider">Negligence</span>
          <span className="px-2 py-0.5 bg-secondary-fixed/30 text-secondary-fixed-variant text-[10px] font-bold rounded uppercase tracking-wider">Tort Law</span>
        </div>
        <h2 className="font-h2 text-primary mb-2">{c?.name || 'Donoghue v Stevenson'}</h2>
        <p className="font-body-md text-on-surface-variant line-clamp-2 italic mb-4">{c?.citation || '[1932] UKHL 100'}</p>
        <p className="font-body-md text-on-surface mb-6 max-w-2xl">{c?.description || 'The "snail in the bottle" case established the modern law of negligence and the neighbor principle, revolutionizing duty of care in common law.'}</p>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant pt-4">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-surface shadow-sm bg-secondary-fixed" />
          <div className="w-8 h-8 rounded-full border-2 border-surface shadow-sm bg-secondary-fixed-dim" />
          <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+3</div>
        </div>
        <button className="flex items-center gap-2 text-primary font-button text-sm hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">share</span>
          Share with classmates
        </button>
      </div>
    </article>
  );
}
