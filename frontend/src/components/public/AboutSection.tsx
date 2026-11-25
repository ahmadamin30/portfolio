import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';

const DEFAULT_PORTRAIT = '/ahmad-alamin.jpg';
const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ScrollHighlightWordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const ScrollHighlightWord: React.FC<ScrollHighlightWordProps> = ({
  word,
  progress,
  range,
}) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block">
      {/* Base muted layer (readable text for selection & assistive tech) */}
      <span className="text-zinc-400/75 dark:text-[#52525B]">{word}</span>
      {/* Scroll-driven crisp highlight overlay */}
      <motion.span
        aria-hidden="true"
        style={{ opacity }}
        className="absolute inset-0 text-zinc-900 dark:text-[#F4F4F5] pointer-events-none select-none will-change-[opacity]"
      >
        {word}
      </motion.span>
    </span>
  );
};

interface ScrollRevealParagraphProps {
  text: string;
  dir: 'ltr' | 'rtl';
}

const ScrollRevealParagraph: React.FC<ScrollRevealParagraphProps> = ({ text, dir }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.42'],
  });

  const words = useMemo(() => text.trim().split(/\s+/), [text]);

  const paragraphClassName =
    'max-w-3xl mx-auto text-start font-sans text-xl sm:text-2xl md:text-[1.75rem] lg:text-[1.95rem] font-medium leading-[1.48] sm:leading-[1.45] tracking-[-0.02em] rtl:tracking-normal rtl:leading-[1.68]';

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className="mt-28 sm:mt-36 lg:mt-44 pt-4 pb-8 sm:pb-12">
        <p
          dir={dir}
          className={`${paragraphClassName} text-zinc-900 dark:text-[#F4F4F5]`}
        >
          {text}
        </p>
      </div>
    );
  }

  const totalWords = Math.max(words.length, 1);
  const windowSize = 0.14;

  return (
    <div ref={containerRef} className="mt-28 sm:mt-36 lg:mt-44 pt-4 pb-8 sm:pb-12">
      <p dir={dir} className={paragraphClassName}>
        {words.map((word, index) => {
          const start = (index / totalWords) * (1 - windowSize);
          const end = Math.min(1, start + windowSize);

          return (
            <React.Fragment key={`${index}-${word}`}>
              <ScrollHighlightWord
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
              />
              {index < words.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </p>
    </div>
  );
};

interface TimelineMilestone {
  id: string;
  year?: string;
  title: string;
  meta: string;
  description: string;
}

interface TimelineMilestoneRowProps {
  milestone: TimelineMilestone;
  prefersReducedMotion: boolean | null;
}

const TimelineMilestoneRow: React.FC<TimelineMilestoneRowProps> = ({
  milestone,
  prefersReducedMotion,
}) => {
  const rowRef = useRef<HTMLLIElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start 0.86', 'center 0.52', 'end 0.18'],
  });

  // Smooth focus curve: subtly muted ahead -> crisp illuminated active focus -> calm settled state
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4, 0.68, 1], [0.32, 1, 1, 0.62]);
  const nodeScale = useTransform(scrollYProgress, [0, 0.4, 0.68, 1], [0.72, 1.15, 1.05, 0.9]);
  const nodeGlowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.68, 1], [0, 1, 0.85, 0.25]);

  return (
    <li ref={rowRef} className="relative ps-11 sm:ps-16">
      {/* Scaled Circular Node Indicator (14px core inside 22px ring, centered on 2px track) */}
      <span
        aria-hidden="true"
        className="absolute start-0 top-[0.32rem] sm:top-[0.42rem] flex items-center justify-center w-[22px] h-[22px] rounded-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-300 dark:border-white/[0.16] z-10"
      >
        {/* Subtle Ambient Halo on Active Focus */}
        <motion.span
          style={prefersReducedMotion ? { opacity: 0.45 } : { opacity: nodeGlowOpacity }}
          className="absolute -inset-2 rounded-full bg-zinc-900/12 dark:bg-sky-200/20 blur-[5px] pointer-events-none"
        />
        {/* Active Ring Highlight */}
        <motion.span
          style={prefersReducedMotion ? { opacity: 0.65 } : { opacity: nodeGlowOpacity }}
          className="absolute inset-0 rounded-full border-2 border-zinc-900/50 dark:border-[#F4F4F5]/65 pointer-events-none"
        />
        {/* 12px–14px Inner Core Dot */}
        <motion.span
          style={
            prefersReducedMotion
              ? { scale: 1, opacity: 1 }
              : { scale: nodeScale, opacity: contentOpacity }
          }
          className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-[#F4F4F5] dark:shadow-[0_0_12px_rgba(244,244,245,0.55)] will-change-transform"
        />
      </span>

      {/* Spacious Editorial Milestone Entry */}
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
        className="text-start space-y-2.5 sm:space-y-3 will-change-[opacity]"
      >
        <h3 className="font-sans text-xl sm:text-2xl lg:text-[1.625rem] font-medium leading-[1.3] tracking-[-0.02em] rtl:tracking-normal text-zinc-900 dark:text-[#F5F5F7]">
          {milestone.year && (
            <>
              <span className="font-mono text-lg sm:text-xl font-normal tracking-normal tabular-nums text-zinc-500 dark:text-[#A1A1AA]">
                {milestone.year}
              </span>
              <span className="mx-2.5 text-zinc-400 dark:text-zinc-600 font-light">—</span>
            </>
          )}
          <span>{milestone.title}</span>
        </h3>

        <p className="font-sans text-base font-normal tracking-[-0.005em] rtl:tracking-normal text-zinc-500 dark:text-[#A1A1AA]">
          {milestone.meta}
        </p>

        <p className="pt-1 max-w-3xl font-sans text-base sm:text-lg leading-relaxed rtl:leading-[1.85] text-zinc-600 dark:text-zinc-400">
          {milestone.description}
        </p>
      </motion.div>
    </li>
  );
};

