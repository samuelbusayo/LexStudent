import React, { useState } from 'react';
import { useCases, useFeaturedCase, useTags, useBookmark } from '../hooks/useCases';
import { useQuote } from '../hooks/useBadges';
import FeaturedCase from '../components/cases/FeaturedCase';
import CaseCard from '../components/cases/CaseCard';
import PrincipleOfDay from '../components/cases/PrincipleOfDay';
import SavedTags from '../components/cases/SavedTags';

const staticCases = [
  { id: 1, icon: 'gavel', year: '1803', name: 'Marbury v Madison', citation: '5 U.S. (1 Cranch) 137', description: 'Established the principle of judicial review in the United States, allowing courts to strike down laws.', tags: ['Constitutional'] },
  { id: 2, icon: 'balance', year: '1897', name: 'Salomon v Salomon', citation: '[1897] AC 22', description: 'A landmark UK company law case. It upheld the doctrine of separate legal personality for companies.', tags: ['Company Law'] },
  { id: 3, icon: 'policy', year: '1966', name: 'Miranda v Arizona', citation: '384 U.S. 436', description: 'Specified the "Miranda rights" that must be read to criminal suspects before interrogation.', tags: ['Criminal'] },
];

export default function CasesLibrary() {
  const [search, setSearch] = useState('');
  const { data: featured } = useFeaturedCase();
  const { data: tags } = useTags();
  const { data: quote } = useQuote();
  const bookmark = useBookmark();

  return (
    <main className="max-w-7xl mx-auto px-container-padding pt-stack-md space-y-stack-lg">
      <section className="space-y-stack-sm">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body-md text-on-surface shadow-sm"
            placeholder="Search cases, legal principles, or citations..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-gutter overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-button text-sm whitespace-nowrap active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Save New Case
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-outline text-primary rounded-full font-button text-sm whitespace-nowrap hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
            </button>
          </div>
          <div className="text-label-caps text-outline uppercase tracking-widest hidden md:block">128 Authorities Saved</div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
        <FeaturedCase case={featured} onBookmark={() => bookmark.mutate?.(featured?.id)} />

        <aside className="col-span-2 md:col-span-4 space-y-4">
          <PrincipleOfDay quote={quote} />
          <SavedTags tags={tags} />
        </aside>

        {staticCases.map((c) => (
          <CaseCard key={c.id} case={c} />
        ))}

        <div className="col-span-2 md:col-span-12 h-40 rounded-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white font-h2 text-2xl">Access Global Jurisprudence</p>
              <p className="text-secondary-fixed font-body-md">Connect with peers on landmark authorities</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
