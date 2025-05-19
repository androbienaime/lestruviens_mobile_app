import React, { createContext, useContext, useState, ReactNode } from 'react';

// Définition de l'interface pour le contexte
interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

// Création du contexte avec valeurs par défaut
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

// Props pour le provider
interface LoadingProviderProps {
  children: ReactNode;
}

// Provider qui gère l'état du chargement
export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fonctions pour manipuler l'état
  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);
  
  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;