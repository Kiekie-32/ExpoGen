import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between overflow-hidden relative">
      {/* Background ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950 pointer-events-none" />

      {/* Stars / light particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top: ExpoGen Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center pt-16 md:pt-24"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Compass size={24} className="text-white" />
          </div>
        </div>
        <h1
          className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #5eead4 50%, #0d9488 100%)',
            fontFamily: "'Georgia', serif",
            letterSpacing: '-0.04em',
          }}
        >
          ExpoGen
        </h1>
        <p className="text-teal-300/70 text-sm md:text-base font-medium tracking-widest uppercase mt-3 letter-spacing-widest">
          Export Intelligence Platform
        </p>
      </motion.div>

      {/* Middle: Animated Ship on Sea */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative z-10 w-full flex flex-col items-center"
        style={{ perspective: '800px' }}
      >
        {/* Scene container */}
        <div className="relative w-full max-w-2xl mx-auto h-64 md:h-80">
          {/* Moon / glow */}
          <div
            className="absolute top-4 right-16 w-14 h-14 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 30%, rgba(94,234,212,0.2) 70%, transparent 100%)',
              boxShadow: '0 0 40px 10px rgba(94,234,212,0.15)',
            }}
          />

          {/* Horizon glow */}
          <div
            className="absolute bottom-16 left-0 right-0 h-8"
            style={{
              background: 'linear-gradient(to top, rgba(13,148,136,0.3), transparent)',
              filter: 'blur(8px)',
            }}
          />

          {/* Water surface */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            {/* Wave layers */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-[200%]"
                style={{
                  bottom: `${i * 6}px`,
                  left: '-50%',
                  height: '24px',
                  opacity: 1 - i * 0.2,
                  animation: `wave ${3 + i * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * -1.2}s`,
                  background: `linear-gradient(to bottom, 
                    rgba(${i === 0 ? '13,148,136' : i === 1 ? '15,118,110' : '17,94,89'},${0.8 - i * 0.15}) 0%, 
                    rgba(2,44,34,0.9) 100%)`,
                  borderRadius: '50% 50% 0 0 / 8px 8px 0 0',
                  transform: 'scaleX(1)',
                }}
              />
            ))}

            {/* Water reflection shimmer */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={`shimmer-${i}`}
                className="absolute"
                style={{
                  bottom: `${8 + i * 3}px`,
                  left: `${15 + i * 18}%`,
                  width: `${30 + i * 10}px`,
                  height: '2px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '9999px',
                  animation: `shimmer ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Ship — floats and sails across */}
          <motion.div
            animate={{ x: ['0%', '5%', '0%', '-5%', '0%'], y: [0, -6, -3, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute"
            style={{ bottom: '52px', left: '50%', transform: 'translateX(-50%)' }}
          >
            <svg
              width="200"
              height="120"
              viewBox="0 0 200 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main mast */}
              <line x1="100" y1="80" x2="100" y2="10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

              {/* Crow's nest */}
              <rect x="93" y="18" width="14" height="6" rx="2" fill="#94a3b8" />

              {/* Main sail */}
              <motion.path
                d="M100 14 C90 30, 65 45, 62 65 L100 65 Z"
                fill="rgba(255,255,255,0.92)"
                stroke="rgba(203,213,225,0.5)"
                strokeWidth="1"
                animate={{ d: [
                  "M100 14 C90 30, 65 45, 62 65 L100 65 Z",
                  "M100 14 C88 28, 60 43, 58 65 L100 65 Z",
                  "M100 14 C90 30, 65 45, 62 65 L100 65 Z",
                ]}}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Secondary sail */}
              <motion.path
                d="M100 20 C110 34, 130 47, 132 65 L100 65 Z"
                fill="rgba(94,234,212,0.25)"
                stroke="rgba(94,234,212,0.4)"
                strokeWidth="1"
                animate={{ d: [
                  "M100 20 C110 34, 130 47, 132 65 L100 65 Z",
                  "M100 20 C112 32, 133 45, 135 65 L100 65 Z",
                  "M100 20 C110 34, 130 47, 132 65 L100 65 Z",
                ]}}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />

              {/* Flag */}
              <motion.path
                d="M100 10 L118 16 L100 22 Z"
                fill="#0d9488"
                animate={{ d: [
                  "M100 10 L118 16 L100 22 Z",
                  "M100 10 L122 15 L100 20 Z",
                  "M100 10 L118 16 L100 22 Z",
                ]}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Hull */}
              <path
                d="M42 78 Q60 82, 100 82 Q140 82, 158 78 L150 95 Q125 100, 100 100 Q75 100, 50 95 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Hull accent stripe */}
              <path
                d="M50 84 Q100 87, 150 84"
                stroke="#0d9488"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
              {/* Deck */}
              <rect x="55" y="74" width="90" height="8" rx="2" fill="#334155" />
              {/* Bridge / cabin */}
              <rect x="85" y="64" width="30" height="12" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <rect x="89" y="67" width="8" height="6" rx="1" fill="rgba(94,234,212,0.4)" />
              <rect x="103" y="67" width="8" height="6" rx="1" fill="rgba(94,234,212,0.3)" />

              {/* Porthole lights */}
              {[70, 90, 120].map((x, i) => (
                <circle key={i} cx={x} cy="88" r="3" fill="rgba(94,234,212,0.5)" />
              ))}

              {/* Anchor chain */}
              <line x1="65" y1="90" x2="63" y2="100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2,2" />

              {/* Wake / foam */}
              <motion.path
                d="M50 98 Q60 102, 42 98"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path
                d="M150 98 Q160 102, 158 98"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* Distant horizon silhouette */}
          <div
            className="absolute"
            style={{
              bottom: '72px',
              left: '5%',
              width: '25%',
              height: '20px',
              background: 'rgba(15,23,42,0.7)',
              borderRadius: '50% 50% 0 0',
              filter: 'blur(2px)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '70px',
              right: '8%',
              width: '18%',
              height: '16px',
              background: 'rgba(15,23,42,0.6)',
              borderRadius: '50% 50% 0 0',
              filter: 'blur(2px)',
            }}
          />
        </div>

        {/* Subtle tagline under ship */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-teal-400/50 text-xs tracking-widest uppercase mt-2"
        >
          Navigate global trade with confidence
        </motion.p>
      </motion.div>

      {/* Bottom: CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 flex flex-col items-center pb-16 md:pb-20 gap-4"
      >
        <button
          onClick={() => navigate('/login')}
          className="group flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-teal-500/30 transition-all hover:shadow-teal-400/40 hover:scale-105 active:scale-95"
        >
          Start Today
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-slate-500 text-xs">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
            Sign in
          </button>
        </p>
      </motion.div>

      {/* Animation keyframes injected via style tag */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-4%) scaleY(1.05); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.15; transform: scaleX(1); }
          50% { opacity: 0.5; transform: scaleX(1.3); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}