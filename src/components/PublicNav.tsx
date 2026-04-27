import { useNavigate, NavLink } from "react-router-dom";
import { Compass, Menu } from "lucide-react";
import { motion } from "motion/react";

export default function PublicNav() {
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Profile", href: "/profile" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 py-8">
      <div 
        className="flex items-center gap-2 group cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all">
          <Compass size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Expogen</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              `relative py-2 transition-colors ${
                isActive ? "text-white" : "text-white/60 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="hidden md:block">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-full border border-white/30 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all text-white"
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white/60 hover:text-white">
        <Menu size={24} />
      </button>
    </nav>
  );
}
