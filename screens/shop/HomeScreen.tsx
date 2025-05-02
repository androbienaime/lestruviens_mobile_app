import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchProduct from "@/components/modules/products/SearchProduct";
import { useThemeColors, useThemeTypography, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import ProductList from "@/components/modules/products/ProductList";

const HomeScreen = ()=>{
    const [searchText, setSearchText] = useState('');
    const colors = useThemeColors();

    const handleSearch = () => {
      console.log('Recherche de:', searchText);
    };
  
    const handleCameraPress = () => {
      console.log('Caméra activée');
    };
    
    return (
        <SafeAreaView style={{backgroundColor: colors.background.primary, flex: 1 }}>
          <ThemedView style={styles.header}>
            <ThemedView style={styles.searchWrapper}>
                <SearchProduct
                    value={searchText}
                    onChangeText={setSearchText}
                    onSearch={handleSearch}
                    onCameraPress={handleCameraPress}
                />
            </ThemedView>

            <ThemedView style={styles.iconButtons}>
              <TouchableOpacity onPress={() => console.log('Wishlist')}>
                <Ionicons name="filter-outline" size={28} color={colors.button.primary} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.iconButtons}>
              <TouchableOpacity onPress={() => console.log('Wishlist')}>
                <Ionicons name="heart-outline" size={28} color={colors.button.primary} />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          <ThemedView>
              <ProductList />
          </ThemedView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container:{
    // flex : 1,
    padding: 8
  },
  header :{
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  searchWrapper:{
      flex: 1,
      maxWidth: '80%'
  },
  iconButtons:{
    marginLeft: 10,
    padding: 6
  }
})
export default HomeScreen;