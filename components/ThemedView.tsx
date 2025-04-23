import { View, type ViewProps } from 'react-native';
import { useTheme, useThemeColors, useThemeTypography } from '@/theme';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { isDark, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const typography = useThemeTypography();

  return <View style={[{ backgroundColor: colors.background.primary }, style]} {...otherProps} />;
}
