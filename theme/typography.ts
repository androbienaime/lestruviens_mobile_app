import { Platform } from 'react-native';
import { TextStyle } from 'react-native';

type FontWeight = 
  | 'normal' 
  | 'bold' 
  | '100' 
  | '200' 
  | '300' 
  | '400' 
  | '500' 
  | '600' 
  | '700' 
  | '800' 
  | '900';

const fontFamily = {
  title: Platform.select({
    ios: 'Georgia',
    android: 'Georgia',
    default: 'Georgia',
  }),
  regular: Platform.select({
    ios: 'Times New Roman',
    android: 'serif', // Times New Roman équivalent sur Android
    default: 'Times New Roman',
  }),
  bold: Platform.select({
    ios: 'Times New Roman',
    android: 'serif', // Times New Roman équivalent sur Android
    default: 'Times New Roman',
  }),
};

export const fontWeight: Record<string, FontWeight> = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

const baseTextStyle: TextStyle = {
  fontFamily: fontFamily.regular,
  letterSpacing: 0.15,
};

const typography = {
  fontFamily,
  fontWeight,
  
  // Titre principal - Georgia Bold, 48px
  h1: {
    ...baseTextStyle,
    fontFamily: fontFamily.title,
    fontWeight: fontWeight.bold,
    fontSize: 48,
    lineHeight: 58,
    letterSpacing: 0.25,
  } as TextStyle,
  
  // Sous-titre - Times New Roman, 24px
  h2: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.25,
  } as TextStyle,
  
  h3: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.25,
  } as TextStyle,
  
  h4: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.bold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.15,
  } as TextStyle,
  
  h5: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.bold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,
  
  h6: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.bold,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.15,
  } as TextStyle,
  
  subtitle1: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 24, // Sous-titre selon votre spécification
    lineHeight: 32,
    letterSpacing: 0.15,
  } as TextStyle,
  
  subtitle2: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.1,
  } as TextStyle,
  
  // Corps de texte - Times New Roman, 16px
  body1: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontSize: 16, // Corps de texte selon votre spécification
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,
  
  body2: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.25,
  } as TextStyle,
  
  button: {
    ...baseTextStyle,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.bold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,
  
  caption: {
    ...baseTextStyle,
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 0.4,
  } as TextStyle,
  
  overline: {
    ...baseTextStyle,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  } as TextStyle,
};

export default typography;