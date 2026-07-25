import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, LANGUAGES, Language } from "../context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "header" | "footer" | "mobile";
}

export default function LanguageSwitcher({ className = "", variant = "header" }: LanguageSwitcherProps) {
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className={`space-y-2 ${className}`}>
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block px-1">
          Select Language / Langue / Idioma
        </span>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((opt) => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF7A00]/15 border-[#FF7A00] text-white font-bold shadow-[0_0_12px_rgba(255,122,0,0.2)]"
                    : "bg-[#070c24]/80 border-white/10 text-gray-300 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{opt.flag}</span>
                <span>{opt.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#071E4A]/80 hover:bg-[#071E4A] border border-white/15 hover:border-brand-orange/50 rounded-full font-mono text-xs text-gray-200 hover:text-white transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF7A00]/50"
        title="Change Language"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-[#FF7A00]" />
        <span className="flex items-center gap-1">
          <span>{currentLanguageOption.flag}</span>
          <span className="font-bold">{currentLanguageOption.shortName}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#FF7A00]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-[#070c24]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl p-1.5 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Language / Langue
              </span>
            </div>

            <div className="space-y-0.5">
              {LANGUAGES.map((opt) => {
                const isActive = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    onClick={() => handleSelect(opt.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FF7A00]/20 text-white font-bold border border-[#FF7A00]/40"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{opt.flag}</span>
                      <span className="font-medium">{opt.nativeName}</span>
                    </span>

                    {isActive && <Check className="w-3.5 h-3.5 text-[#FF7A00]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
