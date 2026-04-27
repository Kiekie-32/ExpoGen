import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Sparkles,
  FolderOpen,
  Compass,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const search = location.search; // Includes ?id=...&hs_code=...
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Product Setup", href: `/product${search}`, icon: Package },
    { label: "Compliance", href: `/compliance${search}`, icon: ShieldCheck },
    { label: "Readiness Score", href: `/readiness${search}`, icon: BarChart3 },
    { label: "Documents", href: `/documents${search}`, icon: FolderOpen },
    { label: "AI Generator", href: `/ai${search}`, icon: Sparkles },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Compass size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900 tracking-tight">
              ExportGen
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-2 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={label}
              to={href}
              end={href === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-50 text-teal-700 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.1)]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? "text-teal-600" : "text-gray-400"}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
          {user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {getInitials(user.full_name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {user.full_name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {user.business_name || "Exporter"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Compass size={16} className="text-gray-400" />
              </div>
              <p className="text-xs font-medium text-gray-500">Not logged in</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
