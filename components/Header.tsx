import React, { useState } from "react";
import { ThemedView } from "./ThemedView";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchProduct from "./modules/products/SearchProduct";
import { useThemeColors } from "@/theme";

const Header = () => {
    const [searchText, setSearchText] = useState('');
    const colors = useThemeColors();

    const handleSearch = () => {
      console.log('Recherche de:', searchText);
    };
  
    const handleCameraPress = () => {
      console.log('Caméra activée');
    };

    return (
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
    )
}

const styles = StyleSheet.create({
    header :{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      marginLeft: 10
    },
    searchWrapper:{
        flex: 1,
        maxWidth: '80%'
    },
    iconButtons:{
      marginLeft: 10,
      padding: 6,
    }
  })
export default Header;