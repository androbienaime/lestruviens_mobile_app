import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import RootNavigator from './navigation/RootNavigator';


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

// Root App component
export default function App() {

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <NavigationContainer linking={linking} theme={MyTheme}>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Register the App component
AppRegistry.registerComponent('main', () => App);