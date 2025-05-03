import React from 'react';
import { View, StyleSheet, ScrollView, Animated, Easing, ViewStyle } from 'react-native';

// Interfaces pour les props
export interface SkeletonItemProps {
  width: number;
  height: number;
  borderRadius: number;
  style?: ViewStyle;
}

export interface SkeletonLoaderProps {
  isHorizontal?: boolean;
  itemCount?: number;
  showsIndicator?: boolean;
  containerStyle?: ViewStyle;
  renderItem: (index: number) => React.ReactNode;
}

export interface SkeletonComponentProps {
  key?: number | string;
  style?: ViewStyle;
}

// Composant de base pour un élément de squelette animé
export const SkeletonItem: React.FC<SkeletonItemProps> = ({ width, height, borderRadius, style }) => {
  const animatedValue = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#E1E9EE', '#F2F8FC', '#E1E9EE'],
  });
  
  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor },
        style,
      ]}
    />
  );
};

// Composant de base pour créer tout type de squelette
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  isHorizontal = true,
  itemCount = 5,
  showsIndicator = false,
  containerStyle,
  renderItem,
}) => {
  return (
    <ScrollView
      horizontal={isHorizontal}
      showsHorizontalScrollIndicator={showsIndicator}
      showsVerticalScrollIndicator={showsIndicator}
      contentContainerStyle={[
        isHorizontal ? styles.horizontalContainer : styles.verticalContainer,
        containerStyle
      ]}
    >
      {[...Array(itemCount)].map((_, index) => renderItem(index))}
    </ScrollView>
  );
};

// Styles communs exportés pour être réutilisés
export const commonStyles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  verticalContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  marginBottom: {
    marginBottom: 8,
  },
});

// Styles privés utilisés uniquement dans ce fichier
const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  verticalContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});