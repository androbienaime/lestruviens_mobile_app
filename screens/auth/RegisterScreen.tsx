import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomAnimated from '@/components/CustomAnimated';
import { ThemedView } from '@/components/ThemedView';
import InputField from '@/components/InputField';
import ThemedButton from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { lightColors } from '@/theme';
import { ThemedLink } from '@/components/ThemedLink';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <CustomAnimated>
          <View style={styles.header}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
            />
            <ThemedText type='subtitle1'>Créer un compte</ThemedText>
            <ThemedText type='subtitle2'>
              Rejoignez-nous et découvrez toutes nos fonctionnalités
            </ThemedText>
          </View>

          <View style={styles.form}>
            <InputField
              label="Nom complet"
              placeholder="Nom complet"
              leftIconName="person-outline"
              value={name}
              onChangeText={setName}
            />

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

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedLink >Mot de passe oublié?</ThemedLink>
            </TouchableOpacity>

            <ThemedButton 
                  title="S'inscrire" 
                  fullWidth
                  size="medium"
                  variant={'primary'}
                />
            
          </View>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Ou continuer avec</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('@/assets/images/google.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('@/assets/images/apple.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('@/assets/images/facebook.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require('@/assets/images/tiktok.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte? </Text>
              <ThemedLink >Se connecter</ThemedLink>
          </View>
          </CustomAnimated>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2138',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7B8794',
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8E54E9',
    fontWeight: '500',
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E8EF',
  },
  separatorText: {
    color: '#7B8794',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    width: 28,
    height: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
    // marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#7B8794',
  },
  loginText: {
    fontSize: 14,
    color: '#8E54E9',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1
  },
});

export default RegisterScreen;