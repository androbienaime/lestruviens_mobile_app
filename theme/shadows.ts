import { Platform } from 'react-native';
import { lightColors, darkColors } from './colors';


// Configure les ombres en fonction du thème sélectionné
const configureShadows = (isDark: boolean, colors: typeof lightColors | typeof darkColors) => {
  const shadowColor = isDark ? darkColors.palette.black : lightColors.shadow?.default || lightColors.black;
  
  const createElevation = (elevation: number) => {
    if (Platform.OS === 'android') {
      return { elevation };
    }
    
    // iOS shadows - ajustées selon le mode
    const height = elevation * 0.5;
    const radius = elevation * 0.8;
    const opacity = isDark ? (0.4 + elevation * 0.05) : (0.2 + elevation * 0.03);
    
    return {
      shadowColor,
      shadowOffset: { width: 0, height },
      shadowOpacity: opacity,
      shadowRadius: radius,
    };
  };

  return {
    none: createElevation(0),
    xs: createElevation(1),
    s: createElevation(2),
    m: createElevation(4),
    l: createElevation(8),
    xl: createElevation(16),
  };
};

export default configureShadows;

// Hook optionnel pour utiliser les ombres dans des composants
export const createShadowsForTheme = (colors: any, isDark: boolean) => {
  return configureShadows(isDark, colors);
};