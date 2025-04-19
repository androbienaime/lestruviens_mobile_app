const palette = {
    // Primary - Basé sur #1E5A9D
    primary50: '#EAF1F9',
    primary100: '#C6D8ED',
    primary200: '#A3BFE1',
    primary300: '#7FA6D5',
    primary400: '#5C8DCB',
    primary500: '#1E5A9D', // Couleur principale de votre charte
    primary600: '#1A4F8C',
    primary700: '#16447A',
    primary800: '#133A69',
    primary900: '#0F2F57',
    
    // Secondary - Basé sur #F2B632
    secondary50: '#FEF6E6',
    secondary100: '#FCE8BF',
    secondary200: '#F9DA98',
    secondary300: '#F7CB71',
    secondary400: '#F4C151',
    secondary500: '#F2B632', // Couleur secondaire de votre charte
    secondary600: '#DAA22D',
    secondary700: '#C28F28',
    secondary800: '#AA7C23',
    secondary900: '#92691E',
    
    // Error - Tons rouges
    error50: '#FFEBEE',
    error100: '#FFCDD2',
    error500: '#F44336', // Couleur d'erreur principale
    error900: '#B71C1C',
    
    // Warning - Basé sur #F2B632 (votre jaune)
    warning50: '#FEF6E6',
    warning100: '#FCE8BF',
    warning500: '#F2B632', // Votre jaune comme couleur d'avertissement
    warning900: '#92691E',
    
    // Success - Tons verts
    success50: '#E8F5E9',
    success100: '#C8E6C9',
    success500: '#4CAF50', // Couleur de succès principale
    success900: '#1B5E20',
    
    // Info - Basé sur #75B9E3 (votre bleu ciel)
    info50: '#EAF5FC',
    info100: '#C6E3F6',
    info500: '#75B9E3', // Votre bleu ciel comme couleur d'information
    info900: '#2C6B8F',
    
    // Neutral - Du gris clair au noir
    neutral50: '#F9F9F9',
    neutral100: '#F2F2F2',
    neutral200: '#E5E5E5', // Votre gris clair
    neutral300: '#D4D4D4',
    neutral400: '#A3A3A3',
    neutral500: '#737373',
    neutral600: '#525252',
    neutral700: '#404040',
    neutral800: '#262626',
    neutral900: '#171717',
    
    // Basic
    white: '#FFFFFF',
    black: '#000000', // Votre noir
    transparent: 'transparent',
  };
  
  const lightColors = {
    ...palette,
    
    // Semantic colors
    background: {
      primary: palette.white,
      secondary: palette.neutral50,
      tertiary: palette.neutral100,
    },
    
    text: {
      primary: palette.black, // Votre noir
      secondary: palette.neutral700,
      tertiary: palette.neutral500,
      disabled: palette.neutral400,
      inverse: palette.white,
    },
    
    border: {
      light: palette.neutral200, // Votre gris clair
      default: palette.neutral300,
      dark: palette.neutral400,
    },
    
    shadow: {
      light: palette.neutral200, // Votre gris clair
      default: palette.neutral300,
      dark: palette.neutral400,
    },
    
    action: {
      active: palette.primary500, // Votre bleu principal
      hover: palette.primary400,
      selected: palette.primary300,
      disabled: palette.neutral300,
      disabledBackground: palette.neutral200, // Votre gris clair
    },
    
    status: {
      success: palette.success500,
      error: palette.error500,
      warning: palette.secondary500, // Votre jaune
      info: palette.info500, // Votre bleu ciel
    }
  };
  
  export default lightColors;