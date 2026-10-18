import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';
import { FogBackground } from '@/components/ui/fog-background';

interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

const SineWaveCanvas: React.FC<{ isRtl: boolean }> = ({ isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    const mouse: MouseState = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      mouse.targetY = (e.clientY - rect.top) * (window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const linesCount = 10;

    const render = () => {
      time += 0.01;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const centerY = height * 0.52;
      const mouseOffsetY = (mouse.y - centerY) * 0.3;
      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < linesCount; i++) {
        const progress = i / (linesCount - 1);
        const lineOffset = (progress - 0.5) * 220 * dpr;

        ctx.beginPath();
        const baseAmp = (50 + progress * 50) * dpr;
        const freq1 = (0.0014 + progress * 0.0005) / dpr;
        const freq2 = (0.0024 + progress * 0.0007) / dpr;
        const speed = time * (0.7 + progress * 0.35);

        const grad = ctx.createLinearGradient(0, 0, width, height);
        const alpha = 0.07 + Math.sin(progress * Math.PI) * 0.10;

        if (isDark) {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.01)');
          grad.addColorStop(0.3, `rgba(14, 165, 233, ${alpha * 0.5})`);
          grad.addColorStop(0.65, `rgba(255, 255, 255, ${alpha * 0.85})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
        } else {
          grad.addColorStop(0, 'rgba(15, 23, 42, 0.01)');
          grad.addColorStop(0.3, `rgba(2, 132, 199, ${alpha * 0.7})`);
          grad.addColorStop(0.65, `rgba(15, 23, 42, ${alpha * 0.75})`);
          grad.addColorStop(1, 'rgba(15, 23, 42, 0.01)');
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = (1.1 + progress * 0.6) * dpr;

        const step = 8 * dpr;
        for (let x = 0; x <= width + step; x += step) {
          const distToMouse = Math.abs(x - mouse.x);
          const mouseInfluence =
            Math.exp(-Math.pow(distToMouse / (280 * dpr), 2)) * mouseOffsetY * 0.75;

          const wave1 = Math.sin(x * freq1 + speed + progress * 2) * baseAmp;
          const wave2 = Math.cos(x * freq2 - speed * 0.65) * (baseAmp * 0.4);
          const y = centerY + lineOffset + wave1 + wave2 + mouseInfluence;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRtl]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block opacity-[0.20] dark:opacity-[0.14] pointer-events-none transition-opacity duration-300"
      style={{ touchAction: 'none' }}
    />
  );
};

export const HeroSection: React.FC = () => {
  const { language, dir } = usePublicPortfolio();
  const isRtl = dir === 'rtl';

  const copy = useMemo(() => {
    if (language === 'ar') {
      return {
        headline: 'CRAFT & CODE',
        signature: 'أحمد الأمين',
        intro:
          'مرحباً بك، أنا أحمد. مهندس حاسوب وبرمجيات، شغوف بتحويل الخوارزميات والمنطق المعقد إلى كود أنيق، أنظمة سحابية قابلة للتوسع، وتجارب رقمية استثنائية. أهلاً بك في مساحتي.',
        edition: 'ADVAX // 2026 EDITION',
      };
    }
    if (language === 'tr') {
      return {
        headline: 'CRAFT & CODE',
        signature: 'Ahmad Alamin',
        intro:
          'Merhaba, ben Ahmad. Karmaşık mantığı zarif koda, ölçeklenebilir sistemlere ve sezgisel dijital deneyimlere dönüştürme tutkusuna sahip bir yazılım ve bilgisayar mühendisiyim. Dünyama hoş geldiniz.',
        edition: 'ADVAX // 2026 EDITION',
      };
    }
    return {
      headline: 'CRAFT & CODE',
      signature: 'Ahmad Alamin',
      intro:
        "Hey there, I'm Ahmad. A software and computer engineer passionate about turning complex logic into elegant code, scalable systems, and intuitive digital experiences. Welcome to my space.",
      edition: 'ADVAX // 2026 EDITION',
    };
  }, [language]);

  return (
    <section
      id="hero"
      className="min-h-screen w-full relative flex flex-col justify-between p-8 sm:p-14 lg:p-20 pb-32 sm:pb-36 overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100 select-none transition-colors duration-300"
    >
      {/* Fluid Atmospheric Fog & Film Grain Ambient Layer */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
        <FogBackground className="w-full h-full" />
      </div>

      {/* Seamless Bottom Gradient Fade into Page Background */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-b from-transparent via-zinc-50/60 to-zinc-50 dark:via-[#09090b]/60 dark:to-[#09090b] pointer-events-none z-10" />

      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03] dark:opacity-[0.04] blur-[150px] bg-sky-500" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.02] dark:opacity-[0.03] blur-[130px] bg-blue-600" />
      </div>

      {/* Full-Cover Ambient Sine Wave Canvas Mesh */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <SineWaveCanvas isRtl={isRtl} />
      </div>

      {/* TOP-LEFT TYPOGRAPHY (Foreground z-10) */}
      <div className="relative z-10 pt-4 sm:pt-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif text-zinc-900 dark:text-zinc-100 uppercase tracking-tight font-editorial leading-[0.92] drop-shadow-sm">
            {copy.headline}
          </h1>
        </motion.div>
      </div>

      {/* BOTTOM-LEFT IDENTITY & WELCOME NOTE (Foreground z-10) */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg"
        >
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2.5 font-sans">
            {copy.signature}
          </div>
          <div className="border-l rtl:border-l-0 rtl:border-r border-zinc-300 dark:border-zinc-700/80 pl-4 rtl:pl-0 rtl:pr-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
            <p>{copy.intro}</p>
          </div>
        </motion.div>
      </div>

      {/* FAR-RIGHT VERTICAL ACCENT */}
      <div
        className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${
          isRtl ? 'left-6 lg:left-10 right-auto' : 'right-6 lg:right-10 left-auto'
        } z-20 flex-col items-center gap-3 pointer-events-none select-none`}
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
        <span className="[writing-mode:vertical-rl] tracking-[0.3em] text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase">
          {copy.edition}
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
