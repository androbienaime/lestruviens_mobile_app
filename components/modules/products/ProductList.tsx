import { ThemedText } from "@/components/ThemedText";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { productsService } from '@/src/api/services/products.service';
import { ThemedView } from "@/components/ThemedView";
import { Product } from "@/src/@types/models";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors, useThemeTypography } from '@/theme';
import ProductCard from "./ProductCard";
import Skeleton from "@/components/skeletonPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { PaginatedResponse } from '../../../src/@types/api';

type Props = {
  refreshTrigger?: number;
  categoryId?: string;
  searchQuery?: string;
  initialLimit?: number;
};

const ProductList = ({
  refreshTrigger, 
  categoryId,
  searchQuery,
  initialLimit = 2,
}: Props) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);   
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const colors = useThemeColors();
    const typography = useThemeTypography();

    const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
  
    // Constants to avoid re-creating objects on each render
    const COLUMN_WRAPPER_STYLE:ViewStyle = {
      justifyContent: "space-between", 
      marginBottom: 20
    };

    // Memoizing footer component to prevent unnecessary re-renders
    const FooterComponent = memo(({ hasMore, loading }: { hasMore: boolean, loading: boolean }) => {
      const colors = useThemeColors();
      const typography = useThemeTypography();
      const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
      
      if (!hasMore) return null;
      
      return (
        <>
          <ThemedView style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.button.primary} />
            {/* <Text style={styles.loadingText}>Chargement...</Text> */}
          </ThemedView>
          {loading && (
            <ThemedView>
              <Skeleton.Products 
                itemCount={2} // Reduced for better performance
                isHorizontal={false}
              />
            </ThemedView>
          )}
        </>
      );
    });

    // Memoizing empty component
    const EmptyComponent = memo(() => {
      const colors = useThemeColors();
      const typography = useThemeTypography();
      const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
      
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun produit trouvé</Text>
        </View>
      );
    });


    const loadProducts = useCallback(
      async(page: number, refresh: boolean = false) => {
          // Si on rafraîchit, on ne vérifie pas les conditions précédentes
          // if (!refresh && ((!hasMore) || loading)) {
          //   console.log("Chargement ignoré car:", { hasMore, loading });
          //   return;
          // }
          
          if (refresh) {
            setLoading(true);
          }

          // console.log(`Chargement page ${page}, refresh=${refresh}`);

          try {
            let response: any; // Utilisation de any pour débugger

            // Modification des paramètres pour correspondre à l'API
            const paginationParams = {
              'page' : page,
              'per_page': initialLimit,
            };

            // console.log("Params d'appel API:", paginationParams);

            if (categoryId) {
              response = await productsService.getProductsByCategory(categoryId, paginationParams);
            } else if (searchQuery) {
              response = await productsService.searchProducts(searchQuery, paginationParams);
            } else {
              response = await productsService.getProducts(paginationParams);
            }

            // console.log("Structure complète de la réponse:", JSON.stringify(response));

            // Extraction des données avec vérification complète de la structure
            let productData = [];
            let totalPages = 1;
            let currentPageFromApi = page;
            
            // Analyse de la structure pour trouver les données des produits
            if (Array.isArray(response)) {
              productData = response;
            } else if (response && typeof response === 'object') {
              if (Array.isArray(response.data)) {
                productData = response.data;
              } else if (response.data && Array.isArray(response.data.data)) {
                productData = response.data.data;
              }
              
              // Trouver le nombre total de pages
              totalPages = response.total_pages || response.last_page || 
                           response.meta?.last_page || response.meta?.total_pages || 1;
              
              // Trouver la page actuelle
              currentPageFromApi = response.current_page || response.meta?.current_page || page;
            }
            
            // console.log(`Produits trouvés: ${productData.length}, totalPages: ${totalPages}`);

            if (refresh) {
              // console.log("Réinitialisation des produits");
              setProducts(productData);
              setCurrentPage(1);
            } else {
              // console.log("Ajout de produits à la liste existante");
              setProducts((prevProducts) => [...prevProducts, ...productData]);
              setCurrentPage(currentPageFromApi);
            }
            
            setHasMore(currentPageFromApi < totalPages);
            // console.log(`hasMore défini à: ${currentPageFromApi < totalPages}`);
          } catch(error) {
            // console.error('Error loading products:', error);
            if (refresh) {
              setProducts([]);
            }
          } finally {
            setLoading(false);
            setRefreshing(false);
          }
    }, [categoryId, searchQuery, initialLimit]);

    // Initial load and reload when dependencies change
    useEffect(() => {
      // console.log("Déclenchement du chargement initial");
      setLoading(true);
      setProducts([]);
      setCurrentPage(1);
      setHasMore(true);
      loadProducts(1, true);
    }, [categoryId, searchQuery, initialLimit, loadProducts]);
    
    const handleRefresh = useCallback(() => {
      // console.log("Refreshing products...");
      setRefreshing(true);
      setHasMore(true);
      loadProducts(1, true);
    }, [loadProducts]);

    // Effet séparé pour gérer le refreshTrigger
    useEffect(() => {
      if (refreshTrigger !== undefined) {
        // console.log("Refresh triggered par refreshTrigger");
        handleRefresh();
      }
    }, [refreshTrigger, handleRefresh]);

    const handleLoadMore = useCallback(() => {
      // console.log("Loading more products...", { hasMore, loading, currentPage });
      if (hasMore && !loading) {
        // console.log("Chargement de la page suivante:", currentPage + 1);
        loadProducts(currentPage + 1, false);
      }
    }, [hasMore, loading, currentPage, loadProducts]);
  
    const renderFooter = useCallback(() => (
      <FooterComponent hasMore={hasMore} loading={loading} />
    ), [hasMore, loading]);
  
    const renderEmpty = useCallback(() => {
      if (loading && products.length === 0) return null;
      return <EmptyComponent />;
    }, [loading, products.length]);
    
    return (
      <ThemedView>
          <View style={styles.titleWrapper}>
              <Text style={styles.title}>For you</Text>
              <Pressable style={styles.titleBtnWrapper}>
                  <ThemedText style={styles.titleBtn}>See All</ThemedText>
                  <Ionicons name="arrow-forward-outline" />
              </Pressable>
          </View>
          
          {/* Debug info
          <View style={styles.debugInfo}>
              <Text>Page: {currentPage}, Produits: {products.length}, Plus? {hasMore ? 'Oui' : 'Non'}</Text>
          </View> */}
          
          {loading && products.length === 0 ? (
              <Skeleton.Products 
                itemCount={4} 
                isHorizontal={false}
              />
          ) : (
              <FlatList 
                numColumns={2} 
                data={products} 
                columnWrapperStyle={COLUMN_WRAPPER_STYLE}
                keyExtractor={(item) => String(item.slug)}
                renderItem={({item, index}) => (
                  <ProductCard item={item} index={index}/>
                )}
                contentContainerStyle={styles.listContainer}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}  // Augmenté pour déclencher le chargement plus tôt
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                initialNumToRender={initialLimit}
                maxToRenderPerBatch={initialLimit * 2}
                windowSize={5}
              />
          )}
      </ThemedView>
    );
};

const createStyles = (colors: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
    },
    titleWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      marginHorizontal: 18
    },
    title: {
      ...typography.h4,
      color: colors.text.primary
    },
    titleBtn: {
      ...typography.h5,
      color: colors.text.primary
    },
    titleBtnWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    debugInfo: {
      padding: 8,
      backgroundColor: "#f0f0f0",
      borderRadius: 4,
      marginHorizontal: 16,
      marginBottom: 8
    },
    itemsWrapper: {
      flexDirection: "row",
      width: "100%",
      flexWrap: "wrap",
      alignItems: "stretch"
    },
    productWrapper: {
      width: "50%",
      marginBottom: 20
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20
    },
    footerLoader: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10
    },
    loadingText: {
      marginLeft: 10,
      color: colors.text.secondary
    },
    emptyContainer: {
      padding: 20,
      alignItems: "center"
    },
    emptyText: {
      ...typography.body1,
      color: colors.text.secondary
    }
  });

export default ProductList;