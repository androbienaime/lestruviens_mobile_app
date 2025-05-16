import CustomAnimated from '@/components/forms/CustomAnimated';
import InputField from '@/components/forms/InputField';
import { Link } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import React, { useState } from 'react';
import { ThemedView } from '../../components/ThemedView';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ThemedButton from '@/components/ThemedButton';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', email, password);
  };

  const handleSocial = (provider: string) => {
    console.log(`Connexion avec ${provider}`);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ThemedView style={styles.safe}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <CustomAnimated>
              <View style={styles.header}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                />
                <Text style={styles.title}>Connexion</Text>
                <Text style={styles.subtitle}>Heureux de vous revoir !</Text>
              </View>

              <View style={styles.form}>
                <InputField
                  label="Email"
                  placeholder="Email"
                  leftIconName="mail-outline"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />

                <InputField
                  isPasswordInput={true}
                  label="Email"
                  placeholder="Mot de passe"
                  leftIconName="lock-closed-outline"
                  keyboardType="email-address"
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.forgot}>
                  <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>

                <ThemedButton 
                  title="Se connecter" 
                  onPress={handleLogin}
                  fullWidth
                  size="medium"
                  variant={'primary'}
                />

                {/* <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity> */}
              </View>

              <View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.or}>ou</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                {['Google', 'Facebook', 'Apple', 'Tiktok'].map((provider) => (
                  <TouchableOpacity
                    key={provider}
                    style={styles.socialButton}
                    onPress={() => handleSocial(provider)}
                  >
                    <Image
                        source={
                          provider === 'Google'
                            ? require('@/assets/images/google.png')
                            : provider === 'Facebook'
                            ? require('@/assets/images/facebook.png')
                            : provider === 'Apple'
                            ? require('@/assets/images/apple.png')
                            : require('@/assets/images/tiktok.png')
                        }
                        style={styles.socialIcon}
                      />

                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.signup}>
                <Text style={styles.signupText}>Pas encore inscrit ? </Text>
                <Link href={"../screens/RegisterScreen"}>
                  <Text style={styles.signupLink}>Créer un compte</Text>
                </Link>
              </View>
              </CustomAnimated>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    marginBottom: 24,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#1E5A9D',
    fontWeight: '500',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1E5A9D',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  or: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 70,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  socialIcon: {
    width: 26,
    height: 26,
  },
  signup: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signupLink: {
    color: '#1E5A9D',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LoginScreen;
