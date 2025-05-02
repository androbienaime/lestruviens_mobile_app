import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
import { productsService } from '@/src/api/services/products.service';
import { ThemedView } from "@/components/ThemedView";
import { Product } from "@/src/@types/models";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchProduct from "@/components/modules/products/SearchProduct";
import { useThemeColors, useThemeTypography, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

const ProductList = ()=>{
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);    
    const colors = useThemeColors();

  
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = (await productsService.getProducts());
            if(response){
              setProducts(response.data);
            }
          } catch (error) {
            console.error('Erreur en récupérant les produits :', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, []);
    
      if (loading) {
        return <Text>Chargement...</Text>;
      }
    
    return (
        <ThemedView style={styles.container}>
              {products && products.length > 0 ? (
                  products.map((product, index) => (
                      <ThemedView key={product.slug || index}>
                          <Text>{product.name}</Text>
                          <Text>{product.price}</Text>
                      </ThemedView>
                  ))
              ) : (
                  <Text>Aucun produit disponible</Text>
              )}
        </ThemedView>
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
export default ProductList;