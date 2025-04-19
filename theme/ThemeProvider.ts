// import React, { useState, useEffect } from 'react';
// import { useColorScheme } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ThemeContext from './ThemeContext';
// import typography from './typography';
// import { lightColors, darkColors } from './colors';

// const THEME_PREFERENCE_KEY = '@app_theme_preference';

// export const ThemeProvider = ({ children }) => {
//   const systemColorScheme = useColorScheme();
//   const [isSystemTheme, setIsSystemTheme] = useState(true);
//   const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  
//   // Charger la préférence de thème au démarrage
//   useEffect(() => {
//     loadThemePreference();
//   }, []);
  
//   // Mettre à jour le thème lorsque le système change (si le thème système est activé)
//   useEffect(() => {
//     if (isSystemTheme) {
//       setIsDark(systemColorScheme === 'dark');
//     }
//   }, [systemColorScheme, isSystemTheme]);
  
//   // Charger la préférence de thème depuis le stockage
//   const loadThemePreference = async () => {
//     try {
//       const themePreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
//       if (themePreference !== null) {
//         const { useSystemTheme, darkMode } = JSON.parse(themePreference);
//         setIsSystemTheme(useSystemTheme);
//         if (!useSystemTheme) {
//           setIsDark(darkMode);
//         }
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des préférences de thème:', error);
//     }
//   };
  
//   // Sauvegarder la préférence de thème
//   const saveThemePreference = async (useSystemTheme, darkMode) => {
//     try {
//       const themePreference = JSON.stringify({
//         useSystemTheme,
//         darkMode,
//       });
//       await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themePreference);
//     } catch (error) {
//       console.error('Erreur lors de l\'enregistrement des préférences de thème:', error);
//     }
//   };
  
//   // Basculer manuellement entre les thèmes
//   const toggleTheme = () => {
//     const newIsDark = !isDark;
//     setIsDark(newIsDark);
//     setIsSystemTheme(false);
//     saveThemePreference(false, newIsDark);
//   };
  
//   // Activer/désactiver le thème système
//   const setUseSystemTheme = (useSystem) => {
//     setIsSystemTheme(useSystem);
//     if (useSystem) {
//       setIsDark(systemColorScheme === 'dark');
//     }
//     saveThemePreference(useSystem, isDark);
//   };
  
//   // Valeur à fournir au contexte
//   const themeContextValue = {
//     colors: isDark ? darkColors : lightColors,
//     typography,
//     isDark,
//     isSystemTheme,
//     toggleTheme,
//     setUseSystemTheme,
//   };
  
//   return (
//     <ThemeContext.Provider value={themeContextValue}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeProvider;