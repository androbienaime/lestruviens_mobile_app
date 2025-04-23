import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useThemeColors, useThemeTypography } from '@/theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isPasswordInput?: boolean;
  onRightIconPress?: () => void;
}

export default function InputField({
  label,
  error,
  helperText,
  leftIconName,
  rightIconName,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isPasswordInput = false,
  onRightIconPress,
  style,
  ...props
}: InputFieldProps) {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const typography = useThemeTypography();
  const [showPassword, setShowPassword] = useState(false);

  // Gérer la visibilité du mot de passe
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Ajuster les props pour l'input de mot de passe
  const inputProps = {
    ...props,
    secureTextEntry: isPasswordInput ? !showPassword : props.secureTextEntry,
  };

  // Configuration des ombres pour l'input (similaire à ThemedView)
  const shadowStyle = {
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: isDark ? 0.15 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
         
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: typeof colors.background === 'string' ? colors.background : colors.background?.secondary || '#FFFFFF' },
          shadowStyle,
          error && styles.inputError,
          style as ViewStyle
        ]}
      >
        {/* Icône gauche - priorité au nom d'icône */}
        {leftIconName && (
          <Ionicons 
            name={leftIconName} 
            size={22} 
            color={colors.text?.tertiary || '#7B8794'} 
            style={styles.leftIcon} 
          />
        )}
        
        {/* Composant d'icône personnalisé */}
        {!leftIconName && leftIcon && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: colors.text?.primary || '#1A2138' },
            
          ]}
          placeholderTextColor={colors.text?.tertiary|| '#7B8794'}
          {...inputProps}
        />
        
        {/* Icône droite - priorité au password toggle si c'est un input de mot de passe */}
        {isPasswordInput && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={handleTogglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.text?.secondary || '#7B8794'}
            />
          </TouchableOpacity>
        )}
        
        {/* Icône droite personnalisée si ce n'est pas un input de mot de passe */}
        {!isPasswordInput && rightIconName && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
          >
            <Ionicons 
              name={rightIconName} 
              size={22} 
              color={colors.text?.tertiary || '#7B8794'} 
            />
          </TouchableOpacity>
        )}
        
        {/* Composant d'icône droite personnalisé */}
        {!isPasswordInput && !rightIconName && rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {/* Message d'erreur ou texte d'aide */}
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          { color: error ? (typeof colors.text === 'string' ? colors.text : '#E53935') : (typeof colors.text === 'string' ? colors.text : colors.text?.secondary || '#7B8794') },
          typography.caption
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>                                                                     
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    // marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',

  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E53935',
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    color: '#1A2138',
    fontSize: 16, // Corps de texte selon votre spécification
  },
  helperText: {
    marginTop: 4,
    marginLeft: 4,
  }
});