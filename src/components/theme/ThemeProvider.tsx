import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId } from '../../types';
import { THEMES } from '../../lib/themes';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  activeThemeConfig: typeof THEMES[number];
}

const STORAGE_KEY = 'ai-ielts-pro-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId;
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return 'metallic-dusk';
  });

  const setTheme = (nextTheme: ThemeId) => {
    setThemeState(nextTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(STORAGE_KEY, nextTheme);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const activeThemeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeThemeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
