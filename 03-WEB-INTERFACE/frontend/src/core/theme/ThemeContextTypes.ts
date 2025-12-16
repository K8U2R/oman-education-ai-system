/**
 * Theme Context Types
 * أنواع Theme Context
 */

export type Theme = 'dark' | 'light' | 'auto';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
}

