import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * storage.ts
 * 
 * Utilitaires de stockage local pour l'application e-commerce
 * Compatible avec les modèles définis dans @types/models.ts et client.ts
 */

import { 
    User, 
    Product, 
    CartItem, 
    Order, 
    Address, 
    Category, 
    Declination
  } from '../src/@types/models';
  
  // Clés de stockage pour AsyncStorage/AsyncStorage
  const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    CART: 'cart',
    FAVORITES: 'favorites',
    RECENT_PRODUCTS: 'recent_products',
    ADDRESSES: 'addresses',
    RECENTLY_VIEWED: 'recently_viewed',
    SEARCH_HISTORY: 'search_history'
  };
  
  /**
   * Service de stockage (AsyncStorage/AsyncStorage)
   * Adapté pour être compatible avec client.ts
   */
  export class StorageService {
    /**
     * Détermine si le stockage local est disponible
     */
    static isAvailable(): boolean {
      try {
        const testKey = '__storage_test__';
        AsyncStorage.setItem(testKey, testKey);
        AsyncStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }
  
    /**
     * Stocke une donnée dans le stockage local
     * Compatible avec client.ts
     */
    static async setData(key: string, value: any): Promise<void> {
      try {
        const jsonValue = JSON.stringify(value);
        AsyncStorage.setItem(key, jsonValue);
      } catch (error) {
        console.error(`Erreur lors de la sauvegarde (${key}):`, error);
      }
    }
  
    /**
     * Récupère une donnée du stockage local
     * Compatible avec client.ts
     */
    static async getData(key: string): Promise<any> {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value === null) {
          return null;
        }
        return JSON.parse(value);
      } catch (error) {
        console.error(`Erreur lors de la récupération (${key}):`, error);
        return null;
      }
    }
  
    /**
     * Supprime une donnée du stockage local
     * Compatible avec client.ts
     */
    static async removeData(key: string): Promise<void> {
      try {
        AsyncStorage.removeItem(key);
      } catch (error) {
        console.error(`Erreur lors de la suppression (${key}):`, error);
      }
    }
  
    /**
     * Méthodes alternatives pour maintenir la compatibilité avec le code précédent
     */
    static setItem<T>(key: string, value: T): void {
      this.setData(key, value);
    }
  
    static getItem<T>(key: string, defaultValue: T): Promise<T> {
      return this.getData(key).then((data: any) => {
        return data === null ? defaultValue : data;
      });
    }
  
    static removeItem(key: string): void {
      this.removeData(key);
    }
  
    /**
     * Vide tout le stockage local
     */
    static async clear(): Promise<void> {
      try {
        AsyncStorage.clear();
      } catch (error) {
        console.error('Erreur lors de la suppression du stockage:', error);
      }
    }
  }
  
  /**
   * Gestion de l'authentification et des données utilisateur
   */
  export class AuthStorage {
    /**
     * Stocke le token d'authentification
     */
    static async setToken(token: string): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  
    /**
     * Récupère le token d'authentification
     */
    static async getToken(): Promise<string | null> {
      return StorageService.getData(STORAGE_KEYS.AUTH_TOKEN);
    }
  
    /**
     * Stocke le token de rafraîchissement
     */
    static async setRefreshToken(token: string): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  
    /**
     * Récupère le token de rafraîchissement
     */
    static async getRefreshToken(): Promise<string | null> {
      return StorageService.getData(STORAGE_KEYS.REFRESH_TOKEN);
    }
  
    /**
     * Vérifie si un token existe
     */
    static async hasToken(): Promise<boolean> {
      const token = await this.getToken();
      return token !== null;
    }
  
    /**
     * Stocke les informations utilisateur
     */
    static async setUser(user: User): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.USER, user);
    }
  
    /**
     * Récupère les informations utilisateur
     */
    static async getUser(): Promise<User | null> {
      return StorageService.getData(STORAGE_KEYS.USER);
    }
  
    /**
     * Stocke à la fois le token et l'utilisateur (après connexion)
     */
    static async setAuth(authData: { token: string; refreshToken?: string; user: User }): Promise<void> {
      await this.setToken(authData.token);
      if (authData.refreshToken) {
        await this.setRefreshToken(authData.refreshToken);
      }
      await this.setUser(authData.user);
    }
  
    /**
     * Supprime les données d'authentification (déconnexion)
     */
    static async clearAuth(): Promise<void> {
      await StorageService.removeData(STORAGE_KEYS.AUTH_TOKEN);
      await StorageService.removeData(STORAGE_KEYS.REFRESH_TOKEN);
      await StorageService.removeData(STORAGE_KEYS.USER);
    }
  }
  
  /**
   * Gestion du panier d'achat
   */
  export class CartStorage {
    /**
     * Récupère les articles du panier
     */
    static async getItems(): Promise<CartItem[]> {
      const cart = await StorageService.getData(STORAGE_KEYS.CART);
      return cart || [];
    }
  
    /**
     * Enregistre les articles du panier
     */
    static async setItems(items: CartItem[]): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.CART, items);
    }
  
    /**
     * Ajoute un article au panier
     */
    static async addItem(product: Product, quantity: number = 1, declination?: Declination): Promise<CartItem[]> {
      const currentCart = await this.getItems();
      
      // Recherche si le produit existe déjà avec la même déclinaison
      const existingItemIndex = currentCart.findIndex(item => {
        if (item.product_slug !== product.slug) return false;
        
        // Si pas de déclinaison, on compare juste les IDs
        if (!declination && !item.Declination) return true;
        if (!declination || !item.Declination) return false;
        
        // Compare les déclinaisons (vérifier les propriétés essentielles comme SKU)
        return item.Declination.id === declination.id;
      });
  
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si l'article existe déjà
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Ajouter un nouvel article au panier
        const newCartItem: CartItem = {
          id: Date.now(), // ID temporaire jusqu'à synchronisation avec le backend
          product_slug: product.slug,
          product,
          quantity,
          Declination: declination
        };
        currentCart.push(newCartItem);
      }
  
      await this.setItems(currentCart);
      return currentCart;
    }
  
    /**
     * Met à jour la quantité d'un article du panier
     */
    static async updateQuantity(cartItemId: number, quantity: number): Promise<CartItem[]> {
      const currentCart = await this.getItems();
      const itemIndex = currentCart.findIndex(item => item.id === cartItemId);
  
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Supprimer l'article si la quantité est 0 ou négative
          currentCart.splice(itemIndex, 1);
        } else {
          // Mettre à jour la quantité
          currentCart[itemIndex].quantity = quantity;
        }
        await this.setItems(currentCart);
      }
  
      return currentCart;
    }
  
    /**
     * Supprime un article du panier
     */
    static async removeItem(cartItemId: number): Promise<CartItem[]> {
      const currentCart = (await this.getItems()).filter(item => item.id !== cartItemId);
      await this.setItems(currentCart);
      return currentCart;
    }
  
    /**
     * Vide le panier
     */
    static async clearCart(): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.CART, []);
    }
  
  
     /**
     * Calcule le total des articles du panier
     */
    static async getTotalAmount(): Promise<number> {
      const items = await this.getItems();
      return items.reduce((total, item) => {
        // Utiliser le prix de la déclinaison si disponible, sinon le prix du produit
        const price = item.Declination && item.Declination.price > 0
          ? item.Declination.price
          : (item.product.discount_price ?? item.product.price);
        return total + (price * item.quantity);
      }, 0);
    }
  
    /**
     * Obtient le nombre total d'articles dans le panier
     */
    static async getItemCount(): Promise<number> {
      const items = await this.getItems();
      return items.reduce((count, item) => count + item.quantity, 0);
    }
  }
  
  /**
   * Gestion des produits favoris
   */
  export class FavoritesStorage {
    /**
     * Récupère les IDs des produits favoris
     */
    static async getFavoriteIds(): Promise<number[]> {
      const favorites = await StorageService.getData(STORAGE_KEYS.FAVORITES);
      return favorites || [];
    }
  
    /**
     * Vérifie si un produit est dans les favoris
     */
    static async isFavorite(productId: number): Promise<boolean> {
      const favorites = await this.getFavoriteIds();
      return favorites.includes(productId);
    }
  
    /**
     * Ajoute un produit aux favoris
     */
    static async addFavorite(productId: number): Promise<number[]> {
      const favorites = await this.getFavoriteIds();
      if (!favorites.includes(productId)) {
        favorites.push(productId);
        await StorageService.setData(STORAGE_KEYS.FAVORITES, favorites);
      }
      return favorites;
    }
  
    /**
     * Supprime un produit des favoris
     */
    static async removeFavorite(productId: number): Promise<number[]> {
      const favorites = (await this.getFavoriteIds()).filter(id => id !== productId);
      await StorageService.setData(STORAGE_KEYS.FAVORITES, favorites);
      return favorites;
    }
  
    /**
     * Bascule l'état favori d'un produit
     */
    static async toggleFavorite(productId: number): Promise<boolean> {
      if (await this.isFavorite(productId)) {
        await this.removeFavorite(productId);
        return false;
      } else {
        await this.addFavorite(productId);
        return true;
      }
    }
  }
  
  /**
   * Gestion des adresses
   */
  export class AddressStorage {
    /**
     * Récupère les adresses enregistrées
     */
    static async getAddresses(): Promise<Address[]> {
      const addresses = await StorageService.getData(STORAGE_KEYS.ADDRESSES);
      return addresses || [];
    }
  
    /**
     * Ajoute une nouvelle adresse
     */
    static async addAddress(address: Address): Promise<Address[]> {
      const addresses = await this.getAddresses();
      
      // Générer un ID temporaire si nécessaire
      const newAddress: Address = {
        ...address,
        id: address.id || Date.now()
      };
  
      // Si c'est l'adresse par défaut, enlever le statut par défaut des autres
      if (newAddress.is_default) {
        addresses.forEach(addr => {
          addr.is_default = false;
        });
      }
      
      addresses.push(newAddress);
      await StorageService.setData(STORAGE_KEYS.ADDRESSES, addresses);
      return addresses;
    }
  
    /**
     * Met à jour une adresse existante
     */
    static async updateAddress(addressId: number, updatedAddress: Address): Promise<Address[]> {
      const addresses = await this.getAddresses();
      const index = addresses.findIndex(addr => addr.id === addressId);
      
      if (index >= 0) {
        // Si la mise à jour rend cette adresse par défaut, mettre à jour les autres
        if (updatedAddress.is_default) {
          addresses.forEach(addr => {
            addr.is_default = false;
          });
        }
        
        addresses[index] = {
          ...updatedAddress,
          id: addressId
        };
        
        await StorageService.setData(STORAGE_KEYS.ADDRESSES, addresses);
      }
      
      return addresses;
    }
  
    /**
     * Supprime une adresse
     */
    static async removeAddress(addressId: number): Promise<Address[]> {
      const addresses = (await this.getAddresses()).filter(addr => addr.id !== addressId);
      await StorageService.setData(STORAGE_KEYS.ADDRESSES, addresses);
      return addresses;
    }
  
    /**
     * Récupère l'adresse par défaut
     */
    static async getDefaultAddress(): Promise<Address | undefined> {
      const addresses = await this.getAddresses();
      return addresses.find(addr => addr.is_default === true);
    }
  }
  
  /**
   * Gestion des produits récemment consultés
   */
  export class RecentViewsStorage {
    private static readonly MAX_RECENT_PRODUCTS = 20;
  
    /**
     * Récupère les produits récemment consultés
     */
    static async getRecentlyViewed(): Promise<Product[]> {
      const products = await StorageService.getData(STORAGE_KEYS.RECENTLY_VIEWED);
      return products || [];
    }
  
    /**
     * Ajoute un produit à la liste des produits récemment consultés
     */
    static async addRecentlyViewed(product: Product): Promise<Product[]> {
      const recentProducts = await this.getRecentlyViewed();
      
      // Supprimer le produit s'il existe déjà
      const filteredProducts = recentProducts.filter(p => p.id !== product.id);
      
      // Ajouter le produit en tête de liste
      filteredProducts.unshift(product);
      
      // Limiter la liste au nombre maximum de produits
      const limitedProducts = filteredProducts.slice(0, this.MAX_RECENT_PRODUCTS);
      
      await StorageService.setData(STORAGE_KEYS.RECENTLY_VIEWED, limitedProducts);
      return limitedProducts;
    }
  
    /**
     * Supprime un produit des produits récemment consultés
     */
    static async removeRecentlyViewed(productId: number): Promise<Product[]> {
      const recentProducts = (await this.getRecentlyViewed())
        .filter(product => product.id !== productId);
      
      await StorageService.setData(STORAGE_KEYS.RECENTLY_VIEWED, recentProducts);
      return recentProducts;
    }
  
    /**
     * Vide la liste des produits récemment consultés
     */
    static async clearRecentlyViewed(): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.RECENTLY_VIEWED, []);
    }
  }
  
  /**
   * Gestion de l'historique de recherche
   */
  export class SearchHistoryStorage {
    private static readonly MAX_SEARCH_HISTORY = 20;
  
    /**
     * Récupère l'historique de recherche
     */
    static async getSearchHistory(): Promise<string[]> {
      const history = await StorageService.getData(STORAGE_KEYS.SEARCH_HISTORY);
      return history || [];
    }
  
    /**
     * Ajoute un terme à l'historique de recherche
     */
    static async addSearchTerm(term: string): Promise<string[]> {
      if (!term.trim()) return this.getSearchHistory();
      
      const searchHistory = await this.getSearchHistory();
      
      // Supprimer le terme s'il existe déjà
      const filteredHistory = searchHistory.filter(
        t => t.toLowerCase() !== term.toLowerCase()
      );
      
      // Ajouter le terme en tête de liste
      filteredHistory.unshift(term);
      
      // Limiter la liste au nombre maximum de termes
      const limitedHistory = filteredHistory.slice(0, this.MAX_SEARCH_HISTORY);
      
      await StorageService.setData(STORAGE_KEYS.SEARCH_HISTORY, limitedHistory);
      return limitedHistory;
    }
  
    /**
     * Supprime un terme de l'historique de recherche
     */
    static async removeSearchTerm(term: string): Promise<string[]> {
      const searchHistory = (await this.getSearchHistory())
        .filter(t => t.toLowerCase() !== term.toLowerCase());
      
      await StorageService.setData(STORAGE_KEYS.SEARCH_HISTORY, searchHistory);
      return searchHistory;
    }
  
    /**
     * Vide l'historique de recherche
     */
    static async clearSearchHistory(): Promise<void> {
      await StorageService.setData(STORAGE_KEYS.SEARCH_HISTORY, []);
    }
  }
  
  // Export par défaut pour une utilisation facile
  export default {
    StorageService,
    AuthStorage,
    CartStorage,
    FavoritesStorage,
    AddressStorage,
    RecentViewsStorage,
    SearchHistoryStorage
  };
  
  // Pour assurer la compatibilité avec client.ts, création d'un alias
  export const storage = StorageService;