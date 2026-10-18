import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AdvaxPreloaderProps {
  forceShow?: boolean;
  onComplete?: () => void;
  onRevealStart?: () => void;
}

export const AdvaxPreloader: React.FC<AdvaxPreloaderProps> = ({
  forceShow = false,
  onComplete,
  onRevealStart,
}) => {
  const [shouldRender] = useState<boolean>(() => {
    if (forceShow) return true;
    try {
      return sessionStorage.getItem('hasSeenAdvaxPreloader') !== 'true';
    } catch {
      return true;
    }
  });

  // Phases: 'beam' (0s - 2.2s) -> 'reveal' (2.2s - 3.2s) -> 'finished'
  const [phase, setPhase] = useState<'beam' | 'reveal' | 'finished'>('beam');

  useEffect(() => {
    if (!shouldRender) {
      onComplete?.();
      return;
    }

    // Lock body scrolling while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Transition from Phase 1 (Center Beam Scan) to Phase 2 (Split-Shutter Reveal) after 2.2s
    const timer = setTimeout(() => {
      setPhase('reveal');
      onRevealStart?.();
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRender, onComplete, onRevealStart]);

  const handleRevealComplete = () => {
    try {
      sessionStorage.setItem('hasSeenAdvaxPreloader', 'true');
    } catch {
      // Ignore storage errors
    }
    document.body.style.overflow = '';
    setPhase('finished');
    onComplete?.();
  };

  if (!shouldRender || phase === 'finished') {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-[9999] overflow-hidden select-none ${
          phase === 'reveal' ? 'pointer-events-none' : ''
        }`}
        aria-hidden="true"
      >
        {/* TOP SHUTTER (Top half curtain: top-0 h-1/2 w-full) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-[#0a0a0c] z-20 flex flex-col justify-end"
          initial={{ y: 0 }}
          animate={phase === 'reveal' ? { y: '-100%' } : { y: 0 }}
          transition={{
            duration: 1.0,
            ease: [0.77, 0, 0.175, 1],
          }}
        >
          {/* Subtle razor-sharp seam edge at the bottom of the top shutter */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        </motion.div>

        {/* BOTTOM SHUTTER (Bottom half curtain: bottom-0 h-1/2 w-full) */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-[#0a0a0c] z-20 flex flex-col justify-start"
          initial={{ y: 0 }}
          animate={phase === 'reveal' ? { y: '100%' } : { y: 0 }}
          transition={{
            duration: 1.0,
            ease: [0.77, 0, 0.175, 1],
          }}
          onAnimationComplete={() => {
            if (phase === 'reveal') {
              handleRevealComplete();
            }
          }}
        >
          {/* Subtle razor-sharp seam edge at the top of the bottom shutter */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        </motion.div>

        {/* CENTER HORIZONTAL LASER BEAM & CRT SCANNING LAYERS (z-30) */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
          {/* Main animated beam wrapper */}
          <motion.div
            className="w-full relative flex items-center justify-center"
            initial={{ opacity: 1, scaleY: 1 }}
            animate={
              phase === 'reveal'
                ? {
                    opacity: 0,
                    scaleY: 6,
                    transition: { duration: 0.55, ease: 'easeOut' },
                  }
                : {
                    opacity: 1,
                    scaleY: 1,
                  }
            }
          >
            {/* 1. Diffuse Ambient Glow */}
            <motion.div
              className="absolute w-full h-[10px] bg-gradient-to-r from-transparent via-sky-400/40 via-blue-600/35 to-transparent blur-[6px]"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: [0, 1, 0.98, 1.02, 0.99, 1],
                opacity: [0, 0.9, 0.75, 1, 0.85, 1],
              }}
              transition={{
                duration: 2.1,
                times: [0, 0.25, 0.45, 0.7, 0.85, 1],
                ease: 'easeInOut',
              }}
            />

            {/* 2. Soft Overlapping Cyan/Blue Layer (bg-sky-400/80 & bg-blue-600/60) */}
            <motion.div
              className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-sky-400/80 via-blue-600/60 to-transparent blur-[1.5px]"
              initial={{ scaleX: 0, x: 0 }}
              animate={{
                scaleX: [0, 1.05, 0.97, 1.03, 0.98, 1],
                x: [-15, 25, -15, 15, -8, 0],
              }}
              transition={{
                duration: 2.15,
                times: [0, 0.25, 0.45, 0.65, 0.85, 1],
                ease: 'easeInOut',
              }}
            />

            {/* 3. Sharp High-Contrast Center Slit Core (bg-slate-300 / white / cyan core) */}
            <motion.div
              className="relative w-full h-[1.5px] bg-gradient-to-r from-transparent via-slate-300 via-white to-transparent shadow-[0_0_12px_rgba(56,189,248,0.95),0_0_24px_rgba(37,99,235,0.7)]"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: [0, 1, 0.99, 1, 0.995, 1],
                opacity: [0, 1, 0.85, 1, 0.9, 1, 0.95, 1],
              }}
              transition={{
                duration: 2.18,
                times: [0, 0.2, 0.4, 0.55, 0.7, 0.8, 0.9, 1],
                ease: 'easeOut',
              }}
            />

            {/* 4. Scanning Aperture Pulse Packets */}
            <motion.div
              className="absolute w-44 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#38bdf8]"
              initial={{ x: '-150%', opacity: 0 }}
              animate={{
                x: ['-150%', '150%'],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.7,
                repeat: 2,
                delay: 0.25,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AdvaxPreloader;
