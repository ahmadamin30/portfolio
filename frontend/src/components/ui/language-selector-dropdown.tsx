import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";
import { usePublicPortfolio, PortfolioLanguage } from "@/context/PublicPortfolioContext";

interface LanguageOption {
  code: PortfolioLanguage;
  short: string;
  label: string;
}

const languages: LanguageOption[] = [
  { code: "en", short: "EN", label: "English" },
  { code: "ar", short: "AR", label: "العربية" },
  { code: "tr", short: "TR", label: "Türkçe" },
];

export const LanguageSelectorDropdown = () => {
  const { currentLanguage, language, setLanguage } = usePublicPortfolio();
  const activeLang = currentLanguage || language || 'en';
  const selected = languages.find((l) => l.code === activeLang) || languages[0];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block select-none" ref={dropdownRef}>
      {/* Trigger Button: [Icon] [EN/AR/TR] [ChevronDown] */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm bg-white/90 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 backdrop-blur-md shadow-lg border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer h-9"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors" />
        <span className="font-mono font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white">
          {selected.short}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
            open ? "rotate-180 text-zinc-900 dark:text-white" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu: EN - English, AR - العربية, TR - Türkçe */}
      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 rounded-2xl overflow-hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-zinc-200 dark:border-zinc-800/90 py-1.5 z-50">
          {languages.map((lang) => {
            const isSelected = selected.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2 text-xs sm:text-sm text-left rtl:text-right transition-colors cursor-pointer ${
                  isSelected
                    ? "font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    {lang.short}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 font-light">-</span>
                  <span className="font-medium">{lang.label}</span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 ml-2 rtl:ml-0 rtl:mr-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelectorDropdown;
