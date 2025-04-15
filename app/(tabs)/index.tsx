import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoginScreen from '@/screens/auth/LoginScreen';

export default function HomeScreen() {
  return (
      <ThemedView>
        <LoginScreen />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
 
});
