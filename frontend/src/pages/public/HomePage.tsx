import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  Layers,
  Mail,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicPortfolioProvider, usePublicPortfolio } from '../../context/PublicPortfolioContext';
import AdvaxPreloader from '../../components/public/AdvaxPreloader';
import TopCornerControls from '../../components/public/TopCornerControls';
import BottomDockNav from '../../components/public/BottomDockNav';
import HeroSection from '../../components/public/HeroSection';
import AboutSection from '../../components/public/AboutSection';
import ScrollRevealSection from '../../components/public/ScrollRevealSection';
import SkillsSection from '../../components/public/SkillsSection';
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
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-sky-500/30 selection:text-white pb-28">
      {/* Subtle Dotted Grid Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-45 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft Radial Glow Spotlight at Top Center */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 opacity-30 blur-[140px] bg-gradient-to-b from-blue-600/30 via-sky-500/10 to-transparent" />

      {/* Advax Laser Split-Shutter Intro Preloader */}
      <AdvaxPreloader
        key={preloaderKey}
        onRevealStart={() => setIsRevealed(true)}
        onComplete={() => setIsRevealed(true)}
      />

      {/* Minimal Top-Right Language Switcher Controls */}
      <TopCornerControls />

      {/* Floating Bottom Dock Navigation */}
      <BottomDockNav />

      {/* Main Content View with Smooth Entry Scale & Fade */}
      <motion.main
        initial={false}
        animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative flex flex-col"
      >
        {/* Top Hero Section (Big Editorial Display Typography) */}
        <HeroSection />

        {/* Section 01: About (Split Layout with Developer Portrait & Rich Narrative) */}
        <AboutSection />

        {/* Section 02: Projects (Interactive Floating Cursor Showcase) */}
        <ScrollRevealSection id="projects" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
          <ProjectShowcase title={t('nav.projects')} />
        </ScrollRevealSection>

        {/* Section 03: Skills (Interactive LogoLoop Tech Arsenal) */}
        <SkillsSection />

        {/* Section 04: Experience */}
        <ScrollRevealSection id="experience" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800/70 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
                    04 // CAREER TIMELINE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {t('nav.experience')}
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-500">MILESTONES &amp; ROLES</span>
            </div>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              Chronological journey spanning full-stack development, software engineering leadership, and strategic product delivery.
            </p>
          </div>
        </ScrollRevealSection>

        {/* Section 05: Services */}
        <ScrollRevealSection id="services" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800/70 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest block">
                    05 // ARCHITECTURE PACKAGES
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {t('nav.services')}
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-500">SCOPE &amp; OFFERINGS</span>
            </div>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              Custom web application engineering, microservices restructuring, CMS integrations, and end-to-end technical consulting.
            </p>
          </div>
        </ScrollRevealSection>

        {/* Section 06: Contact */}
        <ScrollRevealSection id="contact" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800/70 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block">
                    06 // INITIATE DIALOGUE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {t('nav.contact')}
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPEN FOR NEW ENGAGEMENTS</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
              Have a high-impact product idea or need architectural consultation? Reach out directly to discuss timelines and scope.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:contact@advax.dev"
                className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                Send Message &rarr;
              </a>
            </div>
          </div>
        </ScrollRevealSection>

        {/* Minimal Footer */}
        <footer className="py-10 px-4 text-center flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-500 border-t border-zinc-900/60 mt-12">
          <span>&copy; {new Date().getFullYear()} ADVAX. All rights reserved.</span>
          <span className="text-zinc-800">|</span>
          <button
            type="button"
            onClick={handleReplayIntro}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Intro</span>
          </button>
          <span className="text-zinc-800">|</span>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CMS Admin</span>
          </Link>
        </footer>
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
