import React from 'react';
import { StyleSheet } from 'react-native';
import { useThemeColors, useThemeTypography } from '@/theme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type ShippingInfoProps = {
  address: string;
  estimatedDeliveryStart: string;
  estimatedDeliveryEnd: string;
};

const ShippingInfo: React.FC<ShippingInfoProps> = ({
  address,
  estimatedDeliveryStart,
  estimatedDeliveryEnd
}) => {
  const colors = useThemeColors();
  const typography = useThemeTypography();

  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      backgroundColor: colors.background.white
    },
    title: {
      ...typography.h4,
      color: colors.text.primary
    },
    subtitle: {
      ...typography.h5,
      color: colors.text.primary
    },
    dateRange: {
      ...typography.body1,
      color: colors.text.primary
    }
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Expedition à {address}</ThemedText>
      <ThemedText style={styles.subtitle}>Livraison estime le :</ThemedText>
      <ThemedText style={styles.dateRange}>
        {estimatedDeliveryStart} - {estimatedDeliveryEnd}
      </ThemedText>
    </ThemedView>
  );
};

export default ShippingInfo;