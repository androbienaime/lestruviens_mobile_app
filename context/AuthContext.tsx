// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour l'authentification
type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
};

// Clés pour le stockage AsyncStorage
const STORAGE_KEYS = {
  USER: '@ecommerce:user',
  TOKEN: '@ecommerce:token',
};

// Création du contexte avec valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  updateProfile: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // Fonction pour sauvegarder les données d'authentification
  const saveAuthData = async (user: User, token: string) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(user)],
        [STORAGE_KEYS.TOKEN, token],
      ]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
    }
  };

  // Fonction pour charger les données d'authentification
  const loadAuthData = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      const [userString, token] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
      ]);
      
      if (userString[1] && token[1]) {
        setState({
          user: JSON.parse(userString[1]),
          token: token[1],
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'authentification:', error);
      setState({
        user: null,
        token: null,
        isLoading: false,
        error: 'Échec de la connexion automatique',
      });
    }
  };

  // Chargement initial des données d'authentification
  useEffect(() => {
    loadAuthData();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      // Ici, vous feriez normalement un appel API pour l'authentification
      // Exemple:
      // const response = await api.login(email, password);
      
      // Pour démonstration, nous simulons un appel API
      // Attente simulée pour l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification simple des credentials (à remplacer par votre logique API)
      if (email === 'test@example.com' && password === 'password') {
        const mockUser = { 
          id: '123', 
          email: email,
          name: 'Utilisateur Test',
        };
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        
        // Sauvegarde des données d'authentification
        await saveAuthData(mockUser, mockToken);
        
        setState({
          user: mockUser,
          token: mockToken,
          isLoading: false,
          error: null,
        });
      } else {
        setState(prevState => ({ 
          ...prevState, 
          isLoading: false, 
          error: 'Email ou mot de passe incorrect' 
        }));
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false, 
        error: 'Échec de la connexion. Veuillez réessayer.' 
      }));
    }
  };

  // Fonction d'inscription
  const register = async (email: string, password: string, name: string) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      // Ici, vous feriez normalement un appel API pour l'inscription
      // Exemple:
      // const response = await api.register(email, password, name);
      
      // Pour démonstration, nous simulons un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une réponse API d'inscription réussie
      const mockUser = { 
        id: '123', 
        email: email,
        name: name,
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      
      // Sauvegarde des données d'authentification
      await saveAuthData(mockUser, mockToken);
      
      setState({
        user: mockUser,
        token: mockToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false, 
        error: 'Échec de l\'inscription. Veuillez réessayer.'
      }));
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      // Supprimer les données stockées
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
      
      // Réinitialiser l'état
      setState({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false, 
        error: 'Échec de la déconnexion' 
      }));
    }
  };

  // Fonction de récupération de mot de passe
  const forgotPassword = async (email: string) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      // Ici, vous feriez normalement un appel API pour la récupération de mot de passe
      // Exemple:
      // await api.forgotPassword(email);
      
      // Pour démonstration, nous simulons un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      
      // Retourner un succès que l'utilisateur peut afficher
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur de récupération de mot de passe:', error);
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false, 
        error: 'Échec de l\'envoi de l\'email de récupération' 
      }));
      return Promise.reject(error);
    }
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!state.user) {
        throw new Error('Utilisateur non connecté');
      }
      
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      // Ici, vous feriez normalement un appel API pour mettre à jour le profil
      // Exemple:
      // const updatedUser = await api.updateProfile(userData, state.token);
      
      // Pour démonstration, nous simulons un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'utilisateur localement
      const updatedUser = { ...state.user, ...userData };
      
      // Sauvegarde des données utilisateur mises à jour
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      setState(prevState => ({
        ...prevState,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false, 
        error: 'Échec de la mise à jour du profil' 
      }));
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setState(prevState => ({ ...prevState, error: null }));
  };

  // Valeurs à exposer dans le contexte
  const contextValue: AuthContextType = {
    user: state.user,
    isLoggedIn: !!state.user && !!state.token,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;