import { useThemeColors } from '@/theme';
import React, { useState } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');
const horizontalMargin = 18;
const carouselWidth = screenWidth - horizontalMargin * 2;

const images = [
  require('@/assets/images/2.jpg'),
  require('@/assets/images/3.jpg'),
  require('@/assets/images/4.png'),
  require('@/assets/images/5.jpg'),
];

const HomeSlider = ({...otherProps}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const colors = useThemeColors();
  
  return (
    <View style={{ marginVertical: 20 }} {...otherProps}>
      <Carousel
        loop
        width={carouselWidth}
        height={180}
        autoPlay
        data={images}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: activeIndex === index ? colors.button.secondary: "#fff",
                opacity: activeIndex === index ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default HomeSlider;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#000',
  },
  dotInactive: {
    backgroundColor: '#fff',
    opacity: 0.5,
  },
});