interface JourneyTimelineProps {
  heading: string;
  milestones: TimelineMilestone[];
  dir: 'ltr' | 'rtl';
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  heading,
  milestones,
  dir,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.72', 'end 0.56'],
  });

  const smoothLineScale = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div dir={dir} className="mt-32 sm:mt-40 lg:mt-48 py-8 sm:py-12 max-w-4xl lg:max-w-5xl mx-auto">
      {/* Bold Editorial Section Heading */}
      <motion.h2
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease: EASE_EDITORIAL }}
        className="mb-16 sm:mb-20 text-start font-sans text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold tracking-[-0.025em] rtl:tracking-normal text-zinc-900 dark:text-[#F5F5F7]"
      >
        {heading}
      </motion.h2>

      {/* Vertical 2px Axis + Spacious Milestones */}
      <div ref={listRef} className="relative">
        {/* Static Subtle 2px Track (Centered under 22px node at start-[10px]) */}
        <div
          aria-hidden="true"
          className="absolute top-3 bottom-3 start-[10px] w-[2px] rounded-full bg-zinc-300/80 dark:bg-white/[0.08]"
        />

        {/* Scroll-Linked Illuminated 2px Accent Line */}
        <motion.div
          aria-hidden="true"
          style={
            prefersReducedMotion
              ? { scaleY: 1 }
              : { scaleY: smoothLineScale }
          }
          className="absolute top-3 bottom-3 start-[10px] w-[2px] rounded-full origin-top bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-900 dark:from-[#F4F4F5]/95 dark:via-sky-200/70 dark:to-[#F4F4F5]/95 will-change-transform"
        />

        <ol className="relative space-y-14 sm:space-y-16 lg:space-y-20">
          {milestones.map((milestone) => (
            <TimelineMilestoneRow
              key={milestone.id}
              milestone={milestone}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ol>
      </div>
    </div>
  );
};

export const AboutSection: React.FC = () => {
  const { dir, t, settings } = usePublicPortfolio();
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Subtle vertical drift on the portrait as the section scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const portraitParallaxY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  const [imgSrc, setImgSrc] = useState<string>(() => {
    return settings?.avatarUrl || settings?.profilePhotoUrl || DEFAULT_PORTRAIT;
  });

  useEffect(() => {
    const resolvedPhoto = settings?.avatarUrl || settings?.profilePhotoUrl;
    if (resolvedPhoto) {
      setImgSrc(resolvedPhoto);
    }
  }, [settings?.avatarUrl, settings?.profilePhotoUrl]);

  const statementLead = t('about.statementLead');
  const statementRole = t('about.statementRole');
  const editorialBody = t('about.editorialBody');
  const timelineHeading = t('about.timeline.heading');

  const milestones = useMemo<TimelineMilestone[]>(
    () => [
      {
        id: 'biruni-2023',
        year: '2023',
        title: t('about.timeline.m1.title'),
        meta: t('about.timeline.m1.meta'),
        description: t('about.timeline.m1.desc'),
      },
      {
        id: 'freelance-frontend',
        year: '2024',
        title: t('about.timeline.m2.title'),
        meta: t('about.timeline.m2.meta'),
        description: t('about.timeline.m2.desc'),
      },
      {
        id: 'vecmenu-2025',
        year: '2025',
        title: t('about.timeline.m3.title'),
        meta: t('about.timeline.m3.meta'),
        description: t('about.timeline.m3.desc'),
      },
      {
        id: 'enterprise-crm-2025',
        year: '2025',
        title: t('about.timeline.m4.title'),
        meta: t('about.timeline.m4.meta'),
        description: t('about.timeline.m4.desc'),
      },
      {
        id: 'scramblebit-intern',
        year: '2026',
        title: t('about.timeline.m5.title'),
        meta: t('about.timeline.m5.meta'),
        description: t('about.timeline.m5.desc'),
      },
    ],
    [t]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      dir={dir}
      aria-label={t('nav.about')}
      className="relative z-10 w-full py-32 sm:py-44 lg:py-52 px-6 sm:px-12 lg:px-20 overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-[#F5F5F7] transition-colors duration-300"
    >
      {/* Seamless Top Edge Feather */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/[0.03] dark:from-black/45 to-transparent pointer-events-none"
      />

      {/* Whisper-Soft Ambient Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-60 dark:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(148, 163, 184, 0.035), transparent 72%)',
          }}
        />
      </div>

      {/* Ultra-Subtle Editorial Film Grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full opacity-[0.06] dark:opacity-[0.09] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='aboutNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23aboutNoiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Upper Split Block: Portrait + Primary Identity Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 sm:gap-16 lg:gap-20 xl:gap-24 items-center">
          {/* Portrait Column (Start: Left in LTR, Right in RTL) */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: '-40px' }}
            transition={{ duration: 0.95, ease: EASE_EDITORIAL }}
            className="lg:col-span-5"
          >
            <motion.div
              style={prefersReducedMotion ? undefined : { y: portraitParallaxY }}
              className="relative overflow-hidden rounded-2xl bg-zinc-200/50 dark:bg-zinc-900/40 border border-zinc-900/[0.08] dark:border-white/[0.07] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_90px_-24px_rgba(0,0,0,0.9)]"
            >
              <img
                src={imgSrc}
                onError={() => setImgSrc(DEFAULT_PORTRAIT)}
                alt="Ahmad Alamin"
                loading="lazy"
                className="w-full h-[380px] sm:h-[460px] lg:h-[520px] object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.02]"
              />

              {/* Soft Edge Vignette for Natural Dark Canvas Integration */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 dark:from-[#09090b]/55 dark:via-transparent dark:to-[#09090b]/15 pointer-events-none"
              />
            </motion.div>
          </motion.div>

          {/* Primary Statement Column (End: Right in LTR, Left in RTL) */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25, margin: '-40px' }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE_EDITORIAL }}
            className="lg:col-span-7 flex items-center justify-start"
          >
            <p className="max-w-xl text-start font-sans text-2xl sm:text-3xl md:text-[2.15rem] lg:text-[2.45rem] font-normal leading-[1.38] sm:leading-[1.34] tracking-[-0.025em] rtl:tracking-normal rtl:leading-[1.55]">
              <span className="font-medium text-zinc-900 dark:text-[#F5F5F7]">
                {statementLead}
              </span>
              <span className="text-zinc-500 dark:text-[#A1A1AA]">
                {statementRole}
              </span>
            </p>
          </motion.div>
        </div>

        {/* Lower Editorial Block: Prominent Scroll-Linked Highlight Paragraph */}
        <ScrollRevealParagraph text={editorialBody} dir={dir} />

        {/* Expanded Vertical Journey Timeline */}
        <JourneyTimeline
          heading={timelineHeading}
          milestones={milestones}
          dir={dir}
        />
      </div>
    </section>
  );
};

export default AboutSection;
