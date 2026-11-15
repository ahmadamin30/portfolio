import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { usePublicPortfolio, type PortfolioLanguage } from '../../context/PublicPortfolioContext';
import { FogBackground } from '@/components/ui/fog-background';

interface HeroCopy {
  name: string;
  role: string;
  statement: string;
  location: string;
}

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.12,
    },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: EASE_EDITORIAL,
    },
  },
};

export const HeroSection: React.FC = () => {
  const { language, dir, settings } = usePublicPortfolio();
  const [currentTime, setCurrentTime] = useState<string>('');

  // Parallax depth transforms as AboutSection slides up to cover the sticky Hero
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 650], [1, 0.15]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 700], [0, -32]);

  // Live real-time clock (e.g. "10:00 PM")
  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Europe/Istanbul',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copy = useMemo<HeroCopy>(() => {
    const getLocalized = (
      prefix: 'displayName' | 'location' | 'bio',
      lang: PortfolioLanguage
    ): string => {
      if (!settings) return '';
      const suffix = lang === 'ar' ? 'Ar' : lang === 'tr' ? 'Tr' : 'En';
      const key = `${prefix}${suffix}` as keyof typeof settings;
      const value = settings[key];
      return typeof value === 'string' && value.trim().length > 0 ? value.trim() : '';
    };

    const customName = getLocalized('displayName', language);
    const customLocation = getLocalized('location', language);

    if (language === 'ar') {
      return {
        name: customName || 'أحمد الأمين',
        role: 'SOFTWARE ENGINEER | ADVAX',
        statement:
          'شغوف بهندسة النظم السحابية القابلة للتوسع، وتحويل المنطق البرمجي المعقد إلى برمجيات فائقة الدقة والأداء وتجارب رقمية ذات أثر عالمي.',
        location: customLocation || 'إسطنبول، تركيا',
      };
    }

    if (language === 'tr') {
      return {
        name: customName || 'AHMAD ALAMIN',
        role: 'SOFTWARE ENGINEER | ADVAX',
        statement:
          'ÖLÇEKLENEBİLİR SİSTEMLER VE ZARİF KOD MİMARİSİ TUTKUSUYLA, KARMAŞIK MANTIĞI YÜKSEK HASSASİYETLİ DİJİTAL DENEYİMLERE DÖNÜŞTÜRÜYOR.',
        location: customLocation || 'İSTANBUL, TR',
      };
    }

    return {
      name: customName ? customName.toUpperCase() : 'AHMAD ALAMIN',
      role: 'SOFTWARE ENGINEER | ADVAX',
      statement:
        'PASSIONATE ABOUT SCALABLE SYSTEMS ARCHITECTURE, HIGH-CONCURRENCY RUNTIMES, AND TRANSFORMING COMPLEX LOGIC INTO MINIMALIST, HIGH-IMPACT DIGITAL EXPERIENCES.',
      location: customLocation ? customLocation.toUpperCase() : 'ISTANBUL, TR',
    };
  }, [language, settings]);

  const year = new Date().getFullYear();

  return (
    <section
      id="hero"
      dir={dir}
      aria-label="Hero Introduction"
      className="sticky top-0 z-0 flex flex-col items-center justify-between w-full h-screen overflow-hidden bg-zinc-50 dark:bg-[#09090b] px-6 sm:px-12 lg:px-20 py-16 sm:py-24 text-zinc-900 dark:text-zinc-100 select-none transition-colors duration-300"
    >
      {/* Atmosphere 1: Soft Ambient Fog Canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full opacity-60 dark:opacity-75 pointer-events-none overflow-hidden"
      >
        <FogBackground className="w-full h-full" />
      </div>

      {/* Atmosphere 2: Ambient Center Radial Glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] rounded-full opacity-[0.035] blur-[160px] bg-sky-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] rounded-full opacity-[0.025] blur-[140px] bg-indigo-500" />
      </div>

      {/* Atmosphere 3: Subtle Film Grain Noise Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full opacity-[0.12] dark:opacity-[0.16] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='heroNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23heroNoiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Parallax Foreground Wrapper */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-20 flex flex-col items-center justify-between flex-1 w-full"
      >
        {/* Top Spacer for true vertical centering */}
        <div className="w-full h-4 sm:h-8" aria-hidden="true" />

        {/* CENTERPIECE: Editorial Horizontal Single Line [NAME — LINE — ROLE] */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 my-auto w-full max-w-5xl px-4 text-center"
        >
          {/* Name */}
          <motion.span
            variants={fadeVariants}
            className="text-xs sm:text-[13px] md:text-sm font-mono uppercase tracking-[0.28em] sm:tracking-[0.32em] text-zinc-900 dark:text-zinc-100 whitespace-nowrap font-medium"
          >
            {copy.name}
          </motion.span>

          {/* Thin Minimal Center Divider Line */}
          <motion.span
            variants={fadeVariants}
            aria-hidden="true"
            className="hidden md:block h-[1px] w-24 bg-zinc-900/30 dark:bg-white/20 shrink-0"
          />

          {/* Small Horizontal Pip for Mobile */}
          <motion.span
            variants={fadeVariants}
            aria-hidden="true"
            className="block md:hidden h-[1px] w-12 bg-zinc-900/30 dark:bg-white/20"
          />

          {/* Role & Brand */}
          <motion.span
            variants={fadeVariants}
            className="text-xs sm:text-[13px] md:text-sm font-mono uppercase tracking-[0.24em] sm:tracking-[0.28em] text-zinc-600 dark:text-zinc-400 whitespace-nowrap"
          >
            {copy.role}
          </motion.span>
        </motion.div>

        {/* BOTTOM FOOTER: Hyper-Minimal Paragraph + Live Clock & Location */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-xl mx-auto space-y-4 px-4 pt-10"
        >
          {/* Multi-line statement */}
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.20em] sm:tracking-[0.22em] leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-lg">
            {copy.statement}
          </p>

          {/* Copyright, Location & Live Time */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-500">
            <span>&copy;{year}</span>
            <span className="opacity-40">•</span>
            <span>{copy.location}</span>
            <span className="opacity-40">•</span>
            <span className="tabular-nums font-semibold text-zinc-900 dark:text-zinc-300">{currentTime || '10:00 PM'}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
