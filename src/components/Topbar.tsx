import { Bell, Settings, Search, User as UserIcon, Menu } from "lucide-react";
import { useLocation, Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";

const pageTitles: Record<string, string> = {
  "/": "Landing",
  "/dashboard": "Dashboard",
  "/product": "Product Setup",
  "/compliance": "Compliance",
  "/readiness": "Readiness Score",
  "/documents": "Documents",
  "/ai": "AI Generator",
  "/login": "Account",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? "Dashboard";
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Search - Hidden on small mobile */}
        <div className="relative hidden sm:block">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            className="text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 w-32 md:w-52 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2 border-l border-gray-100 pl-1.5 md:pl-3 ml-0.5 md:ml-0">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${
                isActive ? "text-teal-600 bg-teal-50" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full border-2 border-white" />
                {isActive && (
                  <motion.div
                    layoutId="topbar-active-bar"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 bg-teal-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${
                isActive ? "text-teal-600 bg-teal-50" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings size={16} />
                {isActive && (
                  <motion.div
                    layoutId="topbar-active-bar"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 bg-teal-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>

          {user ? (
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center cursor-pointer ml-1 shadow-sm hover:ring-4 hover:ring-teal-50 transition-all">
              {getInitials(user.full_name)}
            </div>
          ) : (
            <Link
              to="/login"
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors ml-1"
            >
              <UserIcon size={16} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
