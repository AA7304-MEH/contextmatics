'use client';

import React from 'react';

export const LANGUAGES = [
  { id: 'english', label: 'English', flag: '🇺🇸', native: 'English' },
  { id: 'hinglish', label: 'Hinglish', flag: '🇮🇳', native: 'हिंदी + English' },
  { id: 'hindi', label: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { id: 'tamil', label: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
  { id: 'telugu', label: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
  { id: 'marathi', label: 'Marathi', flag: '🇮🇳', native: 'मराठी' },
  { id: 'bengali', label: 'Bengali', flag: '🇮🇳', native: 'বাংলা' },
  { id: 'kannada', label: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
  { id: 'gujarati', label: 'Gujarati', flag: '🇮🇳', native: 'ગુજરાતી' },
  { id: 'punjabi', label: 'Punjabi', flag: '🇮🇳', native: 'ਪੰਜਾਬੀ' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">
        Output Language
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onChange(lang.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              value === lang.id
                ? 'bg-brand-primary/10 border-brand-primary text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <div className="flex flex-col items-start leading-tight">
              <span>{lang.label}</span>
              <span className="text-[10px] opacity-40 font-normal">{lang.native}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
