import React from 'react';
import LanguageSelectorDropdown from '../ui/language-selector-dropdown';
import { SunMoonThemeToggle } from '../ui/sun-moon-theme-toggle';

export const TopCornerControls: React.FC = () => {
  return (
    <aside
      aria-label="Site settings and controls"
      className="fixed top-4 sm:top-5 end-6 md:end-12 z-50 flex items-center gap-2 select-none"
    >
      <LanguageSelectorDropdown />
      <SunMoonThemeToggle
        size={36}
        sky={true}
        syncDocument={true}
        storageKey="theme"
        duration={500}
        className="border-zinc-200 dark:border-zinc-800/90 shadow-lg"
      />
    </aside>
  );
};

export default TopCornerControls;
