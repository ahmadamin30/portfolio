import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Sparkles } from 'lucide-react';
import { usePublicPortfolio, PortfolioLanguage } from '../../context/PublicPortfolioContext';

interface NavItem {
  id: string;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: '#about', labelKey: 'nav.about' },
  { id: '#workflow', labelKey: 'nav.workflow' },
  { id: '#projects', labelKey: 'nav.projects' },
  { id: '#skills', labelKey: 'nav.skills' },
  { id: '#services', labelKey: 'nav.services' },
  { id: '#faq', labelKey: 'nav.faq' },
  { id: '#contact', labelKey: 'nav.contact' },
];

export const PublicNavbar: React.FC = () => {
  const { language, setLanguage, t, settings } = usePublicPortfolio();
  const [activeSection, setActiveSection] = useState<string>('#hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  // Monitor scroll to update active section in floating capsule
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['hero', 'about', 'workflow', 'projects', 'skills', 'services', 'faq', 'contact'];
      const scrollY = window.scrollY + 180;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(`#${id}`);
            return;
          }
        }
      }
      if (window.scrollY < 120) {
        setActiveSection('#hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const languages: { code: PortfolioLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية', flag: 'AR' },
    { code: 'tr', label: 'Türkçe', flag: 'TR' },
  ];

  return (
    <>
      {/* Floating Header Wrapper */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 sm:pt-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo on the Far Left */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="pointer-events-auto flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-800 shadow-md transition-transform group-hover:scale-105">
              <span className="font-mono text-xs font-bold text-white tracking-tight">A</span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-xl text-white group-hover:text-zinc-200 transition-colors">
                {settings?.siteName || 'ADVAX'}
              </span>
              <span className="font-mono text-[9px] text-zinc-500 tracking-[0.2em] uppercase -mt-1 hidden sm:inline-block">
                SYSTEMS
              </span>
            </div>
          </a>

          {/* Center Floating Capsule Navbar (Desktop) */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1.5 bg-zinc-900/70 backdrop-blur-md border border-zinc-800/80 rounded-full px-4 py-1.5 shadow-2xl shadow-black/50">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="capsuleActiveHighlight"
                      className="absolute inset-0 bg-zinc-800/90 border border-zinc-700/60 rounded-full shadow-inner -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher & Mobile Menu Trigger */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            {/* Language Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 bg-zinc-900/70 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-800/80 rounded-full px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 shadow-md transition-all active:scale-95"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span className="uppercase tracking-wider font-semibold">
                  {language === 'ar' ? 'العربية' : language === 'tr' ? 'Türkçe' : 'EN'}
                </span>
              </button>

              {/* Language Dropdown Menu */}
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-50 space-y-1"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          language === lang.code
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          {lang.flag}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800/80 text-zinc-300 backdrop-blur-md shadow-md transition-all active:scale-95"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Backdrop & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Navigation
                </span>
                <span className="text-[10px] font-mono text-zinc-500">ADVAX ARCHITECTURE</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-zinc-800 text-white font-semibold border border-zinc-700/80'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      {t(item.labelKey)}
                    </button>
                  );
                })}
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Language</span>
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                        language === lang.code
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicNavbar;
