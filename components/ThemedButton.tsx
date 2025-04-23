import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useThemeColors, useThemeTypography } from "@/theme";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

export default function ThemedButton({
  title,
  variant = "primary",
  size = "medium",
  leftIconName,
  rightIconName,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  textStyle,
  buttonStyle,
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const typography = useThemeTypography();

  const getButtonStyles = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: "transparent",
      borderWidth: 0,
    };

    if (variant === "primary") {
      base.backgroundColor = disabled
        ? colors.button?.disabled
        : colors.button?.primary;
    } else if (variant === "secondary") {
      base.backgroundColor = disabled
        ? colors.button?.disabled
        : colors.button?.secondary;
    } else if (variant === "outline") {
      base.borderWidth = 1;
      base.borderColor = disabled
        ? colors.border?.default
        : colors.button?.primary;
    }

    return base;
  };

  const getTextStyles = (): TextStyle => {
    let color = colors.text?.inverse;
    if (variant === "outline" || variant === "ghost") {
      color = disabled ? colors.text?.tertiary : colors.text?.primary;
    }
    return { color };
  };

  const getSizeStyles = (): ViewStyle => {
    const sizes = {
      small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
      medium: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
      large: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
    };
    return sizes[size] || sizes.medium;
  };

  const getIconColor = () => {
    if (disabled) return colors.text?.tertiary;
    if (variant === "primary" || variant === "secondary") {
      return colors.text?.inverse;
    }
    return colors.text?.primary;
  };

  const getIconSize = () => {
    return size === "small" ? 16 : size === "large" ? 24 : 20;
  };

  const shadowStyle: ViewStyle = isDark
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
      };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        getSizeStyles(),
        shadowStyle,
        fullWidth && styles.fullWidth,
        buttonStyle,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
        />
      ) : (
        <>
          {/* Left Icon */}
          {leftIconName && (
            <Ionicons
              name={leftIconName}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.leftIcon}
            />
          )}
          {!leftIconName && leftIcon && <>{leftIcon}</>}

          {/* Title */}
          <Text
            style={[
              styles.buttonText,
              typography.subtitle1,
              getTextStyles(),
              textStyle,
            ]}
          >
            {title}
          </Text>

          {/* Right Icon */}
          {rightIconName && (
            <Ionicons
              name={rightIconName}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.rightIcon}
            />
          )}
          {!rightIconName && rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  fullWidth: {
    width: "100%",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
