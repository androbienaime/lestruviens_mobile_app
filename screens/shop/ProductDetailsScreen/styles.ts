import { StyleSheet } from 'react-native';

export const createStyles = (colors: any, typography: any) =>
  StyleSheet.create({
    controlThemedView: {
      backgroundColor: colors.background.white,
    },
    container: {
      backgroundColor: colors.background.white,
      borderTopLeftRadius: 50,
      borderTopEndRadius: 50,
      minHeight: 50,
      padding: 25,
    },
    contentContainer: { 
      paddingBottom: 190  // Ajuste selon la tab bar
    },
    section: {
      marginTop: 10,
      backgroundColor: colors.background.white,
    }
  });

export default createStyles;