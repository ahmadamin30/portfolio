import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicPortfolioProvider, usePublicPortfolio } from '../../context/PublicPortfolioContext';
import AdvaxPreloader from '../../components/public/AdvaxPreloader';
import Header from '../../components/public/Header';
import TopCornerControls from '../../components/public/TopCornerControls';
import HeroSection from '../../components/public/HeroSection';
import AboutSection from '../../components/public/AboutSection';
import ScrollRevealSection from '../../components/public/ScrollRevealSection';
import SkillsSection from '../../components/public/SkillsSection';
import ServicesSection from '../../components/public/ServicesSection';
import FaqSection from '../../components/public/FaqSection';
import ContactSection from '../../components/public/ContactSection';
import { ProjectShowcase } from '@/components/ui/project-showcase';

const HomePageContent: React.FC = () => {
  const { t } = usePublicPortfolio();
  const [preloaderKey, setPreloaderKey] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hasSeenAdvaxPreloader') === 'true';
    } catch {
      return false;
    }
  });

  const handleReplayIntro = () => {
    try {
      sessionStorage.removeItem('hasSeenAdvaxPreloader');
    } catch {
      // ignore
    }
    setIsRevealed(false);
    setPreloaderKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white relative overflow-x-clip flex flex-col items-center transition-colors duration-300">
      
      {/* GLOBAL FIXED AMBIENT ATMOSPHERE & SOFT DIFFUSION (Spans seamlessly across all sections) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Glow 1: Top-Right (around Hero / About) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle 1000px at 82% 20%, rgba(148, 163, 184, 0.03), transparent 72%)',
          }}
        />

        {/* Glow 2: Middle-Left (around Projects / Skills) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle 1100px at 18% 55%, rgba(14, 165, 233, 0.02), transparent 75%)',
          }}
        />

        {/* Glow 3: Bottom-Right (around Services / Contact) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle 1000px at 78% 85%, rgba(148, 163, 184, 0.025), transparent 72%)',
          }}
        />

        {/* Unified Analog Film Grain Noise Overlay */}
        <div
          className="absolute inset-0 w-full h-full opacity-[0.09] dark:opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle Dotted Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            color: 'var(--dot-color, #94a3b8)',
          }}
        />
      </div>

      {/* Advax Laser Split-Shutter Intro Preloader */}
      <AdvaxPreloader
        key={preloaderKey}
        onRevealStart={() => setIsRevealed(true)}
        onComplete={() => setIsRevealed(true)}
      />

      {/* Interactive Top-Center 'AA' Hover-Reveal Editorial Header */}
      <Header />

      {/* Minimal Top-Corner Language Switcher & Theme Controls */}
      <TopCornerControls />

      {/* Main Content View with Smooth Entry Fade */}
      <motion.main
        initial={false}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative flex flex-col"
      >
        {/* Top Hero Section (Sticky z-0 Minimal Editorial Canvas) */}
        <HeroSection />

        {/* Section 01: About (Slides up with z-10 to cover sticky Hero) */}
        <AboutSection />

        {/* Subsequent Sections Wrapper (Remains z-10 above sticky Hero) */}
        <div className="relative z-10 w-full bg-zinc-50 dark:bg-[#09090b] transition-colors duration-300">
          {/* Section 02: Projects (Interactive Floating Cursor Showcase) */}
          <ScrollRevealSection id="projects" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
            <ProjectShowcase title={t('nav.projects')} />
          </ScrollRevealSection>

          {/* Section 03: Skills (Interactive LogoLoop Tech Arsenal) */}
          <SkillsSection />

          {/* Section 04: Services & Capabilities (Integrated Workflow) */}
          <ServicesSection />

          {/* Section 05: Frequently Asked Questions (Standalone Editorial Accordion) */}
          <FaqSection />

          {/* Section 06: Contact & Inquiries (Direct Channels & Message Form) */}
          <ContactSection />

          {/* Minimal Footer */}
          <footer className="py-10 px-4 text-center flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-500 border-t border-zinc-200 dark:border-zinc-900/60 mt-12">
            <span>&copy; {new Date().getFullYear()} ADVAX. All rights reserved.</span>
            <span className="text-zinc-300 dark:text-zinc-800">|</span>
            <button
              type="button"
              onClick={handleReplayIntro}
              className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Intro</span>
            </button>
            <span className="text-zinc-300 dark:text-zinc-800">|</span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>CMS Admin</span>
            </Link>
          </footer>
        </div>
      </motion.main>
    </div>
  );
};

export const HomePage: React.FC = () => {
  return (
    <PublicPortfolioProvider>
      <HomePageContent />
    </PublicPortfolioProvider>
  );
};

export default HomePage;
