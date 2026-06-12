import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopAppBar() {
  const { user } = useAuth();
  const displayName = user?.name || 'LexStudent User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'LU';
  const program = user?.program || 'Bar Part II';
  const campus = user?.campus || 'Lagos Campus';

  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 docked full-width top-0 sticky z-40 bg-surface dark:bg-surface border-b border-outline-variant dark:border-outline">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary"
            placeholder="Search case law, statutes, or courses..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-gutter">
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">help</button>
        <Link to="/profile" className="flex items-center gap-3 ml-4 hover:opacity-80 transition-opacity">
          <div className="text-right hidden lg:block">
            <p className="font-body-md font-bold text-primary">{displayName}</p>
            <p className="text-xs text-on-surface-variant">{program} &bull; {campus}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container border border-outline-variant flex items-center justify-center text-white text-sm font-bold">{initials}</div>
        </Link>
      </div>
    </header>
  );
}
