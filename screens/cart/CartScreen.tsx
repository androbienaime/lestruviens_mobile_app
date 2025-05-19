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
// import { ShoppingBag } from "lucide-react-native";

type CartScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const CartScreen = ({ navigation }: CartScreenProps) => {
  const { cartItems, itemCount, totalAmount, loading, clearCart } = useCart();
  const colors = useThemeColors();
  const typography = useThemeTypography();
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Rafraîchir le panier quand l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      // Si nécessaire, vous pourriez ajouter une logique de rafraîchissement ici
      return () => {};
    }, [])
  );

  // Gérer le rafraîchissement manuel
  const handleRefresh = async () => {
    setRefreshing(true);
    // Le contexte de panier met déjà à jour les données automatiquement
    // donc nous simulons juste le rafraîchissement ici
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
          onPress: () => clearCart()
        }
      ]
    );
  };

  // Rendu du panier vide
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      {/* <ShoppingBag size={80} color={colors.text.secondary} /> */}
      <Ionicons name="cart" size={80} color={colors.text.secondary} />
      <Text style={[styles.emptyTitle, typography.h3]}>Votre panier est vide</Text>
      <Text style={[styles.emptyText, typography.body1, { color: colors.text.secondary }]}>
        Ajoutez des produits pour commencer vos achats
      </Text>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: colors.button.primary }]}
        onPress={() => navigation.navigate("Shop")}
      >
        <Text style={[styles.shopButtonText, typography.h3, { color: colors.text.primary }]}>
          Découvrir les produits
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Afficher l'indicateur de chargement si nécessaire
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* <Header title="Mon Panier" previousButton={true} /> */}
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

            backgroundColor={colors.background.white} 
            inputBackground={colors.background.primary} 
            style={styles.header}
          />
          {/* {
            cartItems.length > 0 && (
              <TouchableOpacity onPress={handleClearCart}>
                <Text style={{ color: colors.text.tertiary }}>Vider</Text>
              </TouchableOpacity>
            )
          } */}
      

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CartItem item={item} />}
          ListEmptyComponent={renderEmptyCart}
          contentContainerStyle={cartItems.length === 0 ? { flex: 1 } : styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {cartItems.length > 0 && (
          <CartSummary 
            totalAmount = {totalAmount}
            itemCount = {itemCount}
            handleCheckout={handleCheckout}
          />
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
  header:{
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.background.primary
    
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
    // marginBottom: 12,
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