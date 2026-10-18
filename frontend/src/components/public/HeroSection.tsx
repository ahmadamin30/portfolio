import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ExternalLink, FileDown, Layers, Terminal, Sparkles } from 'lucide-react';
import { usePublicPortfolio, PortfolioLanguage } from '../../context/PublicPortfolioContext';

export const HeroSection: React.FC = () => {
  const { language, t, settings } = usePublicPortfolio();

  // Helper to extract localized field from settings with fallback
  const getField = (prefix: string, lang: PortfolioLanguage, fallback = ''): string => {
    if (!settings) return fallback;
    const key = `${prefix}${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof typeof settings;
    const val = settings[key];
    if (typeof val === 'string' && val.trim()) return val;
    const enKey = `${prefix}En` as keyof typeof settings;
    const enVal = settings[enKey];
    if (typeof enVal === 'string' && enVal.trim()) return enVal;
    return fallback;
  };

  const displayName = getField('displayName', language, '') || getField('fullName', language, 'AHMAD ALAMIN');
  const heroHeadline = getField('heroHeadline', language, '') || t('hero.defaultHeadline');
  const bio = getField('bio', language, '') || t('hero.defaultBio');
  const availability = getField('availabilityStatus', language, '') || t('hero.badge');

  const scrollToAnchor = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryAccent = settings?.primaryColor || '#38bdf8';

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-16 px-4 sm:px-8 bg-[#09090b] text-zinc-100 overflow-hidden select-none"
    >
      {/* 1. Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft center radial spotlight */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full opacity-20 blur-[130px]"
          style={{
            background: `radial-gradient(circle, ${primaryAccent} 0%, rgba(37,99,235,0.4) 40%, transparent 70%)`,
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* 2. Massive Faint Watermark Text: ADVAX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 overflow-hidden">
        <span
          className="font-extrabold text-[18vw] leading-none tracking-[0.18em] text-transparent uppercase whitespace-nowrap"
          style={{
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.035)',
          }}
        >
          ADVAX
        </span>
      </div>

      {/* 3. Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-center text-center space-y-8 sm:space-y-10">
        {/* Top Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-md text-xs font-mono tracking-wider shadow-lg shadow-black/40"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </span>
          <span className="text-zinc-300 font-semibold uppercase">{availability}</span>
        </motion.div>

        {/* Name & Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-4xl"
        >
          {/* Display Name Sub-badge or Tag */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>{displayName}</span>
            <span className="text-zinc-600">//</span>
            <span className="text-zinc-500">{settings?.siteName || 'ARCHITECTURE & SYSTEMS'}</span>
          </div>

          {/* Main Huge Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] sm:leading-[1.05]">
            {heroHeadline}
          </h1>
        </motion.div>

        {/* Narrative / Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed text-balance"
        >
          {bio}
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-2"
        >
          {/* Primary CTA: High-Contrast Pill Button */}
          <button
            type="button"
            onClick={() => scrollToAnchor('#contact')}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-white text-zinc-950 font-semibold text-sm sm:text-base hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 active:scale-95 group"
          >
            <span>{t('hero.cta.primary')}</span>
          </button>

          {/* Secondary CTA: Clean Outline Button */}
          {settings?.resumeUrl ? (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-medium text-sm sm:text-base transition-all active:scale-95 group shadow-md"
            >
              <FileDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span>{t('hero.cta.resume')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => scrollToAnchor('#projects')}
              className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-medium text-sm sm:text-base transition-all active:scale-95 group shadow-md"
            >
              <Layers className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span>{t('hero.cta.secondary')}</span>
              <ArrowDown className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}
        </motion.div>
      </div>

      {/* 4. Bottom Quick Metrics Bar (Stats Counter) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto w-full pt-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl shadow-2xl">
          {/* Stat 1: Experience */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 py-2 border-b sm:border-b-0 sm:border-r border-zinc-800/60 last:border-none">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('hero.stats.exp.value')}
            </span>
            <span className="text-xs text-zinc-400 font-medium mt-1">
              {t('hero.stats.exp.label')}
            </span>
          </div>

          {/* Stat 2: Active Projects */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 py-2 border-b sm:border-b-0 sm:border-r border-zinc-800/60 last:border-none">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-tight">
              {t('hero.stats.projects.value')}
            </span>
            <span className="text-xs text-zinc-400 font-medium mt-1">
              {t('hero.stats.projects.label')}
            </span>
          </div>

          {/* Stat 3: Precision / Architecture */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 py-2 last:border-none">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight flex items-center gap-1.5">
              <span>{t('hero.stats.precision.value')}</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </span>
            <span className="text-xs text-zinc-400 font-medium mt-1">
              {t('hero.stats.precision.label')}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
