import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoginScreen from '@/screens/auth/LoginScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import { Text } from 'react-native';

export default function HomeScreen() {
  

  return (
      <SafeAreaView style={styles.container}>
          <LoginScreen />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
      flex: 1
    }
});
