import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || 'LexStudent User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'LU';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 h-16 bg-white border-b border-outline-variant/30 safe-top">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl font-bold">gavel</span>
          <span className="font-serif text-lg font-bold text-primary tracking-tight">LexScholar</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/badges')}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors text-xl"
          >
            military_tech
          </button>
          <button 
            onClick={() => navigate('/logout')}
            className="w-8 h-8 rounded-full bg-primary-container text-white text-xs font-bold flex items-center justify-center border border-outline-variant/30 cursor-pointer"
            title="Sign Out"
          >
            {initials}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="scroll-area h-full px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item \${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/planner" className={({ isActive }) => `bottom-nav-item \${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">calendar_today</span>
          <span>Planner</span>
        </NavLink>
        <NavLink to="/revision" className={({ isActive }) => `bottom-nav-item \${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">psychology</span>
          <span>Revision</span>
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `bottom-nav-item \${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">gavel</span>
          <span>Cases</span>
        </NavLink>
        <NavLink to="/badges" className={({ isActive }) => `bottom-nav-item \${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined text-xl">military_tech</span>
          <span>Badges</span>
        </NavLink>
      </nav>
    </div>
  );
}
