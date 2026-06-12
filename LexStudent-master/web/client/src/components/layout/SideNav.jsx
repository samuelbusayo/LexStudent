import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "dashboard", label: "Dashboard" },
  { to: "/revision", icon: "auto_stories", label: "Revision" },
  { to: "/planner", icon: "event_note", label: "Planner" },
  { to: "/badges", icon: "military_tech", label: "Badges" },
];

const bottomItems = [
  { to: "/profile", icon: "person", label: "Profile" },
  { to: "/settings", icon: "settings", label: "Settings" },
  { to: "/logout", icon: "logout", label: "Logout" },
];

export default function SideNav() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 flex flex-col h-full p-gutter bg-surface-container-low dark:bg-surface-container shadow-sm">
      <div className="mb-stack-lg">
        <h1 className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed mb-unit">LexStudent</h1>
        <p className="font-body-md text-on-surface-variant opacity-70">Bar Part II</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-4 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed rounded-lg px-4 py-3 scale-95 transition-transform duration-150"
                : "flex items-center gap-4 text-on-surface-variant dark:text-outline-variant px-4 py-3 hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-lg transition-all"
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
                ? "flex items-center gap-4 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed rounded-lg px-4 py-3 scale-95 transition-transform duration-150"
                : "flex items-center gap-4 text-on-surface-variant dark:text-outline-variant px-4 py-3 hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-lg transition-all"
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
