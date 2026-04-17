// // import { DarkTheme, DefaultTheme } from '@react-navigation/native';
// // import { useFonts } from 'expo-font';
// // import { Stack } from 'expo-router';
// // import * as SplashScreen from 'expo-splash-screen';
// // import { StatusBar } from 'expo-status-bar';
// // import { useEffect } from 'react';
// // import 'react-native-reanimated';
// // import { ThemeProvider } from '@/theme';

// // import { useColorScheme } from '@/hooks/useColorScheme';
// // import { enableScreens } from 'react-native-screens';

// // enableScreens();
// // // Prevent the splash screen from auto-hiding before asset loading is complete.
// // SplashScreen.preventAutoHideAsync();

// // export default function RootLayout() {
// //   const colorScheme = useColorScheme();
// //   const [loaded] = useFonts({
// //     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
// //   });

// //   useEffect(() => {
// //     if (loaded) {
// //       SplashScreen.hideAsync();
// //     }
// //   }, [loaded]);

// //   if (!loaded) {
// //     return null;
// //   }

// //   return (
// //     // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
// //     <ThemeProvider>
// //       <Stack>
// //         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
// //         <Stack.Screen name="+not-found" />
// //       </Stack>
// //       <StatusBar style="auto" />
// //     </ThemeProvider>
// //   );
// // }


// // // app/_layout.tsx
// // import React from 'react';
// // import { NavigationContainer, DefaultTheme, LinkingOptions } from '@react-navigation/native';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { StatusBar } from 'react-native';
// // import { enableScreens } from 'react-native-screens';
// // import { AuthProvider } from '../context/AuthContext';
// // import { CartProvider } from '../context/CartContext';
// // import { ProductProvider } from '../context/ProductContext';
// // import RootNavigator from '../navigation/RootNavigator';
// // import { RootStackParamList } from '../@types/navigation';

// // // Enable screens for better performance
// // enableScreens();

// // // Custom theme
// // const MyTheme = {
// //   ...DefaultTheme,
// //   colors: {
// //     ...DefaultTheme.colors,
// //     primary: '#007AFF',
// //     background: '#F9F9F9',
// //     card: '#FFFFFF',
// //     text: '#000000',
// //     border: '#E0E0E0',
// //     notification: '#FF3B30',
// //   },
// // };

// // // Deep linking configuration
// // const linking: LinkingOptions<RootStackParamList> = {
// //   prefixes: ['myecommerce://', 'https://myecommerce.com'],
// //   config: {
// //     screens: {
// //       Main: {
// //         screens: {
// //           Shop: {
// //             screens: {
// //               Home: 'home',
// //               Category: 'category/:categoryId',
// //               ProductDetails: 'product/:productId',
// //               Search: 'search',
// //             },
// //           },
// //           Cart: {
// //             screens: {
// //               Cart: 'cart',
// //               Checkout: 'checkout',
// //               OrderConfirmation: 'order/:orderId',
// //             },
// //           },
// //           Profile: {
// //             screens: {
// //               Profile: 'profile',
// //               OrderHistory: 'orders',
// //               OrderDetails: 'order/:orderId',
// //               EditProfile: 'profile/edit',
// //               AddressBook: 'addresses',
// //               AddAddress: 'address/add',
// //               EditAddress: 'address/:addressId',
// //               PaymentMethods: 'payments',
// //               Settings: 'settings',
// //             },
// //           },
// //         },
// //       },
// //       Auth: {
// //         screens: {
// //           Login: 'login',
// //           Register: 'register',
// //           ForgotPassword: 'forgot-password',
// //         },
// //       },
// //       ProductModal: 'modal/product/:productId',
// //     },
// //   },
// // };

// // // Root Layout
// // export default function Layout() {
// //   return (
// //     <SafeAreaProvider>
// //       <StatusBar barStyle="dark-content" />
// //       <AuthProvider>
// //         <ProductProvider>
// //           <CartProvider>
// //             <NavigationContainer linking={linking} theme={MyTheme}>
// //               <RootNavigator />
// //             </NavigationContainer>
// //           </CartProvider>
// //         </ProductProvider>
// //       </AuthProvider>
// //     </SafeAreaProvider>
// //   );
// // }

// import React, { useState } from 'react';
// import { Stack, router } from 'expo-router';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
// import { enableScreens } from 'react-native-screens';
// import { AuthProvider } from '../context/AuthContext';
// import { CartProvider } from '../context/CartContext';
// import { ProductProvider } from '../context/ProductContext';
// import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
// import MultiAccountProvider, { useMultiAccount } from '../context/MultiAccountContext';
// import PinEntryScreen from '../screens/PinEntryScreen';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';

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

// // ─── Gate multi-compte : affiché OBLIGATOIREMENT à chaque ouverture ──────────
// // À chaque lancement de l'app, l'utilisateur DOIT passer par l'écran de
// // connexion (PIN ou mot de passe), même si un compte était actif en mémoire.
// //
// // Logique :
// //   - Premier lancement (0 comptes)  → login classique directement
// //   - Comptes avec PIN enregistrés   → PinEntryScreen obligatoire
// //   - Comptes sans PIN               → PinEntryScreen avec option "mot de passe"
// //     qui redirige vers auth/login

// const AppGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isLoading, hasPinAccounts, accounts } = useMultiAccount();

//   // true uniquement après une authentification réussie dans cette session
//   const [authenticated, setAuthenticated] = useState(false);

//   // Chargement initial du store multi-compte
//   if (isLoading) {
//     return (
//       <View style={gateStyles.loader}>
//         <ActivityIndicator size="large" color="#6366F1" />
//       </View>
//     );
//   }

//   // Premier lancement : aucun compte enregistré → login classique
//   if (accounts.length === 0) {
//     return <>{children}</>;
//   }

//   // Authentification non encore effectuée dans cette session → écran obligatoire
//   if (!authenticated) {
//     return (
//       <PinEntryScreen
//         // PIN reconnu → switch automatique + accès à l'app
//         onSuccess={() => setAuthenticated(true)}
//         // Préfère le mot de passe → redirige vers login classique puis ouvre l'app
//         onUsePassword={() => {
//           setAuthenticated(true);
//           router.replace('/auth/login');
//         }}
//         // Pas de onSkip → la fenêtre de connexion est OBLIGATOIRE
//       />
//     );
//   }

//   // Authentifié → app normale
//   return <>{children}</>;
// };

// const gateStyles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0F172A',
//   },
// });

// // ─── Root Layout ──────────────────────────────────────────────────────────────

// export default function Layout() {
//   return (
//     <SafeAreaProvider>
//       <StatusBar style="dark" />
//       <ThemeProvider value={MyTheme}>
//         {/* MultiAccountProvider doit envelopper AuthProvider */}
//         <MultiAccountProvider>
//           <AppGate>
//             <AuthProvider>
//               <ProductProvider>
//                 <CartProvider>
//                   <Stack>
//                     <Stack.Screen name="index" options={{ headerShown: false }} />
//                     <Stack.Screen name="auth/login" options={{ headerShown: false }} />
//                     <Stack.Screen name="auth/register" options={{ headerShown: false }} />
//                     <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
//                     {/* Écran de gestion des comptes (accessible depuis les paramètres) */}
//                     <Stack.Screen
//                       name="screens/AccountsManagerScreen"
//                       options={{ title: 'Comptes enregistrés', headerShown: true }}
//                     />
//                     {/* Ajoutez ici les autres écrans selon votre structure */}
//                   </Stack>
//                 </CartProvider>
//               </ProductProvider>
//             </AuthProvider>
//           </AppGate>
//         </MultiAccountProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }