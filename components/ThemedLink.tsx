import { StyleSheet, TextProps, View, type ViewProps } from 'react-native';
import { useTheme, useThemeColors, useThemeTypography } from '@/theme';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ThemedLinkProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedLink({ style, lightColor, darkColor, ...otherProps }: ThemedLinkProps) {
  const { isDark, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const typography = useThemeTypography();

  return <ThemedText style={[{ color : colors.text.link }, styles.link]} {...otherProps} />;
}

const styles = StyleSheet.create({
  link:{
    fontWeight: 600,
  }
})
