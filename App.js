import React, { useState } from 'react';
import { AppRegistry, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import RootNavigator from './navigation/RootNavigator';
import MultiAccountProvider, { useMultiAccount } from './context/MultiAccountContext';
import PinEntryScreen from './screens/PinEntryScreen';
import { useNavigation } from 'expo-router';


// Enable screens for better performance
enableScreens();


// Custom theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#F9F9F9',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
    notification: '#FF3B30',
  },
};

// Deep linking configuration
const linking = {
  prefixes: ['myecommerce://', 'https://myecommerce.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Shop: {
            screens: {
              Home: 'home',
              Category: 'category/:categoryId',
              ProductDetails: 'product/:productId',
              Search: 'search',
            },
          },
          Cart: {
            screens: {
              Cart: 'cart',
              Checkout: 'checkout',
              OrderConfirmation: 'order/:orderId',
            },
          },
          Profile: {
            screens: {
              Profile: 'profile',
              OrderHistory: 'orders',
              OrderDetails: 'order/:orderId',
              EditProfile: 'profile/edit',
              AddressBook: 'addresses',
              AddAddress: 'address/add',
              EditAddress: 'address/:addressId',
              PaymentMethods: 'payments',
              Settings: 'settings',
              AccountManagement: 'accountmanagement',
              AddAccount: 'users/add',
            },
          },
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      ProductModal: 'modal/product/:productId',
    },
  },
};

// ─── Gate multi-compte ────────────────────────────────────────────────────────
// Affiché OBLIGATOIREMENT à chaque ouverture de l'app.
// - 0 comptes enregistrés  → accès direct (premier lancement)
// - Comptes avec PIN        → PinEntryScreen obligatoire
// - "Mot de passe"          → navigue vers l'écran Login via RootNavigator
//
// `authenticated` repart à false à chaque lancement : on ne peut jamais
// contourner la fenêtre de connexion.

const AppGate = ({ children, onNavigateToLogin}) => {
  const { isLoading, accounts } = useMultiAccount();
  const [authenticated, setAuthenticated] = useState(false);

  if (isLoading) {
    return (
      <View style={gateStyles.loader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Premier lancement : aucun compte enregistré → accès direct au login normal
  if (accounts.length === 0) {
    return <>{children}</>;
  }

  // Pas encore authentifié dans cette session → écran PIN obligatoire
  if (!authenticated) {
    return (
      <PinEntryScreen
        // PIN correct → switch automatique + accès à l'app
        onSuccess={() => setAuthenticated(true)}
        // Préfère le mot de passe → ouvre l'app puis navigue vers Login
        onUsePassword={() => {
          setAuthenticated(true);
          onNavigateToLogin && onNavigateToLogin();
        }}
        // Pas de onSkip → la connexion est obligatoire
      />
    );
  }

  return <>{children}</>;
};

const gateStyles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
});

// ─── Root App component ───────────────────────────────────────────────────────

export default function App() {
  // Référence vers la navigation pour rediriger vers Login si besoin
  const navigationRef = React.useRef(null);

  const handleNavigateToLogin = () => {
    if (navigationRef.current) {
      navigationRef.current.navigate('Auth', { screen: 'Login' });
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {/* MultiAccountProvider doit envelopper AuthProvider */}
      <MultiAccountProvider>
        <AppGate onNavigateToLogin={handleNavigateToLogin}>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  theme={MyTheme}
                >
                  <RootNavigator />
                </NavigationContainer>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </AppGate>
      </MultiAccountProvider>
    </SafeAreaProvider>
  );
}

// Register the App component
AppRegistry.registerComponent('main', () => App);