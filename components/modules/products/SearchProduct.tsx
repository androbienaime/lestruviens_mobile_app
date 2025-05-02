import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; // ou 'react-native-vector-icons'
import { useThemeColors } from '@/theme';

interface SearchProductProps {
  value: string;
  onChangeText: (text: string) => void;
  onCameraPress: () => void;
  onSearch: () => void;
  inputProps?: TextInputProps;
}

const SearchProduct: React.FC<SearchProductProps> = ({
  value,
  onChangeText,
  onCameraPress,
  onSearch,
  inputProps,
}) => {

  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onSearch}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Rechercher un produit"
        placeholderTextColor={colors.text?.disabled}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSearch}
        {...inputProps}
      />

      <TouchableOpacity onPress={onCameraPress}>
        <Feather name="camera" size={20} color="#888" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchProduct;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
  },
  icon: {
    paddingHorizontal: 4,
  },
});
