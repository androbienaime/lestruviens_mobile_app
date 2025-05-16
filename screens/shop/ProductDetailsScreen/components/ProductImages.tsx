import React from 'react';
import { View } from 'react-native';
import ProductSlider from '@/components/ProductSlider';

type ProductImagesProps = {
  images: string[];
  autoplay?: boolean;
  height?: number;
};

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  autoplay = false,
  height = 400
}) => {
  return (
    <View>
      <ProductSlider
        images={images}
        autoplay={autoplay}
        horizontalMargin={0}
        marginVertical={0}
        height={height}
      />
    </View>
  );
};

export default ProductImages;