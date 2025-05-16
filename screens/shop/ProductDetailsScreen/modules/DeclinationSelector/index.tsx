import React from 'react';
import { View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColors, useThemeTypography } from '@/theme';
import DeclinationRadio from './DeclinationRadio';
import DeclinationColor from './DeclinationColor';
import { ThemedText } from '@/components/ThemedText';

type DeclinationSelectorProps = {
  organizedValues: Record<number, { 
    id: number; 
    values: any[]; 
    name: string; 
    type: string 
  }>;
  selectedDeclinations: Record<string, string>;
  errors: Record<string, string>;
  disabledValues: Record<string, Set<string>>;
  onDeclinationSelect: (attributeName: string, value: string) => void;
};

const DeclinationSelector: React.FC<DeclinationSelectorProps> = ({
  organizedValues,
  selectedDeclinations,
  errors,
  disabledValues,
  onDeclinationSelect
}) => {
  const colors = useThemeColors();
  const typography = useThemeTypography();

  // Si aucune déclinaison à afficher, ne rien rendre
  if (!organizedValues || Object.keys(organizedValues).length === 0) {
    return null;
  }

  return (
    <>
      {Object.values(organizedValues).map((item, index) => {
        // Sélecteur de type radio (taille, modèle, etc.)
        if (item.type === 'radio') {
          return (
            <ThemedView key={`radio-${index}`} style={{ marginTop: 10, backgroundColor: colors.background.white }}>
              <ThemedText style={{ ...typography.h3, color: colors.text.primary }}>
                Selectionner {item.name}
              </ThemedText>
              <DeclinationRadio
                attributeName={item.name}
                values={item.values}
                selectedValue={selectedDeclinations[item.name] || ''}
                disabledValues={disabledValues[item.name] || new Set()}
                onSelect={(value) => onDeclinationSelect(item.name, value)}
              />
              {errors[item.name] && (
                <Text style={{ color: 'red', marginTop: 4 }}>{errors[item.name]}</Text>
              )}
            </ThemedView>
          );
        }
        
        // Sélecteur de type couleur
        if (item.type === 'color') {
          return (
            <ThemedView key={`color-${index}`} style={{ marginTop: 10, backgroundColor: colors.background.white }}>
              <ThemedText style={{ ...typography.h3, color: colors.text.primary }}>
                Selectionner {item.name}
              </ThemedText>
              <DeclinationColor
                attributeName={item.name}
                values={item.values}
                selectedValue={selectedDeclinations[item.name] || ''}
                disabledValues={disabledValues[item.name] || new Set()}
                onSelect={(value) => onDeclinationSelect(item.name, value)}
              />
              {errors[item.name] && (
                <Text style={{ color: 'red', marginTop: 4 }}>{errors[item.name]}</Text>
              )}
            </ThemedView>
          );
        }
        
        return null;
      })}
    </>
  );
};

export default DeclinationSelector;