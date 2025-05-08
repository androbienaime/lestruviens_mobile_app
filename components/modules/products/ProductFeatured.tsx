import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useMemo, useState } from "react";
import { productsService } from '@/src/api/services/products.service';
import { ThemedView } from "@/components/ThemedView";
import { Product } from "@/src/@types/models";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColors, useThemeTypography } from '@/theme';
import ProductCard from "./ProductCard";
import Skeleton from "@/components/skeletonPlaceholder";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  refreshTrigger? : number;
};

const ProductFeatured = ({refreshTrigger, ...otherProps} : Props)=>{
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);    
    const colors = useThemeColors();
    const typography = useThemeTypography();

    const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
  
    useEffect(() => {
        const fetchProducts = async () => {
          setLoading(true);
          const productsParams = {
            'page' : 1,
            'per_page' : 4,
          };

          try {
            const response = (await productsService.getProducts(productsParams));
            if(response){
              setProducts(response.data.sort((a, b) => a.id - b.id));
            }
          } catch (error) {
            setProducts([]);
            console.error('Erreur en récupérant les produits :', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, [refreshTrigger]);
    
     
    
      return (
        <ThemedView style={styles.container}>
            <View style={styles.titleWrapper}>
                <ThemedView style={styles.titleFeatured}>
                    <ThemedText style={styles.title}>Vente Phare</ThemedText>
                    <ThemedView style={styles.timerFeatured}>
                        <Ionicons name="timer" size={8} />
                        <ThemedText style={{ fontSize: 8, fontWeight: "500"}}>02:05:03:36</ThemedText>
                    </ThemedView>
                </ThemedView>
                <Pressable style={styles.titleBtnWrapper}>
                    <ThemedText style={styles.titleBtn}>See All</ThemedText>
                    <Ionicons name="arrow-forward-outline" />
                </Pressable>
            </View>
            {loading ? (
                <Skeleton.Products 
                  itemCount={3} 
                  isHorizontal={true}
                />
            ) : (
                <FlatList 
                    horizontal
                    showsHorizontalScrollIndicator
                    data={products} 
                    
                    keyExtractor={(item) => item.slug.toString()}
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
      marginBottom: 5
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
        ...typography.h5,
        color: colors.text.primary
    },
        titleBtnWrapper:{
        flexDirection: "row",
        alignItems: "center",
    },
    titleFeatured:{
        flexDirection: "row",
        alignItems:"flex-start",
    },
    timerFeatured:{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        backgroundColor: colors.button.secondary,
        borderRadius: 32,
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
export default ProductFeatured;