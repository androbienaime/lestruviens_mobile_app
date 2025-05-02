// navigation/ShopNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from '../src/@types/navigation';
import HomeScreen from '../screens/shop/HomeScreen';
import CategoryScreen from '../screens/shop/CategoryScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
// import SearchScreen from '../screens/shop/SearchScreen';

const ShopStack = createNativeStackNavigator<ShopStackParamList>();

const ShopStackNavigator: React.FC = () => {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerBackVisible: false,
      }}
    >
      <ShopStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Accueil', headerShown: false }}
    
      />
      <ShopStack.Screen 
        name="Category" 
        component={CategoryScreen} 
        options={({ route }) => ({ title: route.params.title })} 
      />
      <ShopStack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={{ title: 'Détails du produit' }} 
      />
      {/* <ShopStack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Recherche' }} 
      /> */}
    </ShopStack.Navigator>
  );
};

export default ShopStackNavigator;