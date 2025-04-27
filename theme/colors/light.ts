const palette = {
  // Primary - Basé sur #1E5A9D
  primary50: '#EAF1F9',
  primary100: '#C6D8ED',
  primary200: '#A3BFE1',
  primary300: '#7FA6D5',
  primary400: '#5C8DCB',
  primary500: '#1E5A9D', // Couleur principale
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
  secondary500: '#F2B632', // Jaune principal
  secondary600: '#DAA22D',
  secondary700: '#C28F28',
  secondary800: '#AA7C23',
  secondary900: '#92691E',

  // Warning - dérivée du jaune
  warning50: '#FFF8E1',
  warning100: '#FFECB3',
  warning200: '#FFE082',
  warning300: '#FFD54F',
  warning400: '#FFCA28',
  warning500: '#F2B632', // Jaune principal
  warning600: '#E6AC2E',
  warning700: '#D89E2A',
  warning800: '#C38B1F',
  warning900: '#92691E',

  // Error - Tons rouges
  error50: '#FFEBEE',
  error100: '#FFCDD2',
  error200: '#EF9A9A',
  error300: '#E57373',
  error400: '#EF5350',
  error500: '#F44336', // Rouge principal
  error600: '#E53935',
  error700: '#D32F2F',
  error800: '#C62828',
  error900: '#B71C1C',

  // Success - Tons verts
  success50: '#E8F5E9',
  success100: '#C8E6C9',
  success200: '#A5D6A7',
  success300: '#81C784',
  success400: '#66BB6A',
  success500: '#4CAF50', // Vert principal
  success600: '#43A047',
  success700: '#388E3C',
  success800: '#2E7D32',
  success900: '#1B5E20',

  // Info - basé sur #75B9E3
  info50: '#EAF5FC',
  info100: '#C6E3F6',
  info200: '#A6D5F1',
  info300: '#8CCAF0',
  info400: '#6FBCEB',
  info500: '#75B9E3', // Bleu ciel principal
  info600: '#5AA6CE',
  info700: '#458BB2',
  info800: '#336D95',
  info900: '#2C6B8F',

  // Neutral - Gris clair à noir
  neutral50: '#F9F9F9',
  neutral100: '#F2F2F2',
  neutral200: '#E5E5E5', // Gris clair
  neutral300: '#D4D4D4',
  neutral400: '#A3A3A3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Autres
  placeholder: '#7B8794',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#F0F0F0',
  transparent: 'transparent',

  // Utilitaires supplémentaires
  focusRing: '#7FA6D5', // primary300
  inverseBackground: '#0F2F57', // primary900
  inverseText: '#FFFFFF',
};

const lightColors = {
  ...palette,

  background: {
    primary: palette.gray,
    secondary: palette.neutral50,
    tertiary: palette.neutral100,
    inverse: palette.inverseBackground,
  },

  text: {
    primary: palette.black,
    secondary: palette.neutral700,
    tertiary: palette.neutral500,
    disabled: palette.neutral400,
    inverse: palette.white,
    placeholder: palette.placeholder,
    hint: palette.neutral400,
    muted: palette.neutral500,
    link: palette.primary500,
  },

  border: {
    light: palette.neutral200,
    default: palette.neutral300,
    dark: palette.neutral400,
  },

  button: {
    primary: palette.primary500,
    secondary: palette.secondary500,
    disabled: palette.neutral300,
    gray: palette.neutral500,
  },

  shadow: {
    light: palette.neutral200,
    default: palette.neutral300,
    dark: palette.neutral400,
  },

  action: {
    active: palette.primary500,
    hover: palette.primary400,
    selected: palette.primary300,
    focus: palette.primary300,
    pressed: palette.primary600,
    disabled: palette.neutral300,
    disabledBackground: palette.neutral200,
  },

  status: {
    success: palette.success500,
    error: palette.error500,
    warning: palette.warning500,
    info: palette.info500,
  },

  states: {
    hover: palette.primary400,
    focus: palette.primary300,
    pressed: palette.primary600,
  },
};

export default lightColors;
