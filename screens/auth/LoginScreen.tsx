import CustomAnimated from '@/components/forms/CustomAnimated';
import InputField from '@/components/forms/InputField';
import React, { useState } from 'react';
import { ThemedView } from '../../components/ThemedView';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ThemedButton from '@/components/ThemedButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

// Paramètre optionnel passé par AccountManagementScreen
// pour signaler qu'on ajoute un nouveau compte (et non un premier login)
type RouteParams = {
  isAddingAccount?: boolean;
};

// ─── Composant ────────────────────────────────────────────────────────────────

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const params = (route.params as RouteParams) ?? {};
  const isAddingAccount = params.isAddingAccount ?? false;

  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir l\'email et le mot de passe.');
      return;
    }

    clearError();

    // login() appelle addAccount() en interne → le compte est automatiquement
    // enregistré dans le gestionnaire multi-compte avec saveAccount: true
    await login(email.trim(), password, { saveAccount: true });

    // Si pas d'erreur après le login : naviguer selon le contexte
    // On utilise un léger délai pour laisser le state se mettre à jour
    setTimeout(() => {
      if (isAddingAccount) {
        // On revenait de AccountManagementScreen → retour arrière
        navigation.goBack();
      }
      // Sinon RootNavigator gère la redirection automatiquement
      // via isLoggedIn dans AuthContext
    }, 100);
  };

  const handleSocial = (provider: string) => {
    console.log(`Connexion avec ${provider}`);
    // TODO: implémenter OAuth pour chaque provider
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
                  <Text style={styles.title}>
                    {isAddingAccount ? 'Ajouter un compte' : 'Connexion'}
                  </Text>
                  <Text style={styles.subtitle}>
                    {isAddingAccount
                      ? 'Connectez-vous pour ajouter ce compte'
                      : 'Heureux de vous revoir !'}
                  </Text>
                </View>

                {/* Message d'erreur API */}
                {error ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.form}>
                  <InputField
                    label="Email"
                    placeholder="Email"
                    leftIconName="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(v) => { setEmail(v); clearError(); }}
                  />

                  <InputField
                    isPasswordInput={true}
                    label="Mot de passe"
                    placeholder="Mot de passe"
                    leftIconName="lock-closed-outline"
                    value={password}
                    onChangeText={(v) => { setPassword(v); clearError(); }}
                  />

                  <TouchableOpacity
                    style={styles.forgot}
                    onPress={() => navigation.navigate('Auth', { screen: 'ForgotPassword' })}
                  >
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>

                  <ThemedButton
                    title={isLoading ? '' : 'Se connecter'}
                    onPress={handleLogin}
                    fullWidth
                    size="medium"
                    variant="primary"
                    disabled={isLoading}
                  />

                  {/* Spinner par-dessus le bouton pendant le chargement */}
                  {isLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator color="#fff" />
                    </View>
                  )}

                  {/* Bouton retour si on ajoutait un compte */}
                  {isAddingAccount && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.cancelText}>Annuler</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Séparateur + réseaux sociaux (masqués si ajout de compte) */}
                {!isAddingAccount && (
                  <>
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
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                      >
                        <Text style={styles.signupLink}>Créer un compte</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </CustomAnimated>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ThemedView>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
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
  loadingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  // Ancien style button conservé (utilisé en commentaire dans l'original)
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