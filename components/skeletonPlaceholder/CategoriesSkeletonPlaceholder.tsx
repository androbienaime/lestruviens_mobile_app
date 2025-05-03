import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  SkeletonLoader, 
  SkeletonItem, 
  SkeletonComponentProps, 
  SkeletonLoaderProps,
  commonStyles
} from './SkeletonBase';

// Type pour les props du composant CategoriesSkeletonPlaceholder
export interface CategoriesSkeletonProps extends Omit<SkeletonLoaderProps, 'renderItem'> {
  // Propriétés spécifiques aux catégories
  itemSize?: number;
  itemTextWidth?: number;
}

// Type pour les props du composant CategorySkeletonItem, sans 'key'
export interface CategoryItemProps {
  style?: SkeletonComponentProps['style'];
  itemSize?: number;
  itemTextWidth?: number;
}

// Composant pour un élément de catégorie individuel
export const CategorySkeletonItem: React.FC<CategoryItemProps> = 
  ({ style, itemSize = 60, itemTextWidth = 50 }) => (
  <View style={[styles.categoryItem, style]}>
    <SkeletonItem 
      width={itemSize} 
      height={itemSize} 
      borderRadius={itemSize / 2} 
      style={commonStyles.marginBottom} 
    />
    <SkeletonItem 
      width={itemTextWidth} 
      height={10} 
      borderRadius={4} 
    />
  </View>
);

// Composant principal pour le placeholder de catégories
const CategoriesSkeletonPlaceholder: React.FC<CategoriesSkeletonProps> = (props) => {
  const { 
    itemCount = 6, 
    isHorizontal = true, 
    itemSize = 60,
    itemTextWidth = 50,
    ...restProps 
  } = props;
  
  return (
    <SkeletonLoader
      isHorizontal={isHorizontal}
      itemCount={itemCount}
      containerStyle={styles.categoriesContainer}
      renderItem={(index) => (
        <View key={parseInt(""+index)}>
          <CategorySkeletonItem 
            itemSize={itemSize}
            itemTextWidth={itemTextWidth}
          />
        </View>
      )}
      {...restProps}
    />
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
});

export default CategoriesSkeletonPlaceholder;