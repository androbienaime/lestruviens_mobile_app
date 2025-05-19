import { useCart as useCartContext } from "@/context/CartContext";
import { useCallback } from "react";
import { Declination, Product } from "@/src/@types/models";

/**
 * Hook personnalisé pour faciliter l'utilisation du contexte de panier
 * Fournit des fonctions supplémentaires et simplifie certaines opérations
 */
export function useCart() {
  const cartContext = useCartContext();
  
  /**
   * Ajoute un produit au panier avec gestion d'erreur simplifiée
   */
  const addProductToCart = useCallback(
    async (
      product: Product,
      quantity: number = 1,
      declination?: Declination
    ): Promise<{ success: boolean; message: string }> => {
      try {
        // Vérification de base
        if (quantity <= 0) {
          return {
            success: false,
            message: "La quantité doit être supérieure à 0",
          };
        }

        // Si une déclinaison est fournie, vérifier son stock plutôt que celui du produit principal
        const stockQuantity = declination?.quantity ?? product.stock_quantity;
        
        // Vérification du stock
        if (
          !product.has_unlimited_stock &&
          stockQuantity < quantity
        ) {
          return {
            success: false,
            message: `Stock insuffisant. Maximum disponible: ${stockQuantity}`,
          };
        }

        // Ajouter au panier via le contexte
        await cartContext.addToCart(product, quantity, declination);

        return {
          success: true,
          message: "Produit ajouté au panier avec succès",
        };
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        return {
          success: false,
          message: "Une erreur est survenue lors de l'ajout au panier",
        };
      }
    },
    [cartContext]
  );
  /**
   * Calcule le prix total d'un produit en tenant compte de sa remise éventuelle
   */
  const calculateProductPrice = useCallback((product: Product): number => {
    return (product.discount_price ?? 0) > 0
      ? product.discount_price!
      : product.price;
  }, []);

  /**
   * Vérifie si un produit peut être ajouté au panier (stock disponible)
   */
  const canAddToCart = useCallback(
    (product: Product, quantity: number = 1): boolean => {
      if (product.has_unlimited_stock) return true;
      return product.stock_quantity >= quantity;
    },
    []
  );

  return {
    ...cartContext,
    addProductToCart,
    calculateProductPrice,
    canAddToCart,
  };
}

export default useCart;