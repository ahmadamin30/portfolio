import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ScrollRevealSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  showBeam?: boolean;
}

export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  id,
  children,
  className = '',
  delay = 0,
  showBeam = true,
}) => {
  return (
    <section id={id} className={`relative w-full ${className}`}>
      {/* Top Glowing Beam Accent Divider (expands from center when in view) */}
      {showBeam && (
        <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none flex items-center justify-center z-10">
          {/* Ambient Glow Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 1.1,
              delay: delay + 0.1,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
            className="w-full h-[6px] bg-gradient-to-r from-transparent via-sky-500/25 to-transparent blur-[4px]"
          />
          {/* Crisp Laser Core Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 1.0,
              delay: delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
            className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-sky-400/80 via-slate-200 to-transparent shadow-[0_0_10px_rgba(56,189,248,0.7)]"
          />
        </div>
      )}

      {/* Main Section Content with Smooth Interpolation & Motion Dynamics */}
      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1.0 }}
        viewport={{ once: true, amount: 0.12, margin: '-40px' }}
        transition={{
          duration: 0.85,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default ScrollRevealSection;
