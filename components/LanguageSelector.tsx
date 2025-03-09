'use client';

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);
      setIsOpen(false);
      // Update HTML lang attribute
      document.documentElement.lang = langCode;
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-xl" role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
        <span className="text-gray-200">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          role="menu"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                language.code === i18n.language ? 'bg-gray-700' : ''
              }`}
              role="menuitem"
              aria-current={language.code === i18n.language}
            >
              <span className="text-xl" role="img" aria-label={language.name}>
                {language.flag}
              </span>
              <span className="text-gray-200">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
