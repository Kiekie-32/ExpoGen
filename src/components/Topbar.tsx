import {Bell, Settings} from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center">
          BS
        </div>
        <div className='w-8 h-8 rounded-full flex items-center justify-center'>
          <Settings size={20} className='bg-transparent'></Settings>
        </div>
                <div className='w-8 h-8 rounded-full flex items-center justify-center'>
          <Bell size={20} className='bg-transparent'></Bell>
        </div>
      </div>
    </header>
  );
}
