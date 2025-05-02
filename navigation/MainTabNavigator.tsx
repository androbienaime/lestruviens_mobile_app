// navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MainTabParamList } from '../src/@types/navigation';
import ShopStackNavigator from './ShopNavigator';
import CartStackNavigator from './CartNavigator';
import ProfileStackNavigator from './ProfileNavigator';
import CategoriesScreen from '@/screens/shop/CategoryScreen';
import { useThemeColors, useTheme, useThemeTypography } from '@/theme';
import ChatScreen from '@/screens/chat/ChatScreen';

const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const colors = useThemeColors();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          
          if (route.name === 'Categories') {
            iconName = 'grid';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Chat') {
            iconName = 'message-circle';
          }else if (route.name === 'Profile') {
            iconName = 'user';
          }
          
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.button.primary,
        tabBarInactiveTintColor: colors.button.gray,
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: colors.border.default,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <MainTab.Screen name="Shop" component={ShopStackNavigator} options={{ title: 'Accueil' }} />
      <MainTab.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Catégories' }} />
      <MainTab.Screen name="Chat" component={ChatScreen} options={{ title: 'Leki' }} />
      <MainTab.Screen name="Cart" component={CartStackNavigator} options={{ title: 'Panier' }} />
      <MainTab.Screen name="Profile" component={ProfileStackNavigator} options={{ title: 'Profil' }} />
    </MainTab.Navigator>
  );
};

export default MainTabNavigator;