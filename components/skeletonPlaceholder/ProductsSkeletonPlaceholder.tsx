import React from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { SkeletonItem } from './SkeletonBase';

const screenWidth = Dimensions.get('window').width;

interface ProductsSkeletonProps {
  itemCount?: number;
  isHorizontal?: boolean;
  containerWidth?: number;
  containerHeight?: number;
  imageHeight?: number;
  containerStyle?: any;
}

const ProductSkeletonItem: React.FC<{
  containerWidth: number;
  containerHeight: number;
  imageHeight: number;
}> = ({ containerWidth, containerHeight, imageHeight }) => {
  return (
    <View style={[styles.itemWrapper, { width: containerWidth }]}>
      <View style={[styles.itemContainer, { width: containerWidth, height: containerHeight }]}>
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
          <SkeletonItem
            width={containerWidth * 0.8}
            height={18}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <View style={styles.cartWrapper}>
            <SkeletonItem width={20} height={20} borderRadius={10} />
          </View>
        </View>
      </View>
    </View>
  );
};

const ProductsSkeletonPlaceholder: React.FC<ProductsSkeletonProps> = ({
  itemCount = 6,
  isHorizontal = false,
  containerWidth = screenWidth / 2 - 20,
  containerHeight = 284,
  imageHeight = 185,
  containerStyle,
}) => {
  const data = Array.from({ length: itemCount }, (_, i) => i);

  return (
    <FlatList
      data={data}
      horizontal={isHorizontal}
      numColumns={isHorizontal ? 1 : 2}
      keyExtractor={(item) => item.toString()}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        isHorizontal ? styles.horizontalList : styles.verticalList,
        containerStyle,
        { paddingBottom: 40 },
      ]}
      columnWrapperStyle={!isHorizontal ? { justifyContent: 'space-between' } : undefined}
      renderItem={({ item }) => (
        <ProductSkeletonItem
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          imageHeight={imageHeight}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    marginBottom: 20,
    marginRight: 10,
  },
  itemContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  verticalList: {
    paddingHorizontal: 10,
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
  },
});

export default ProductsSkeletonPlaceholder;
