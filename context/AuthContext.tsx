// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useMultiAccount } from '@/context/MultiAccountContext';
import { AccountUser, MultiAccountStorage, SavedAccount } from '@/utils/multiAccountStorage';
import { authService } from '@/src/api/services/auth.service';
import { storage } from '@/utils/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoginOptions = {
  saveAccount?: boolean; // sauvegarder dans le gestionnaire de comptes
  pin?: string;          // PIN à associer au compte sauvegardé
};

type AuthContextType = {
  user: AccountUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, options?: LoginOptions) => Promise<void>;
  register: (email: string, password: string, name: string, options?: LoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<AccountUser>) => Promise<void>;
  clearError: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

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

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeAccount, addAccount } = useMultiAccount();

  // ✅ CORRECTION : renommé "AccountUser" → "user" pour éviter le conflit avec le type
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Synchroniser avec le compte actif du gestionnaire multi-compte ──────────
  useEffect(() => {
    if (activeAccount) {
      setUser(activeAccount.user);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [activeAccount]);

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = async (
    email: string,
    password: string,
    options: LoginOptions = { saveAccount: true }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ CORRECTION : alias "user: apiUser" pour éviter le conflit avec la variable d'état
      const { user: apiUser, token, refresh_token } = await authService.login({
        email,
        password,
      });

      // Stocker les tokens (source de vérité pour l'interceptor HTTP)
      await storage.setData('auth_token', token);
      await storage.setData('refresh_token', refresh_token);

      if (options.saveAccount !== false) {
        // addAccount met à jour activeAccount → useEffect sync "user" automatiquement
        await addAccount({
          user: apiUser,
          token,
          refreshToken: refresh_token,
          pin: options.pin,
        });
      } else {
        setUser(apiUser);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Échec de la connexion.');
      console.error('Erreur lors du login :', e?.status);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────

  const register = async (
    email: string,
    password: string,
    name: string,
    options: LoginOptions = { saveAccount: true }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { user: apiUser, token, refresh_token } = await authService.register({
        name,
        email,
        password,
        password_confirmation: password,
      });

      await storage.setData('auth_token', token);
      await storage.setData('refresh_token', refresh_token);

      if (options.saveAccount !== false) {
        await addAccount({
          user: apiUser,
          token,
          refreshToken: refresh_token,
          pin: options.pin,
        });
      } else {
        setUser(apiUser);
      }
    } catch (e: any) {
      setError(e?.message ?? "Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  // Logout NE supprime PAS le compte du gestionnaire multi-compte.
  // Il désactive juste la session active → prochain lancement demande le PIN.

  const logout = async () => {
    try {
      setIsLoading(true);

      // Appel API optionnel pour invalider le token côté serveur :
      // try { await authService.logout(); } catch {}

      await storage.removeData('auth_token');
      await storage.removeData('refresh_token');

      // Désactiver le compte actif sans le supprimer du gestionnaire
      const store = await MultiAccountStorage.getStore();
      store.activeAccountId = null;
      store.accounts = store.accounts.map((a: SavedAccount) => ({ ...a, isActive: false }));
      await MultiAccountStorage.saveStore(store);

      setUser(null);
    } catch (e) {
      setError('Échec de la déconnexion.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot password ───────────────────────────────────────────────────────

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // await apiClient.post('/account/forgot-password', { email });
      await new Promise((r) => setTimeout(r, 800));
    } catch (e: any) {
      setError(e?.message ?? "Échec de l'envoi de l'email de récupération.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update profile ────────────────────────────────────────────────────────

  const updateProfile = async (userData: Partial<AccountUser>) => {
    try {
      // ✅ CORRECTION : utilise "user" (variable d'état) et non "AccountUser" (type)
      if (!user) throw new Error('Non connecté');
      setIsLoading(true);
      setError(null);

      // const updated = await apiClient.put<AccountUser>('/account/profile', userData);
      const updatedUser: AccountUser = { ...user, ...userData };

      // Synchroniser avec le compte actif dans le gestionnaire multi-compte
      if (activeAccount) {
        await MultiAccountStorage.upsertAccount({
          user: updatedUser,
          token: activeAccount.token,
          refreshToken: activeAccount.refreshToken,
          existingAccountId: activeAccount.id,
        });
        // Le useEffect sur activeAccount mettra "user" à jour automatiquement
      } else {
        setUser(updatedUser);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Échec de la mise à jour du profil.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;