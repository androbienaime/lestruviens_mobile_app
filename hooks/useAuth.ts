// hooks/useAuth.ts
// Re-export du hook useAuth depuis AuthContext
// Permet d'importer depuis '@/hooks/useAuth' au lieu de '@/context/AuthContext'

export { useAuth } from '@/context/AuthContext';
export type { LoginOptions } from '@/context/AuthContext';