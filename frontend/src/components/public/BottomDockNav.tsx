import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';

interface DockItem {
  id: string;
  labelKey: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: '#about', labelKey: 'nav.about' },
  { id: '#projects', labelKey: 'nav.projects' },
  { id: '#skills', labelKey: 'nav.skills' },
  { id: '#services', labelKey: 'nav.services' },
  { id: '#contact', labelKey: 'nav.contact' },
];

export const BottomDockNav: React.FC = () => {
  const { t, settings } = usePublicPortfolio();
  const [activeId, setActiveId] = useState<string>('#about');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      const sectionIds = ['about', 'projects', 'skills', 'services', 'contact'];

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(`#${id}`);
            return;
          }
        }
      }
      setActiveId('#about');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id: string) => {
    setActiveId(id);
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryColor = settings?.primaryColor || '#2563eb';

  return (
    <nav
      aria-label="Floating Navigation Dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none max-w-[95vw]"
    >
      <div className="bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-1.5 shadow-xl shadow-zinc-900/10 dark:shadow-2xl dark:shadow-black/80 flex items-center gap-1 overflow-x-auto scrollbar-none transition-colors duration-300">
        {DOCK_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`relative px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  className="absolute inset-0 rounded-xl shadow-md -z-10"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 32,
                  }}
                />
              )}
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomDockNav;
