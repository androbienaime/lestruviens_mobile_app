import React, { useMemo, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  Alert 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import { useThemeColors, useThemeTypography } from "@/theme";
import CartItem from "@/components/modules/cart/CartItem";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import CartSummary from "@/components/modules/cart/CartSummary";

type CartScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const CartScreen = ({ navigation }: CartScreenProps) => {
  const { cartItems, itemCount, totalAmount, loading, clearCart, removeItem } = useCart();
  const colors = useThemeColors();
  const typography = useThemeTypography();
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Rafraîchir le panier quand l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      // Réinitialiser le mode de sélection lors de la navigation
      setSelectionMode(false);
      setSelectedItems([]);
      return () => {};
    }, [])
  );

  // Gérer le rafraîchissement manuel
  const handleRefresh = async () => {
    setRefreshing(true);
    // Le contexte de panier met déjà à jour les données automatiquement
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  // Gérer le checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des produits à votre panier avant de passer commande.");
      return;
    }
    navigation.navigate("Checkout");
  };

  // Gérer la vidange du panier
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    Alert.alert(
      "Vider le panier",
      "Êtes-vous sûr de vouloir vider votre panier ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Vider", 
          style: "destructive",
          onPress: () => {
            clearCart();
            setSelectionMode(false);
            setSelectedItems([]);
          }
        }
      ]
    );
  };

  // Activer/désactiver le mode de sélection
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]);
  };

  // Sélectionner/désélectionner un élément
  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Sélectionner tous les éléments
  const selectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id.toString()));
    }
  };

  // Supprimer les éléments sélectionnés
  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    
    Alert.alert(
      "Supprimer les éléments",
      `Êtes-vous sûr de vouloir supprimer ${selectedItems.length} élément(s) sélectionné(s) ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            // Supprimer chaque élément sélectionné
            for (const itemId of selectedItems) {
              await removeItem(parseInt(""+itemId));
            }
            
            setSelectedItems([]);
            // Désactiver le mode de sélection s'il ne reste plus d'articles
            if (cartItems.length - selectedItems.length <= 0) {
              setSelectionMode(false);
            }
          }
        }
      ]
    );
  };

  // Partager le panier
  const shareCart = () => {
    navigation.navigate("ShareCart", { 
      selectedItems: selectionMode ? selectedItems : cartItems.map(item => item.id.toString()) 
    });
  };

  // Rendu du panier vide
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart" size={80} color={colors.text.secondary} />
      <Text style={[styles.emptyTitle, typography.h3]}>Votre panier est vide</Text>
      <Text style={[styles.emptyText, typography.body1, { color: colors.text.secondary }]}>
        Ajoutez des produits pour commencer vos achats
      </Text>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: colors.button.primary }]}
        onPress={() => navigation.navigate("Shop")}
      >
        <Text style={[styles.shopButtonText, typography.h3, { color: colors.text.inverse }]}>
          Découvrir les produits
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Afficher l'indicateur de chargement si nécessaire
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.button.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.white }]}>
      <ThemedView style={styles.container}>
        <Header 
          previousButton={true}
          hideSearchBar={true}
          hideFilterIcon={true}
          hideWishlistIcon={true}
          title="Panier"
          backgroundColor={colors.background.white} 
          inputBackground={colors.background.primary} 
          style={styles.header}
          rightComponent={
            cartItems.length > 0 ? (
              <View style={styles.headerActions}>
                {selectionMode ? (
                  <>
                    <TouchableOpacity 
                      style={styles.headerButton} 
                      onPress={selectAllItems}
                    >
                      <Text style={{ color: colors.text.tertiary }}>
                        {selectedItems.length === cartItems.length ? "Désélectionner tout" : "Tout sélectionner"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.headerButton} 
                      onPress={removeSelectedItems}
                      disabled={selectedItems.length === 0}
                    >
                      <Text style={{ color: selectedItems.length > 0 ? colors.text.danger : colors.text.disabled }}>
                        Supprimer ({selectedItems.length})
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.headerButton} 
                      onPress={shareCart}
                    >
                      <Ionicons name="share-outline" size={24} color={colors.text.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.headerButton} 
                      onPress={toggleSelectionMode}
                    >
                      <Ionicons name="checkbox-outline" size={24} color={colors.text.tertiary} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : null
          }
        />

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CartItem 
              item={item} 
              selectionMode={selectionMode}
              isSelected={selectedItems.includes(item.id.toString())}
              onToggleSelection={() => toggleItemSelection(item.id.toString())}
            />
          )}
          ListEmptyComponent={renderEmptyCart}
          contentContainerStyle={cartItems.length === 0 ? { flex: 1 } : styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {cartItems.length > 0 && (
          <View>
            {selectionMode && (
              <View style={styles.selectionActionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.selectionActionButton, 
                    { backgroundColor: colors.button.secondary }
                  ]} 
                  onPress={toggleSelectionMode}
                >
                  <Text style={{ color: colors.text.tertiary }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.selectionActionButton, 
                    { 
                      backgroundColor: selectedItems.length > 0 ? colors.button.error : colors.button.disabled 
                    }
                  ]} 
                  onPress={removeSelectedItems}
                  disabled={selectedItems.length === 0}
                >
                  <Text style={{ color: colors.text.primary }}>
                    Supprimer ({selectedItems.length})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <CartSummary 
              totalAmount={totalAmount}
              itemCount={itemCount}
              handleCheckout={handleCheckout}
            />
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => 
StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.background.primary
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 32,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
  },
  selectionActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  selectionActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  checkoutButton: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default CartScreen;