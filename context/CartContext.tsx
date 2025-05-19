import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartStorage } from '@/utils/storage';
import { CartItem, Declination, Product } from '@/src/@types/models';

// Définition du type pour le contexte du panier
type CartContextType = {
  cartItems: CartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (product: Product, quantity: number, declination?: Declination) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isProductInCart: (productSlug: string, declination?: Declination) => boolean;
};

// Création du contexte avec une valeur par défaut undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props pour le Provider
type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Charger les données du panier au démarrage
  useEffect(() => {
    loadCartData();
  }, []);

  // Fonction pour charger les données du panier
  const loadCartData = async () => {
    setLoading(true);
    try {
      const items = await CartStorage.getItems();
      const count = await CartStorage.getItemCount();
      const amount = await CartStorage.getTotalAmount();
      
      setCartItems(items);
      setItemCount(count);
      setTotalAmount(amount);
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un produit au panier
  const addToCart = async (
    product: Product, 
    quantity: number, 
    declination?: Declination
  ) => {
    setLoading(true);
    try {
      const updatedCart = await CartStorage.addItem(product, quantity, declination);
      setCartItems(updatedCart);
      
      // Mettre à jour le compteur et le total
      const newCount = await CartStorage.getItemCount();
      const newAmount = await CartStorage.getTotalAmount();
      
      setItemCount(newCount);
      setTotalAmount(newAmount);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    try {
      const updatedCart = await CartStorage.updateQuantity(cartItemId, quantity);
      setCartItems(updatedCart);
      
      // Mettre à jour le compteur et le total
      const newCount = await CartStorage.getItemCount();
      const newAmount = await CartStorage.getTotalAmount();
      
      setItemCount(newCount);
      setTotalAmount(newAmount);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un article du panier
  const removeItem = async (cartItemId: number) => {
    setLoading(true);
    try {
      const updatedCart = await CartStorage.removeItem(cartItemId);
      setCartItems(updatedCart);
      
      // Mettre à jour le compteur et le total
      const newCount = await CartStorage.getItemCount();
      const newAmount = await CartStorage.getTotalAmount();
      
      setItemCount(newCount);
      setTotalAmount(newAmount);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    } finally {
      setLoading(false);
    }
  };

  // Vider le panier
  const clearCart = async () => {
    setLoading(true);
    try {
      await CartStorage.clearCart();
      setCartItems([]);
      setItemCount(0);
      setTotalAmount(0);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si un produit est déjà dans le panier
  const isProductInCart = (productSlug: string, declination?: Declination): boolean => {
    return cartItems.some(item => {
      if (item.product_slug !== productSlug) return false;
      
      // Si pas de déclinaison, on compare juste les IDs
      if (!declination && !item.Declination) return true;
      if (!declination || !item.Declination) return false;
      
      // Compare les déclinaisons (vérifier les propriétés essentielles comme SKU)
      return item.Declination.sku === declination.sku;
    });
  };

  const value = {
    cartItems,
    itemCount,
    totalAmount,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isProductInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte du panier
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};