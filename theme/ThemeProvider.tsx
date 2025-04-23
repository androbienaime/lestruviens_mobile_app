import React, { useState, useEffect, ReactNode } from 'react';
import { useColorScheme, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeContext from './ThemeContext';
import typography from './typography';
import { lightColors, darkColors } from './colors';
import configureShadows from './shadows';

type Props = {
  children: ReactNode;
}

const THEME_PREFERENCE_KEY = '@app_theme_preference';

export const ThemeProvider = ({ children } : Props) => {
  const systemColorScheme = useColorScheme();
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Surveiller les changements d'état de l'application pour détecter les changements de thème système
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Recharger la préférence de thème quand l'app revient au premier plan
  useEffect(() => {
    if (appState === 'active' && isSystemTheme) {
      // Actualiser le thème si l'utilisateur a peut-être changé les préférences système
      setIsDark(systemColorScheme === 'dark');
    }
  }, [appState, isSystemTheme, systemColorScheme]);
  
  // Charger la préférence de thème au démarrage
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  // Mettre à jour le thème lorsque le système change (si le thème système est activé)
  useEffect(() => {
    if (isSystemTheme) {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemTheme]);
  
  // Charger la préférence de thème depuis le stockage
  const loadThemePreference = async () => {
    try {
      const themePreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (themePreference !== null) {
        const { useSystemTheme, darkMode } = JSON.parse(themePreference);
        setIsSystemTheme(useSystemTheme);
        if (!useSystemTheme) {
          setIsDark(darkMode);
        } else {
          // Si on utilise le thème système, s'assurer qu'on a bien la dernière valeur
          setIsDark(systemColorScheme === 'dark');
        }
      } else {
        // Par défaut, utiliser le thème système si aucune préférence n'est enregistrée
        setIsSystemTheme(true);
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences de thème:', error);
    }
  };
  
  // Sauvegarder la préférence de thème
  const saveThemePreference = async (useSystemTheme : boolean, darkMode: boolean) => {
    try {
      const themePreference = JSON.stringify({
        useSystemTheme,
        darkMode,
      });
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themePreference);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des préférences de thème:', error);
    }
  };
  
  // Basculer manuellement entre les thèmes
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setIsSystemTheme(false);
    saveThemePreference(false, newIsDark);
  };
  
  // Activer/désactiver le thème système
  const setUseSystemTheme = (useSystem : boolean) => {
    setIsSystemTheme(useSystem);
    if (useSystem) {
      setIsDark(systemColorScheme === 'dark');
    }
    saveThemePreference(useSystem, isDark);
  };
  
  
  // Par celle-ci:
  const colors = isDark ? darkColors : lightColors;
  const shadows = configureShadows(isDark, colors);
  
  // Valeur à fournir au contexte
  const themeContextValue = {
    colors: isDark ? darkColors : lightColors,
    typography,
    isDark,
    isSystemTheme,
    toggleTheme,
    setUseSystemTheme,
    systemColorScheme, // Exposer la valeur du thème système pour plus de flexibilité
  };
  
  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;