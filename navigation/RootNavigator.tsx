// navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { RootStackParamList } from '../src/@types/navigation';
import AuthStackNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
// import ProductModalScreen from '../screens/ProductModalScreen';
// import LoadingScreen from '../screens/LoadingScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();


  if (isLoading) {
    // return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {true ? (
        <>
          <RootStack.Screen name="Main" component={MainTabNavigator} />
          {/* <RootStack.Group screenOptions={{ presentation: 'modal' }}>
            <RootStack.Screen 
              name="ProductModal" 
              component={ProductModalScreen} 
              options={{ 
                animation: 'slide_from_bottom',
                headerShown: true,
                title: 'Aperçu du produit',
              }}
            />
          </RootStack.Group> */}
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;