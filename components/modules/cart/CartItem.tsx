import React, { useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { CartItem as CartItemType } from "@/src/@types/models";
import { useCart } from "@/context/CartContext";
// import { Trash2, Plus, Minus } from "lucide-react-native";
import { useThemeColors, useThemeTypography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  item: CartItemType;
};

const CartItem = ({ item }: Props) => {
  const { updateQuantity, removeItem } = useCart();
  const colors = useThemeColors();
  const typography = useThemeTypography();
  const [isUpdating, setIsUpdating] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);
  // Gérer le changement de quantité
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (item.product.has_unlimited_stock === false && newQuantity > item.product.stock_quantity) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Gérer la suppression d'un article
  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    } finally {
      setIsUpdating(false);
    }
  };

   // Formater les attributs sélectionnés pour l'affichage
   const renderSelectedAttributes = () => {
    // Si une déclinaison est présente, on affiche ses valeurs
    if (item.Declination?.values && item.Declination.values.length > 0) {
      return (
        <View style={styles.attributesContainer}>
          {item.Declination.values.map((val) => (
            <Text key={val.id} style={[styles.attributeText, { color: colors.text.secondary }]}>
              {val.attribute.name}: {val.value} {val.color && `(${val.color})`}
            </Text>
          ))}
        </View>
      );
    }
    
    // Pour la compatibilité avec l'ancien format
    if (item.selected_attributes) {
      return (
        <View style={styles.attributesContainer}>
          {Object.entries(item.selected_attributes).map(([key, value]) => (
            <Text key={key} style={[styles.attributeText, { color: colors.text.secondary }]}>
              {key}: {value}
            </Text>
          ))}
        </View>
      );
    }
    
    return null;
  };

   // Calculer le prix total pour cet article
   const itemPrice = item.Declination  && item.Declination.price > 0
   ? item.Declination.price 
   : (item.product.discount_price || item.product.price);
    const totalPrice = itemPrice * item.quantity;
    const currencySymbol = item.product.currency?.symbol || "$";

    // Déterminer quelle image afficher (déclinaison ou produit)
    const imageToDisplay = useMemo(() => {
      // Vérifier si la déclinaison existe et a des images spécifiques
      if (item.Declination?.declination_images && item.Declination.declination_images.length > 0) {
        return (item.Declination.declination_images as string[])[0];
      }
      // Sinon, utiliser l'image du produit
      return item.product.images[0];
    }, [item.Declination, item.product.images]);

  return (
    <View style={styles.container}>
      {/* Image du produit */}
      <Image
        source={{ uri: imageToDisplay }}
        style={styles.image}
        defaultSource={require("@/assets/images/placeholder-image.png")}
      />

      <View style={styles.contentContainer}>
        {/* Détails du produit */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.productName, typography.body1]}>{item.product.name}</Text>
          {renderSelectedAttributes()}
          <Text style={[styles.priceText, typography.h3]}>
            {currencySymbol} {itemPrice}
          </Text>
        </View>

        {/* Contrôles de quantité et suppression */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleRemove}
            style={[styles.deleteButton, { backgroundColor: colors.background.secondary }]}
            disabled={isUpdating}
          >
            <Ionicons name="trash" size={18} color={colors.button.error} />
          </TouchableOpacity>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.quantity - 1)}
              style={[styles.quantityButton, { backgroundColor: colors.background.primary }]}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Ionicons name="remove" size={16} color={colors.text.primary} />
            </TouchableOpacity>

            <Text style={[styles.quantityText, typography.body1]}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => handleQuantityChange(item.quantity + 1)}
              style={[styles.quantityButton, { backgroundColor: colors.background.secondary }]}
              disabled={isUpdating || (!item.product.has_unlimited_stock && item.quantity >= item.product.stock_quantity)}
            >
                <Ionicons name="add" size={16} color={colors.text.primary} />
                </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.primary,
    // borderTopWidth: 1,
    // borderTopColor: colors.background.primary,
    backgroundColor: colors.background.white,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  attributesContainer: {
    marginVertical: 4,
  },
  attributeText: {
    fontSize: 12,
    marginBottom: 2,
  },
  priceText: {
    fontSize: 16,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
});

export default CartItem;