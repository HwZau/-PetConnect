import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';
type Theme = 'light' | 'dark';

interface SettingsContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const v = localStorage.getItem('pn_lang');
      if (v === 'vi' || v === 'en') return v;
    } catch (e) {}
    return 'vi';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem('pn_theme');
      if (v === 'dark' || v === 'light') return v;
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    try { localStorage.setItem('pn_lang', language); } catch (e) {}
  }, [language]);

  useEffect(() => {
    try { localStorage.setItem('pn_theme', theme); } catch (e) {}
  }, [theme]);

  useEffect(() => {
    // apply theme class to document body for global CSS if desired
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('pn-dark');
      } else {
        document.documentElement.classList.remove('pn-dark');
      }
    }
  }, [theme]);

  const setLanguage = (l: Language) => setLanguageState(l);
  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, toggleTheme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

export default SettingsContext;
