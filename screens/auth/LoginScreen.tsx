import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    console.log('Login avec email:', email, 'et mot de passe:', password);
    // Implémenter la logique d'authentification ici
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Login avec', provider);
    // Implémenter la logique d'authentification sociale ici
  };

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.view}>
            <Text style={styles.text}>Hello Andro</Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  view:{
    flex: 1
  },
  gradient:{

  },
  text:{
    fontSize: 20
  }
});

export default LoginScreen;