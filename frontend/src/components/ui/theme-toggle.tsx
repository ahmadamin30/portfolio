import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export type ThemeMode = 'dark' | 'light';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group flex items-center justify-center rounded-full border px-3 py-1.5 text-xs sm:text-sm bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md shadow-lg border-zinc-800 text-zinc-200 hover:text-white transition-all cursor-pointer h-9 min-w-9"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
