// Fichier d'exportation principal

// Exportation des composants de base
export { 
    SkeletonItem, 
    SkeletonLoader, 
    commonStyles 
  } from './SkeletonBase';
  
  // Exportation des composants spécifiques
  export { default as CategoriesSkeletonPlaceholder } from './CategoriesSkeletonPlaceholder';
  export { CategorySkeletonItem } from './CategoriesSkeletonPlaceholder';
  export type { CategoriesSkeletonProps } from './CategoriesSkeletonPlaceholder';
  
//   export { default as ProductsSkeletonPlaceholder } from './ProductsSkeletonPlaceholder';
//   export { ProductSkeletonItem } from './ProductsSkeletonPlaceholder';
//   export type { ProductsSkeletonProps } from './ProductsSkeletonPlaceholder';
  
  // Exportation des types communs
  export type { 
    SkeletonItemProps, 
    SkeletonLoaderProps, 
    SkeletonComponentProps 
  } from './SkeletonBase';
  
  // Objet Skeleton pour une utilisation simplifiée
  import CategoriesSkeletonPlaceholder from './CategoriesSkeletonPlaceholder';
//   import ProductsSkeletonPlaceholder from './ProductsSkeletonPlaceholder';
  import { SkeletonItem, SkeletonLoader } from './SkeletonBase';
  
  const Skeleton = {
    Categories: CategoriesSkeletonPlaceholder,
    // Products: ProductsSkeletonPlaceholder,
    Loader: SkeletonLoader,
    Item: SkeletonItem,
  };
  
  export default Skeleton;