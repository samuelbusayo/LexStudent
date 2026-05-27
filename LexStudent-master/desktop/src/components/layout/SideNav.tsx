import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/revision', icon: 'auto_stories', label: 'Revision' },
  { to: '/cases', icon: 'gavel', label: 'Cases' },
  { to: '/planner', icon: 'event_note', label: 'Planner' },
  { to: '/badges', icon: 'military_tech', label: 'Badges' },
]

const bottomItems = [
  { to: '/settings', icon: 'settings', label: 'AI Settings' },
  { to: '/logout', icon: 'logout', label: 'Logout' },
]

export default function SideNav() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 flex flex-col p-gutter bg-surface-container-low shadow-sm">
      <div className="mb-stack-lg">
        <h1 className="font-h2 text-h2 font-bold text-primary mb-unit">LexScholar</h1>
        <p className="font-body-md text-on-surface-variant opacity-70">Juris Doctor Program</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-4 bg-primary text-on-primary rounded-lg px-4 py-3 scale-95 transition-transform duration-150'
                : 'flex items-center gap-4 text-on-surface-variant px-4 py-3 hover:bg-surface-variant rounded-lg transition-all'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="pt-gutter border-t border-outline-variant space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-4 bg-primary text-on-primary rounded-lg px-4 py-3 scale-95 transition-transform duration-150'
                : 'flex items-center gap-4 text-on-surface-variant px-4 py-3 hover:bg-surface-variant rounded-lg transition-all'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
