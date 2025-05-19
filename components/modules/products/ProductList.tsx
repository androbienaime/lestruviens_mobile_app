import { ThemedText } from "@/components/ThemedText";
import React, { memo, useCallback, useMemo } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors, useThemeTypography } from '@/theme';
import ProductCard from "./ProductCard";
import Skeleton from "@/components/skeletonPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { useProducts } from "@/context/ProductContext";

type Props = {
  refreshTrigger?: number;
  globalRefreshing?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
};

const ProductList = ({
  refreshTrigger,
  globalRefreshing = false,
  onLoadStart,
  onLoadEnd,
}: Props) => {
    // Utilisation du contexte au lieu d'avoir l'état local
    const {
      products,
      loading,
      hasMore,
      refreshing,
      handleRefresh,
      handleLoadMore,
    } = useProducts();

    const colors = useThemeColors();
    const typography = useThemeTypography();

    const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
  
    // Constants to avoid re-creating objects on each render
    const COLUMN_WRAPPER_STYLE: ViewStyle = {
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
            {/* <ActivityIndicator size="small" color={colors.button.primary} /> */}
          </ThemedView>
          {/* {loading && ( */}
            <ThemedView>
              <Skeleton.Products 
                itemCount={2}
                isHorizontal={false}
              />
            </ThemedView>
          {/* )} */}
        </>
      );
    });

    // Memoizing empty component
    const EmptyComponent = memo(() => {
      const colors = useThemeColors();
      const typography = useThemeTypography();
      const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
      
      return (
        // <View style={styles.emptyContainer}>
        //   <Text style={styles.emptyText}>Aucun produit trouvé</Text>
        // </View>
        <></>
      );
    });

    // Effet pour gérer le refreshTrigger via un useEffect dans le composant parent si nécessaire

    const handleRefreshWithCallbacks = useCallback(() => {
      if (!globalRefreshing) {
        onLoadStart?.();
        handleRefresh();
        onLoadEnd?.();
      }
    }, [handleRefresh, globalRefreshing, onLoadStart, onLoadEnd]);
  
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
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshing={globalRefreshing || refreshing}
                onRefresh={handleRefreshWithCallbacks}
                initialNumToRender={4}
                maxToRenderPerBatch={8}
                windowSize={5}
                // Désactive le comportement de scrolling interne quand le parent gère déjà le refresh
                scrollEnabled={!globalRefreshing}
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