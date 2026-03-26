import { motion } from "framer-motion";
import StarBackground from "../StarBackground";

interface LifePathNumberProps {
  number: number;
}

export function LifePathNumber({ number }: LifePathNumberProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-12 overflow-hidden rounded-[2.5rem] bg-[#0c0a1d]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <StarBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-indigo-900/20" />
      </div>

      {/* Main Circle Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center"
      >
        {/* Outer Rotating Ring */}
        <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border border-fuchsia-500/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
        
        {/* Inner Glow Circle */}
        <div className="absolute inset-0 rounded-full bg-violet-500/5 blur-2xl" />
        
        {/* Decorative Mandala/Geometric SVG */}
        <svg className="absolute inset-0 w-full h-full text-violet-400/20 animate-spin-slow" style={{ animationDuration: '20s' }} viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
             <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
             <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        {/* The Number */}
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-8xl md:text-9xl font-bold text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {number}
        </motion.span>
      </motion.div>

      {/* Label */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-6 text-center"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-2">
          Số Chủ Đạo
        </h2>
        <div className="h-1 w-12 bg-gradient-to-r from-transparent via-violet-500 to-transparent mx-auto rounded-full" />
      </motion.div>
    </div>
  );
}
