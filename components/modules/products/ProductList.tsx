import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useMemo, useState } from "react";
import { productsService } from '@/src/api/services/products.service';
import { ThemedView } from "@/components/ThemedView";
import { Product } from "@/src/@types/models";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchProduct from "@/components/modules/products/SearchProduct";
import { useThemeColors, useThemeTypography, useTheme, typography } from '@/theme';
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "./ProductCard";
import Skeleton, { ProductsSkeletonPlaceholder } from "@/components/skeletonPlaceholder";

const ProductList = ({...otherProps})=>{
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);    
    const colors = useThemeColors();
    const typography = useThemeTypography();

    const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
  
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
    
     
    
      return (
        <ThemedView >
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>For you</Text>
                <Pressable>
                    <ThemedText style={styles.titleBtn}>See All</ThemedText>
                </Pressable>
            </View>
            {loading ? (
                <ProductsSkeletonPlaceholder 
                  itemCount={4} 
                  isHorizontal={false}
                />
            ) : (
                <FlatList 
                numColumns={2} 
                data={products} 
                columnWrapperStyle={{ justifyContent: "space-between", 
                    marginBottom: 20  }}
                keyExtractor={(item) => ""+item.id}
                renderItem={({index, item}) => 
                    <ProductCard item={item} index={index}/>
            }/>
          )}
            
        </ThemedView>
    )
}

const createStyles = (colors: any, typography: any) =>
  StyleSheet.create({
  container:{
      marginHorizontal: 20,
    },
    titleWrapper:{
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      marginHorizontal: 18
    },
    title:{
      ...typography.h4,
      color: colors.text.primary
    },
    titleBtn:{
      ...typography.h5
    },
    itemsWrapper:{
      flexDirection: "row",
      width: "100%",
      flexWrap: "wrap",
      alignItems: "stretch"
    },
    productWrapper:{
      width : "50%",
      marginBottom: 20
    }
})
export default ProductList;