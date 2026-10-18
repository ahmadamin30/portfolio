import React from 'react';
import { motion } from 'framer-motion';
import { usePublicPortfolio, PortfolioLanguage } from '../../context/PublicPortfolioContext';

export const TopCornerControls: React.FC = () => {
  const { language, setLanguage } = usePublicPortfolio();

  const languages: { code: PortfolioLanguage; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
    { code: 'tr', label: 'TR' },
  ];

  return (
    <div className="fixed top-5 right-6 z-40 pointer-events-auto select-none">
      <div className="flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-full p-1 shadow-lg shadow-black/40">
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`relative px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-label={`Switch to ${lang.label}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLangPill"
                  className="absolute inset-0 bg-zinc-800 border border-zinc-700/60 rounded-full -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopCornerControls;
