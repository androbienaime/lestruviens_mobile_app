import React, { createContext, useContext } from 'react';
import { lightColors, darkColors } from './colors';
import typography from './typography';

type ThemeContextType = {
  colors: typeof lightColors | typeof darkColors;
  typography: typeof typography;
  isDark: boolean;
  isSystemTheme: boolean;
  toggleTheme: () => void;
  setUseSystemTheme: (useSystem: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  typography,
  isDark: false,
  isSystemTheme: true,
  toggleTheme: () => {},
  setUseSystemTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext;