import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors, useThemeTypography } from '@/theme';
import RenderHTMLToText from '@/components/RenderHTMLToText';
import AccordionButton from '@/components/AccordionButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type ProductDescriptionProps = {
  description: string | null;
};

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  const colors = useThemeColors();
  const typography = useThemeTypography();

  if (!description) return null;

  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      backgroundColor: colors.background.white
    },
    caption: {
      color: colors.text.primary,
      ...typography.h3
    },
    description: {
      ...typography.body1,
      color: colors.text.primary
    }
  });

  return (
    <>
      {/* Description courte */}
      <ThemedView style={styles.container}>
        <ThemedText style={styles.caption}>Description</ThemedText>
        <ThemedText style={styles.description}>
          {RenderHTMLToText(description, true)}
        </ThemedText>
      </ThemedView>

      {/* Description détaillée en accordéon */}
      <ThemedView style={styles.container}>
        <AccordionButton
          title="Details du produit"
          content={RenderHTMLToText(description, true)}
        />
      </ThemedView>

      {/* Politique de retour */}
      <ThemedView style={styles.container}>
        <AccordionButton
          title="Retour sous 5 jours"
          content={RenderHTMLToText(description, true)}
        />
      </ThemedView>
    </>
  );
};

export default ProductDescription;