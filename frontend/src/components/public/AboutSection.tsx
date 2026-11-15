import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Sparkles,
  FileDown,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import {
  usePublicPortfolio,
  type PortfolioLanguage,
} from '../../context/PublicPortfolioContext';

interface FeatureHighlight {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  iconColorClass: string;
}

interface SectionCopyItem {
  badgeAr?: string;
  badgeEn?: string;
  badgeTr?: string;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  subtitleTr?: string;
}

const DEFAULT_PORTRAIT = '/ahmad-alamin.jpg';
const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const lineRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE_EDITORIAL,
    },
  },
};

export const AboutSection: React.FC = () => {
  const { language, dir, t, settings } = usePublicPortfolio();
  const isRtl = dir === 'rtl';
  const sectionRef = useRef<HTMLElement | null>(null);

  // Subtle internal parallax as AboutSection slides up over the sticky Hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const portraitParallaxY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  const [imgSrc, setImgSrc] = useState<string>(() => {
    return settings?.avatarUrl || settings?.profilePhotoUrl || DEFAULT_PORTRAIT;
  });

  useEffect(() => {
    const resolvedPhoto = settings?.avatarUrl || settings?.profilePhotoUrl;
    if (resolvedPhoto) {
      setImgSrc(resolvedPhoto);
    }
  }, [settings?.avatarUrl, settings?.profilePhotoUrl]);

  const copy = useMemo(() => {
    const langSuffix: 'Ar' | 'Tr' | 'En' =
      language === 'ar' ? 'Ar' : language === 'tr' ? 'Tr' : 'En';

    const getTopLevelField = (prefix: string, lang: PortfolioLanguage): string => {
      if (!settings) return '';
      const suffix = lang === 'ar' ? 'Ar' : lang === 'tr' ? 'Tr' : 'En';
      const key = `${prefix}${suffix}` as keyof typeof settings;
      const value = settings[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
      const fallbackKey = `${prefix}En` as keyof typeof settings;
      const fallbackValue = settings[fallbackKey];
      return typeof fallbackValue === 'string' && fallbackValue.trim().length > 0
        ? fallbackValue.trim()
        : '';
    };

    const rawCopywriting = settings?.sectionCopywriting;
    const aboutCopywriting: SectionCopyItem | undefined =
      rawCopywriting && typeof rawCopywriting === 'object' && 'about' in rawCopywriting
        ? (rawCopywriting.about as SectionCopyItem)
        : undefined;

    const sectionBadge =
      aboutCopywriting?.[`badge${langSuffix}`]?.trim() ||
      getTopLevelField('aboutBadge', language) ||
      t('about.badge');

    const heading =
      aboutCopywriting?.[`title${langSuffix}`]?.trim() ||
      getTopLevelField('aboutHeadline', language) ||
      t('about.heading');

    const paragraph1 =
      getTopLevelField('aboutText', language) ||
      aboutCopywriting?.[`subtitle${langSuffix}`]?.trim() ||
      t('about.p1');

    const paragraph2 = getTopLevelField('aboutParagraph2', language) || t('about.p2');
    const roleBadge = getTopLevelField('jobTitle', language) || t('about.roleBadge');

    // Split paragraph1 into sentence lines for line-by-line scroll reveal
    const sentenceLines = paragraph1
      .split(/(?<=[.!?؟])\s+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return {
      sectionBadge,
      heading,
      sentenceLines: sentenceLines.length > 0 ? sentenceLines : [paragraph1],
      paragraph2,
      roleBadge,
    };
  }, [language, settings, t]);

  const features = useMemo<FeatureHighlight[]>(
    () => [
      {
        id: 'architecture',
        icon: Terminal,
        title: t('about.feat.arch'),
        description: t('about.feat.archDesc'),
        iconColorClass: 'text-sky-600 dark:text-sky-400',
      },
      {
        id: 'performance',
        icon: Cpu,
        title: t('about.feat.perf'),
        description: t('about.feat.perfDesc'),
        iconColorClass: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        id: 'precision',
        icon: Sparkles,
        title: t('about.feat.prec'),
        description: t('about.feat.precDesc'),
        iconColorClass: 'text-emerald-600 dark:text-emerald-400',
      },
    ],
    [t]
  );

  const handleScrollToContact = (): void => {
    const contactEl = document.querySelector('#contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resumeHref = settings?.resumeUrl || '/cv.pdf';
  const isCustomResume = Boolean(settings?.resumeUrl);

  return (
    <section
      ref={sectionRef}
      id="about"
      dir={dir}
      aria-labelledby="about-heading"
      className="relative z-10 w-full py-28 sm:py-36 lg:py-44 px-6 sm:px-12 lg:px-20 overflow-hidden rounded-t-[2rem] sm:rounded-t-[3rem] bg-[#f4f4f4] dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 border-t border-zinc-300/80 dark:border-white/10 shadow-[0_-32px_90px_rgba(0,0,0,0.85)] transition-colors duration-300"
    >
      {/* Top Minimal Drag-Bar / Editorial Sheet Indicator */}
      <div
        aria-hidden="true"
        className="absolute top-5 left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full bg-zinc-400/50 dark:bg-zinc-700/70 pointer-events-none"
      />

      {/* Ambient Radial Glows */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 start-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.045] blur-[150px] bg-sky-500" />
        <div className="absolute bottom-1/4 end-1/4 w-[440px] h-[440px] rounded-full opacity-[0.03] dark:opacity-[0.035] blur-[140px] bg-indigo-500" />
      </div>

      {/* Subtle SVG Film Grain Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full opacity-[0.14] dark:opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='aboutNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23aboutNoiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait Column with Subtle Scroll Parallax */}
          <motion.div
            initial={{ opacity: 0, y: 24, x: isRtl ? 16 : -16 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.2, margin: '-40px' }}
            transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
            className="lg:col-span-5 relative group"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-sky-500/15 via-blue-600/10 to-transparent blur-2xl opacity-50 dark:opacity-70 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none"
            />

            <motion.div
              style={{ y: portraitParallaxY }}
              className="relative overflow-hidden rounded-2xl bg-zinc-200/80 dark:bg-zinc-900/60 border border-zinc-300/80 dark:border-zinc-800/80 shadow-xl dark:shadow-2xl backdrop-blur-sm"
            >
              <img
                src={imgSrc}
                onError={() => setImgSrc(DEFAULT_PORTRAIT)}
                alt="Ahmad Alamin - Computer Engineer"
                loading="lazy"
                className="w-full h-[380px] sm:h-[460px] lg:h-[510px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/15 to-transparent pointer-events-none"
              />

              {/* Glassmorphic Role Badge */}
              <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:start-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md shadow-xl pointer-events-none">
                <span className="relative flex w-2 h-2 shrink-0">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-sky-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_#0ea5e9]" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-200 truncate">
                  {copy.roleBadge}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Editorial Narrative Column with Staggered Line-by-Line whileInView Reveals */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: '-40px' }}
            className="lg:col-span-7 flex flex-col items-start text-start space-y-7"
          >
            {/* Line 1: Minimal Monospace Index & Badge */}
            <motion.div
              variants={lineRevealVariants}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/[0.04] dark:bg-white/[0.04] border border-zinc-300/80 dark:border-zinc-800/80 backdrop-blur-sm text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400"
            >
              <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>01 // {copy.sectionBadge.replace(/^\/\/\s*/, '')}</span>
            </motion.div>

            {/* Line 2: Massive, Elegant Serif Display Heading */}
            <motion.h2
              id="about-heading"
              variants={lineRevealVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.15rem] font-serif font-editorial font-normal tracking-tight leading-[1.06] text-zinc-900 dark:text-zinc-100"
            >
              {copy.heading}
            </motion.h2>

            {/* Lines 3+: Smaller Editorial Descriptions Revealed Line-by-Line */}
            <div className="space-y-3.5 max-w-2xl">
              {copy.sentenceLines.map((line, index) => (
                <motion.p
                  key={index}
                  variants={lineRevealVariants}
                  className="text-xs sm:text-sm md:text-[15px] font-sans leading-relaxed text-zinc-600 dark:text-zinc-400"
                >
                  {line}
                </motion.p>
              ))}

              {copy.paragraph2 && (
                <motion.p
                  variants={lineRevealVariants}
                  className="text-xs sm:text-sm font-mono uppercase tracking-[0.14em] leading-relaxed text-zinc-500 dark:text-zinc-400 pt-1"
                >
                  {copy.paragraph2}
                </motion.p>
              )}
            </div>

            {/* Line 4: 3-Card Glassmorphic Engineering Pillars */}
            <motion.div
              variants={staggerContainerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-2"
            >
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    variants={lineRevealVariants}
                    className="group flex flex-col gap-1.5 p-4 rounded-2xl bg-white/75 dark:bg-zinc-900/45 border border-zinc-300/70 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700/80 backdrop-blur-md shadow-sm dark:shadow-none transition-colors duration-300 text-start"
                  >
                    <div className={`flex items-center gap-2 ${feature.iconColorClass}`}>
                      <IconComponent className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-800 dark:text-zinc-200">
                        {feature.title}
                      </span>
                    </div>
                    <span className="text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                      {feature.description}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Line 5: Editorial Action Buttons */}
            <motion.div
              variants={lineRevealVariants}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={handleScrollToContact}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-mono uppercase tracking-[0.18em] shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <span>{t('about.cta.connect')}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </button>

              <a
                href={resumeHref}
                target={isCustomResume ? '_blank' : undefined}
                rel={isCustomResume ? 'noopener noreferrer' : undefined}
                download={!isCustomResume ? 'Ahmad_Alamin_CV.pdf' : undefined}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-zinc-300/80 dark:border-zinc-800 backdrop-blur-sm text-zinc-800 dark:text-zinc-300 text-xs font-mono uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>{t('about.cta.resume')}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
