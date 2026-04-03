import { LayoutDashboard, Package, ShieldCheck, Sparkles, FolderOpen, Compass, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard",          href: "/",           icon: LayoutDashboard },
  { label: "Product Setup",      href: "/product",    icon: Package },
  { label: "Compliance",         href: "/compliance", icon: ShieldCheck },
  { label: "Readiness Score",    href: "/readiness",  icon: BarChart3 },
  { label: "Documents",          href: "/documents",  icon: FolderOpen },
  { label: "AI Generator",       href: "/ai",         icon: Sparkles },
];

export default function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-100 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center shadow-sm">
          <Compass size={13} className="text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900 tracking-tight">ExportGen</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={label}
            to={href}
            end={href === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-teal-50 text-teal-700 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? "text-teal-600" : "text-gray-400"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            BS
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Barbara Sackey</p>
          </div>
        </div>
      </div>
    </aside>
  );
}