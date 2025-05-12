import React, { useMemo, useState } from "react";
import { ThemedView } from "./ThemedView";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchProduct from "./modules/products/SearchProduct";
import { typography, useThemeColors } from "@/theme";
import SearchProductComponent from "./modules/products/SearchProductComponent";
import { useNavigation } from "@react-navigation/native";

type Props = {
    backgroundColor ?: string;
    inputBackground ?: string;
    previousButton?: boolean;
    style?: ViewStyle;
};
const Header = (
  {backgroundColor = "", 
    inputBackground = "",
    previousButton = false,
    style,
    ...otherProps} : Props) => {
    const colors = useThemeColors();

    const styles = useMemo(() => createStyles(colors, typography, backgroundColor), [colors, typography, backgroundColor]);
    const navigation = useNavigation();

    return (
        <ThemedView style={[styles.header, style]}  {...otherProps}>
          {previousButton && (
            <ThemedView style={styles.iconButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={colors.button.primary} />
              </TouchableOpacity>
            </ThemedView>
          )}
          <ThemedView style={styles.searchWrapper} >
              <SearchProductComponent backgroundColor={inputBackground} />
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

const createStyles = (colors: any, typography: any, backgroundColor: string) =>
  StyleSheet.create({
      header :{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        marginLeft: 10,
        backgroundColor: backgroundColor
      },
      searchWrapper:{
          flex: 1,
          maxWidth: '80%',
          backgroundColor: backgroundColor
      },
      iconButtons:{
        marginLeft: 10,
        padding: 6,
        backgroundColor: backgroundColor
      }
  })
export default Header;