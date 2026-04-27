import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center px-8 md:px-16 mt-20 md:mt-32 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4">
          Background
        </h2>
        <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-8 leading-[1.1]">
          ExpoGen <br />
          <span className="font-medium text-4xl md:text-6xl text-white/90 block mt-2">
            Export Intelligence Platform
          </span>
        </h1>

        <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed mb-12">
          ExpoGen is the ultimate intelligence platform for global trade.
          Simplify compliance, automate documentation, and scale your export
          business with AI-powered insights.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-10 py-3 rounded-full border border-white/30 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Start Export
        </motion.button>
      </motion.div>
    </div>
  );
}
