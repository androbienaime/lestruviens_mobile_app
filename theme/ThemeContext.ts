import React, { createContext, useContext } from 'react';

// Création du contexte avec une valeur par défaut
const ThemeContext = createContext({
  colors: {},
  typography: {},
  isDark: false,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext;