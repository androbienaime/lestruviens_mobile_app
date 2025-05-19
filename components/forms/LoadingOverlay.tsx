import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/theme';

type LoadingOverlayProps = {
  visible: boolean;
};

const LoadingOverlay = ({ visible }: LoadingOverlayProps) => {
  const colors = useThemeColors();

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={colors.button.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
  },
  loadingBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});

export default LoadingOverlay;