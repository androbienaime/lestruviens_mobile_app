import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { 
  SkeletonItem, 
  SkeletonComponentProps,
  commonStyles
} from './SkeletonBase';

// Largeur totale utile (moins les marges)
const screenWidth = Dimensions.get("window").width;
const usableWidth = screenWidth - 40;

// Props du composant principal
export interface ProductsSkeletonProps {
  itemCount?: number;
  isHorizontal?: boolean;
  containerWidth?: number;
  containerHeight?: number;
  imageHeight?: number;
  containerStyle?: any;
}

// Composant individuel (une carte skeleton)
export const ProductSkeletonItem: React.FC<
  SkeletonComponentProps & { 
    containerWidth?: number;
    containerHeight?: number;
    imageHeight?: number;
    isHorizontal?: boolean;
  }
> = ({ 
  style, 
  containerWidth = usableWidth / 2 - 10, // ajusté pour que 2 passent avec marges
  containerHeight = 284,
  imageHeight = 185,
  isHorizontal = false
}) => {
  return (
    <View
        style={[
          styles.productItem,
          style,
          { 
            width: containerWidth,
            marginRight: isHorizontal ? 10 : 0, // 👈 espace entre éléments horizontaux
          }
        ]}>
      <View style={[styles.container, { height: containerHeight }]}>
        <SkeletonItem 
          width={containerWidth} 
          height={imageHeight} 
          borderRadius={14}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />

        <View style={styles.profileContainer}>
          <SkeletonItem width={40} height={40} borderRadius={14} />
        </View>

        <View style={styles.bookmark}>
          <SkeletonItem width={32} height={32} borderRadius={30} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.productInfo}>
            <SkeletonItem width={containerWidth * 0.3} height={18} borderRadius={4} />
            <View style={styles.ratingWrapper}>
              <SkeletonItem width={20} height={20} borderRadius={10} style={{ marginRight: 5 }} />
              <SkeletonItem width={25} height={14} borderRadius={4} />
            </View>
          </View>

          <SkeletonItem width={containerWidth * 0.8} height={18} borderRadius={4} style={{ marginBottom: 8 }} />

          <View style={styles.cartWrapper}>
            <SkeletonItem width={20} height={20} borderRadius={10} />
          </View>
        </View>
      </View>
    </View>
  );
};

// Composant principal
const ProductsSkeletonPlaceholder: React.FC<ProductsSkeletonProps> = (props) => {
  const { 
    itemCount = 4, 
    isHorizontal = false,
    containerWidth = usableWidth / 2 - 10,
    containerHeight = 284,
    imageHeight = 185,
    containerStyle,
    ...restProps 
  } = props;

  const items = Array.from({ length: itemCount }, (_, index) => index);

  if (isHorizontal) {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalContainer, containerStyle]}
      >
        {items.map((index) => (
          <ProductSkeletonItem 
            key={index}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            imageHeight={imageHeight}
            isHorizontal={isHorizontal}
          />
        ))}
      </ScrollView>
    );
  }

  // Affichage vertical
  return (
    <ScrollView 
      contentContainerStyle={[styles.productsContainer, containerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {items.map((index) => (
        <ProductSkeletonItem 
          key={index}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          imageHeight={imageHeight}
          isHorizontal={isHorizontal}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  horizontalContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  productItem: {
    marginBottom: 20,
  },
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  bookmark: {
    position: 'absolute',
    right: 5,
    top: 68,
    zIndex: 5,
  },
  infoContainer: {
    padding: 5,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  }
});

export default ProductsSkeletonPlaceholder;
