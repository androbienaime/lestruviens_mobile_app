import { useThemeContext } from './ThemeContext';
import typography from './typography';

// Hook pour accéder à tout le thème
export const useTheme = () => {
  return useThemeContext();
};

// Hook pour accéder uniquement aux couleurs
export const useThemeColors = () => {
  const { colors } = useThemeContext();
  return colors;
};

// Hook pour accéder uniquement à la typographie
export const useThemeTypography = () => {
  const { typography } = useThemeContext();
  return typography;
};