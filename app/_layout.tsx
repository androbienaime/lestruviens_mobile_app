// import { DarkTheme, DefaultTheme } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';
// import { ThemeProvider } from '@/theme';

// import { useColorScheme } from '@/hooks/useColorScheme';
// import { enableScreens } from 'react-native-screens';

// enableScreens();
// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//     <ThemeProvider>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }


// // app/_layout.tsx
// import React from 'react';
// import { NavigationContainer, DefaultTheme, LinkingOptions } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { StatusBar } from 'react-native';
// import { enableScreens } from 'react-native-screens';
// import { AuthProvider } from '../context/AuthContext';
// import { CartProvider } from '../context/CartContext';
// import { ProductProvider } from '../context/ProductContext';
// import RootNavigator from '../navigation/RootNavigator';
// import { RootStackParamList } from '../@types/navigation';

// // Enable screens for better performance
// enableScreens();

// // Custom theme
// const MyTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#007AFF',
//     background: '#F9F9F9',
//     card: '#FFFFFF',
//     text: '#000000',
//     border: '#E0E0E0',
//     notification: '#FF3B30',
//   },
// };

// // Deep linking configuration
// const linking: LinkingOptions<RootStackParamList> = {
//   prefixes: ['myecommerce://', 'https://myecommerce.com'],
//   config: {
//     screens: {
//       Main: {
//         screens: {
//           Shop: {
//             screens: {
//               Home: 'home',
//               Category: 'category/:categoryId',
//               ProductDetails: 'product/:productId',
//               Search: 'search',
//             },
//           },
//           Cart: {
//             screens: {
//               Cart: 'cart',
//               Checkout: 'checkout',
//               OrderConfirmation: 'order/:orderId',
//             },
//           },
//           Profile: {
//             screens: {
//               Profile: 'profile',
//               OrderHistory: 'orders',
//               OrderDetails: 'order/:orderId',
//               EditProfile: 'profile/edit',
//               AddressBook: 'addresses',
//               AddAddress: 'address/add',
//               EditAddress: 'address/:addressId',
//               PaymentMethods: 'payments',
//               Settings: 'settings',
//             },
//           },
//         },
//       },
//       Auth: {
//         screens: {
//           Login: 'login',
//           Register: 'register',
//           ForgotPassword: 'forgot-password',
//         },
//       },
//       ProductModal: 'modal/product/:productId',
//     },
//   },
// };

// // Root Layout
// export default function Layout() {
//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle="dark-content" />
//       <AuthProvider>
//         <ProductProvider>
//           <CartProvider>
//             <NavigationContainer linking={linking} theme={MyTheme}>
//               <RootNavigator />
//             </NavigationContainer>
//           </CartProvider>
//         </ProductProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }

import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
import { ThemeProvider } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';

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

// Root Layout
export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ThemeProvider value={MyTheme}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                <Stack.Screen name="auth/register" options={{ headerShown: false }} />
                <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
                {/* Ajoutez ici les autres écrans selon votre structure */}
              </Stack>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
