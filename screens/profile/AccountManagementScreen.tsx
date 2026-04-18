import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";   
import AccountsManagerScreen from "../Accountsmanagerscreen";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color: [string, string, ...string[]];
};

const AccountManagementScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <>
      <AccountsManagerScreen onAddAccount={() => {
          navigation.navigate('Auth', { screen: 'Login' })// Navigue vers l'écran de connexion pour ajouter un nouveau compte
      }} />
    </>
  )
}

export default AccountManagementScreen;