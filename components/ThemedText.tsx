import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import typography from '@/theme/typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'body1'
    | 'body2'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'button'
    | 'caption'
    | 'overline';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body1',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: 'lightColor', dark: darkColor }, 'text');

  const textStyle = typography[type] ?? typography.body1;

  return (
    <Text
      style={[
        { color },
        textStyle,
        style, // custom override
      ]}
      {...rest}
    />
  );
}
