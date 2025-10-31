/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface SettingsContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem('pn_theme');
      if (v === 'dark' || v === 'light') return v;
    } catch (err) {
      console.debug('SettingsContext: read pn_theme failed', err);
    }
    return 'light';
  });

  // Language persistence and switching intentionally disabled.

  useEffect(() => {
    try { localStorage.setItem('pn_theme', theme); } catch (err) { console.debug('SettingsContext: write pn_theme failed', err); }
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

  // keep a no-op setter to preserve compatibility with existing callers
  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
