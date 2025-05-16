import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors, useThemeTypography } from '@/theme';
import QuantityControl from '@/components/forms/QuantityControl';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type QuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  hasUnlimitedStock: boolean;
  onQuantityChange: (value: number) => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  hasUnlimitedStock,
  onQuantityChange
}) => {
  const colors = useThemeColors();
  const typography = useThemeTypography();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.white,
      marginTop: 10
    },
    caption: {
      color: colors.text.primary,
      ...typography.h3
    },
    quantityWrapper: {
      paddingLeft: 5
    }
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.caption}>Quantity</ThemedText>
      <View style={styles.quantityWrapper}>
        <QuantityControl
          min={1}
          {...(hasUnlimitedStock ? {} : { max: maxQuantity })}
          initialValue={quantity}
          onValueChange={onQuantityChange}
        />
      </View>
    </ThemedView>
  );
};

export default QuantitySelector;