import { Outlet } from "react-router-dom";
import PublicNav from "./PublicNav";
import { motion } from "motion/react";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-hidden relative font-sans">
      {/* Shared Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-750 to-teal-900 pointer-events-none" />
      
      {/* Shared Abstract Wavy Lines */}
      <div className="absolute right-0 bottom-0 w-full h-full opacity-50 pointer-events-none overflow-hidden select-none">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover translate-x-1/4 translate-y-1/4 scale-125"
          preserveAspectRatio="none"
        >
          {[...Array(40)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${-100 + i * 20} 600 Q ${200 + i * 10} ${400 - i * 10}, ${400 + i * 20} 300 T ${800 + i * 10} 0`}
              fill="none"
              stroke={`url(#gradient-${i % 3})`}
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 0.7,
                d: [
                  `M ${-200 + i * 15} 600 Q ${200 + i * 10} ${350 - i * 6}, ${500 + i * 10} 250 T ${900 + i * 5} 0`,
                  `M ${-200 + i * 15} 600 Q ${250 + i * 10} ${350 - i * 6}, ${500 + i * 10} 250 T ${900 + i * 5} 0`,
                  `M ${-200 + i * 15} 600 Q ${200 + i * 10} ${350 - i * 6}, ${500 + i * 10} 250 T ${900 + i * 5} 0`,
                ],
              }}
              transition={{
                duration: 10 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
          <defs>
            <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4b2b" />
              <stop offset="100%" stopColor="#ff416c" />
            </linearGradient>
            <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <PublicNav />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
