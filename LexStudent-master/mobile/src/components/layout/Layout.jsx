import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || 'LexStudent User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'LU';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Header — matches mockup style */}
      <header className="flex justify-between items-center px-container-padding h-14 bg-background safe-top">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-secondary-container/50 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
            {initials}
          </div>
          <span className="font-h2 text-lg font-bold text-primary tracking-tight">LexScholar</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/badges')}
            className="material-symbols-outlined text-on-surface-variant p-2 rounded-full transition-colors text-xl active:bg-surface-container"
          >
            notifications
          </button>
          <button
            className="material-symbols-outlined text-on-surface-variant p-2 rounded-full transition-colors text-xl active:bg-surface-container"
          >
            search
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="scroll-area h-full px-container-padding py-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/planner" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">event_note</span>
          <span>Planner</span>
        </NavLink>
        <NavLink to="/revision" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">auto_stories</span>
          <span>Revision</span>
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">gavel</span>
          <span>Cases</span>
        </NavLink>
        <NavLink to="/badges" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">military_tech</span>
          <span>Badges</span>
        </NavLink>
      </nav>
    </div>
  );
}
