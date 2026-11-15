import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';

interface NavLinkItem {
  id: string;
  sectionId: string;
  labelKey: string;
}

// Left/Start Group: ['ABOUT', 'PROJECTS', 'SKILLS']
const LEFT_NAV_LINKS: NavLinkItem[] = [
  { id: '#about', sectionId: 'about', labelKey: 'nav.about' },
  { id: '#projects', sectionId: 'projects', labelKey: 'nav.projects' },
  { id: '#skills', sectionId: 'skills', labelKey: 'nav.skills' },
];

// Right/End Group: ['SERVICES', 'FAQ', 'CONTACT']
const RIGHT_NAV_LINKS: NavLinkItem[] = [
  { id: '#services', sectionId: 'services', labelKey: 'nav.services' },
  { id: '#faq', sectionId: 'faq', labelKey: 'nav.faq' },
  { id: '#contact', sectionId: 'contact', labelKey: 'nav.contact' },
];

const ALL_NAV_LINKS: NavLinkItem[] = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS];

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const navItemVariants: Variants = {
  collapsed: {
    opacity: 0,
    y: -4,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: EASE_EDITORIAL,
    },
  },
  expanded: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: EASE_EDITORIAL,
    },
  },
};

export const Header: React.FC = () => {
  const { t, dir } = usePublicPortfolio();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      if (window.scrollY < window.innerHeight * 0.5) {
        setActiveSection('');
        return;
      }

      for (let i = ALL_NAV_LINKS.length - 1; i >= 0; i--) {
        const item = ALL_NAV_LINKS[i];
        const el = document.getElementById(item.sectionId);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(item.id);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (targetSelector: string): void => {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsExpanded(false);
  };

  const handleLogoClick = (): void => {
    if (window.matchMedia('(hover: none)').matches && !isExpanded) {
      setIsExpanded(true);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsExpanded(false);
  };

  const renderNavLinks = (links: NavLinkItem[], alignClass: string) => (
    <ul className={`flex items-center gap-x-1 sm:gap-x-1.5 ${alignClass}`}>
      {links.map((item) => {
        const isActive = activeSection === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <motion.li key={item.id} variants={navItemVariants} className="relative">
            <button
              type="button"
              onClick={() => handleNavigate(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              className={`relative z-10 flex items-center gap-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                isActive || isHovered ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isHovered && (
                <motion.span
                  layoutId="headerNavHoverPill"
                  transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] border border-white/10"
                />
              )}

              {isActive && (
                <span
                  aria-hidden="true"
                  className="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] shrink-0"
                />
              )}

              <span>{t(item.labelKey)}</span>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );

  return (
    <header
      dir={dir}
      className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none select-none"
    >
      {/* Hover Trigger Zone Attached Flush to the Top Ceiling */}
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setHoveredId(null);
        }}
        onFocusCapture={() => setIsExpanded(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsExpanded(false);
          }
        }}
        className="pointer-events-auto flex flex-col items-center pt-0 px-4 sm:px-6 max-w-full"
      >
        {/* Glassmorphic Ceiling Tab with Symmetrical Flex Layout */}
        <motion.nav
          layout
          initial={false}
          transition={{ layout: { duration: 0.45, ease: EASE_EDITORIAL } }}
          aria-label="Primary Editorial Navigation"
          className="relative flex items-center justify-between rounded-b-[18px] sm:rounded-b-[22px] bg-[#09090b]/85 dark:bg-zinc-950/85 backdrop-blur-xl border-x border-b border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.85)] px-3 sm:px-5 py-2 overflow-x-auto scrollbar-none max-w-[96vw]"
        >
          {/* Subtle Bottom Specular Highlight Line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />

          {/* LEFT / START GROUP: ['ABOUT', 'PROJECTS', 'SKILLS'] */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="left-nav-links"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: 1,
                  width: 'auto',
                  transition: {
                    width: { duration: 0.42, ease: EASE_EDITORIAL },
                    opacity: { duration: 0.28, delay: 0.05, ease: EASE_EDITORIAL },
                  },
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                  transition: {
                    width: { duration: 0.32, ease: EASE_EDITORIAL },
                    opacity: { duration: 0.15, ease: EASE_EDITORIAL },
                  },
                }}
                className="flex flex-1 basis-0 items-center justify-end overflow-hidden pe-2 sm:pe-3"
              >
                {renderNavLinks(LEFT_NAV_LINKS, 'justify-end')}
                <span
                  aria-hidden="true"
                  className="h-3.5 w-[1px] bg-white/15 ms-2.5 sm:ms-3 shrink-0"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* CENTER LOGO: 'ADVAX' */}
          <motion.button
            layout="position"
            type="button"
            onClick={handleLogoClick}
            aria-expanded={isExpanded}
            aria-label="ADVAX — Return to top or toggle menu"
            className="relative z-10 shrink-0 flex items-center justify-center px-3.5 sm:px-4 py-1 text-zinc-100 hover:text-white transition-colors cursor-pointer"
          >
            <span className="font-serif font-editorial text-xs sm:text-[13px] font-semibold tracking-[0.26em] uppercase leading-none select-none">
              ADVAX
            </span>
          </motion.button>

          {/* RIGHT / END GROUP: ['SERVICES', 'FAQ', 'CONTACT'] */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="right-nav-links"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: 1,
                  width: 'auto',
                  transition: {
                    width: { duration: 0.42, ease: EASE_EDITORIAL },
                    opacity: { duration: 0.28, delay: 0.05, ease: EASE_EDITORIAL },
                  },
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                  transition: {
                    width: { duration: 0.32, ease: EASE_EDITORIAL },
                    opacity: { duration: 0.15, ease: EASE_EDITORIAL },
                  },
                }}
                className="flex flex-1 basis-0 items-center justify-start overflow-hidden ps-2 sm:ps-3"
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-[1px] bg-white/15 me-2.5 sm:me-3 shrink-0"
                />
                {renderNavLinks(RIGHT_NAV_LINKS, 'justify-start')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  );
};

export default Header;
