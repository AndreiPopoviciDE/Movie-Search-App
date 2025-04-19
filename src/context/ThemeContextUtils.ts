import { createContext, useContext } from 'react';

type ThemeContextType = {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProviderWrapper');
  }
  return context;
};
