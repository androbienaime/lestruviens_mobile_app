import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/theme";
import { ThemedView } from "@/components/ThemedView";
import ProductList from "@/components/modules/products/ProductList";
import CategoriesList from "@/components/modules/categories/CategoriesList";
import HomeSlider from "@/components/HomeSlider";
import ProductFeatured from "@/components/modules/products/ProductFeatured";
import Header from "@/components/Header";
import { FlatList } from "react-native";

const HomeScreen = () => {
  const colors = useThemeColors();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1); // 🔁 Incrémente pour signaler un refresh

    // Simule une requête API ou un rechargement
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);
  
  return (
    <SafeAreaView style={{ backgroundColor: colors.background.primary, flex: 1 }}>
      <ThemedView>
        <Header />
        <CategoriesList />
        <FlatList
          data={[1]} // dummy item
          keyExtractor={() => "home-section"}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={() => (
            <View>
              <ProductFeatured refreshTrigger={refreshTrigger}/>
              <ProductList refreshTrigger={refreshTrigger} initialLimit={6}/>
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              <HomeSlider style={{ marginLeft: 18 }} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 190 }} // ajuste selon la tab bar
        />
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
  },
});

export default HomeScreen;
