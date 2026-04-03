import { Bell, Settings, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/':           'Dashboard',
  '/product':    'Product Setup',
  '/compliance': 'Compliance',
  '/readiness':  'Readiness Score',
  '/documents':  'Documents',
  '/ai':         'AI Generator',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Dashboard';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-teal-300 transition bg-gray-50 placeholder-gray-400"
          />
        </div>

        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={15} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full" />
        </button>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Settings size={15} className="text-gray-500" />
        </button>

        <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer ml-1">
          BS
        </div>
      </div>
    </header>
  );
}