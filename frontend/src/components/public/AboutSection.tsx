import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Sparkles, FileDown, ArrowUpRight } from 'lucide-react';
import { usePublicPortfolio, PortfolioLanguage } from '../../context/PublicPortfolioContext';
import ScrollRevealSection from './ScrollRevealSection';

export const AboutSection: React.FC = () => {
  const { language, t, settings } = usePublicPortfolio();
  const defaultPhoto = '/ahmad-alamin.jpg';
  const [imgSrc, setImgSrc] = useState<string>(() => {
    return settings?.avatarUrl || settings?.profilePhotoUrl || defaultPhoto;
  });

  useEffect(() => {
    if (settings?.avatarUrl || settings?.profilePhotoUrl) {
      setImgSrc(settings.avatarUrl || settings.profilePhotoUrl || defaultPhoto);
    }
  }, [settings?.avatarUrl, settings?.profilePhotoUrl]);

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

  const badgeText = getField('aboutBadge', language, '') || t('about.badge');
  const headingText = getField('aboutHeadline', language, '') || t('about.heading');
  const paragraph1 = getField('aboutText', language, '') || t('about.p1');
  const paragraph2 = getField('aboutParagraph2', language, '') || t('about.p2');
  const roleBadge = getField('jobTitle', language, '') || t('about.roleBadge');

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ScrollRevealSection id="about" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column (LTR) / Right Column (RTL): Developer Portrait */}
        <div className="lg:col-span-5 relative">
          {/* Ambient Glow Backdrop */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-blue-600/10 to-transparent blur-xl opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />

          {/* Portrait Container */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900/60 shadow-2xl group">
            <img
              src={imgSrc}
              onError={() => setImgSrc(defaultPhoto)}
              alt="Ahmad Alamin - Computer Engineer"
              className="w-full h-[400px] sm:h-[480px] lg:h-[510px] object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
              loading="lazy"
            />

            {/* Subtle Gradient Overlay at the Bottom for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent pointer-events-none" />

            {/* Floating Tech Badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto px-4 py-2.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800/90 text-xs font-mono text-zinc-300 shadow-xl flex items-center gap-2.5 pointer-events-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500 shadow-[0_0_8px_#0ea5e9]" />
              </span>
              <span className="font-semibold text-zinc-200">{roleBadge}</span>
            </div>
          </div>
        </div>

        {/* Right Column (LTR) / Left Column (RTL): Narrative & Story */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/90 text-xs font-mono text-sky-400 tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>

          {/* Big Display Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {headingText}
          </h2>

          {/* Narrative Paragraphs */}
          <div className="space-y-4 text-zinc-400 text-base sm:text-lg leading-relaxed">
            <p>{paragraph1}</p>
            {paragraph2 && <p>{paragraph2}</p>}
          </div>

          {/* 3-Pill Feature Highlights Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {/* Pill 1: Architecture */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all flex flex-col gap-1.5 group">
              <div className="flex items-center gap-2 text-sky-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
                  {t('about.feat.arch')}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 leading-tight">
                {t('about.feat.archDesc')}
              </span>
            </div>

            {/* Pill 2: Performance */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all flex flex-col gap-1.5 group">
              <div className="flex items-center gap-2 text-indigo-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
                  {t('about.feat.perf')}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 leading-tight">
                {t('about.feat.perfDesc')}
              </span>
            </div>

            {/* Pill 3: Precision */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all flex flex-col gap-1.5 group">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
                  {t('about.feat.prec')}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 leading-tight">
                {t('about.feat.precDesc')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={scrollToContact}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
            >
              <span>{t('about.cta.connect')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {settings?.resumeUrl ? (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 font-medium text-xs sm:text-sm transition-all active:scale-95"
              >
                <FileDown className="w-4 h-4 text-zinc-400" />
                <span>{t('about.cta.resume')}</span>
              </a>
            ) : (
              <a
                href="/cv.pdf"
                download="Ahmad_Alamin_CV.pdf"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 font-medium text-xs sm:text-sm transition-all active:scale-95"
              >
                <FileDown className="w-4 h-4 text-zinc-400" />
                <span>{t('about.cta.resume')}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  );
};

export default AboutSection;
