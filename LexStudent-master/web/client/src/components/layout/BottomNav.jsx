import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/planner', label: 'Planner', icon: 'calendar_today' },
  { to: '/badges', label: 'Badges', icon: 'military_tech' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-white dark:bg-slate-900 border-t border-[#E0E0D0] dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,33,71,0.08)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center justify-center text-[#002147] dark:text-yellow-500 font-bold bg-[#002147]/5 dark:bg-yellow-500/10 rounded-xl px-3 py-1 scale-90 transition-transform'
              : 'flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-3 py-1 hover:text-[#002147] dark:hover:text-yellow-400 transition-colors'
          }
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
          <span className="font-sans text-[10px] font-medium tracking-tight">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
