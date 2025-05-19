import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useThemeTypography } from '@/theme';
import { ThemedText } from '@/components/ThemedText';
import { useCart } from '@/context/CartContext';

type AddToCartButtonProps = {
  onAddToCart: () => void;
  onAddToWishlist: () => void;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onAddToCart,
  onAddToWishlist
}) => {
  const colors = useThemeColors();
  const typography = useThemeTypography();
  const { loading } = useCart();


  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background.white,
      padding: 15,
      paddingTop: 5,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    },
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    wishlistButton: {
      padding: 8
    },
    addToCartButton: {
      flex: 1,
      marginLeft: 10,
      backgroundColor: colors.button.primary,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center'
    },
    buttonTextWrapper: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      paddingHorizontal: 10
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Bouton Wishlist */}
        <TouchableOpacity 
          style={styles.wishlistButton}
          onPress={onAddToWishlist}
          disabled={loading}
        >
          <Ionicons 
            name="heart-outline" 
            size={35} 
            color={colors.text.primary} 
          />
        </TouchableOpacity>
        
        {/* Bouton Ajouter au panier */}
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={onAddToCart}
          disabled={loading}
        >
          <View style={styles.buttonTextWrapper}>
            <Ionicons 
              name="cart" 
              size={22} 
              color={colors.background.secondary} 
            />
            <ThemedText style={styles.buttonText}>
              {loading ? 'Chargement...' : 'Ajouter au panier'}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddToCartButton;