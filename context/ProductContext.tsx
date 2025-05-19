import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode } from 'react';
import { productsService } from '@/src/api/services/products.service';
import { Product } from '@/src/@types/models';

// Définition du type pour le contexte
type ProductContextType = {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  refreshing: boolean;
  currentPage: number;
  loadProducts: (page: number, refresh?: boolean) => Promise<void>;
  handleRefresh: () => void;
  handleLoadMore: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryId: (id: string | undefined) => void;
  searchQuery: string | undefined;
  categoryId: string | undefined;
};

// Création du contexte avec une valeur par défaut
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Props pour le Provider
type ProductProviderProps = {
  children: ReactNode;
  initialLimit?: number;
};

export const ProductProvider = ({ children, initialLimit = 2 }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const loadProducts = useCallback(
    async (page: number, refresh: boolean = false) => {
      if (refresh) {
        setLoading(true);
      }

      try {
        let response: any;

        // Paramètres de pagination
        const paginationParams = {
          'page': page,
          'per_page': initialLimit,
        };

        // Appel API en fonction des filtres
        if (categoryId) {
          response = await productsService.getProductsByCategory(categoryId, paginationParams);
        } else if (searchQuery) {
          response = await productsService.searchProducts(searchQuery, paginationParams);
        } else {
          response = await productsService.getProducts(paginationParams);
        }

        // Extraction des données
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

        if (refresh) {
          setProducts(productData);
          setCurrentPage(1);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...productData]);
          setCurrentPage(currentPageFromApi);
        }
        
        setHasMore(currentPageFromApi < totalPages);
      } catch (error) {
        if (refresh) {
          setProducts([]);
        }
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
        if (refresh) {
          setRefreshing(false);
        }
      }
    },
    [categoryId, searchQuery, initialLimit]
  );

  // Rechargement initial et lors des changements de dépendances
  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    loadProducts(1, true);
  }, [categoryId, searchQuery, initialLimit, loadProducts]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setHasMore(true);
    loadProducts(1, true);
  }, [loadProducts]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadProducts(currentPage + 1, false);
    }
  }, [hasMore, loading, currentPage, loadProducts]);

  // Valeur du contexte
  const value = {
    products,
    loading,
    hasMore,
    refreshing,
    currentPage,
    loadProducts,
    handleRefresh,
    handleLoadMore,
    setSearchQuery,
    setCategoryId,
    searchQuery,
    categoryId,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};