const navItems = [
  { label: "Dashboard", href: "#" },
  { label: "Product Setup", href: "#" },
  { label: "Compliance", href: "#" },
  { label: "Trade Agreements", href: "#" },
  { label: "Document Management", href: "#" },
  { label: "AI Generator", href: "#" },
];

export default function Sidebar() {
  return (
    <aside className="w-52 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-5 text-lg font-semibold text-blue-700">
        ExportGen
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
