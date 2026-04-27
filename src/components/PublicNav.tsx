import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Compass, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PublicNav() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Profile", href: "/profile" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="relative z-30 flex items-center justify-between px-6 md:px-16 py-8">
      <div
        className="flex items-center gap-2 group cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all">
          <Compass size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          Expogen
        </span>
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
      <button
        className="md:hidden text-white/60 hover:text-white z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-teal-950 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-xl font-bold uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-white" : "text-white/40 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="mt-4 px-10 py-3 rounded-full border border-white/30 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all"
            >
              Sign Up
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
