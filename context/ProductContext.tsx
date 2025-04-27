import React, { createContext, useState, useContext } from 'react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  inStock: boolean;
};

type Category = {
  id: string;
  name: string;
  image: string;
};

type ProductContextType = {
  products: Product[];
  categories: Category[];
  getProduct: (id: string) => Product | undefined;
  getCategory: (id: string) => Category | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];
};

const ProductContext = createContext<ProductContextType>({
  products: [],
  categories: [],
  getProduct: () => undefined,
  getCategory: () => undefined,
  getProductsByCategory: () => [],
  searchProducts: () => [],
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dummy data for demonstration
  const [products] = useState<Product[]>([
    // Ajoutez vos produits de test ici
  ]);
  
  const [categories] = useState<Category[]>([
    // Ajoutez vos catégories de test ici
  ]);

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getCategory = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.categoryId === categoryId);
  };

  const searchProducts = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) || 
      product.description.toLowerCase().includes(lowercasedQuery)
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        getProduct,
        getCategory,
        getProductsByCategory,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};