import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle, Image, ImageSourcePropType } from 'react-native';

interface RadioOption {
  value: string;
  caption?: string;
  type: 'text' | 'color' | 'image';
  content: string; // Texte pour 'text', code couleur pour 'color'
  imageSource?: ImageSourcePropType;
  disabled?: boolean;
}

interface CustomRadioProps {
  options: RadioOption[];
  defaultValue?: string;
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  captionStyle?: TextStyle;
}

const CustomRadioInput: React.FC<CustomRadioProps> = ({
  options,
  defaultValue,
  onSelect,
  containerStyle,
  textStyle,
  captionStyle,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue || '');

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
  };

  const renderContent = (option: RadioOption, isSelected: boolean) => {
    switch (option.type) {
      case 'color':
        return (
          <View 
            style={[
              styles.colorCircle, 
              { backgroundColor: option.content || '#CCCCCC' }
            ]} 
          />
        );
      case 'image':
        return (
          <Image 
            source={option.imageSource || require('@/assets/images/placeholder-image.png')} 
            style={styles.optionImage}
            resizeMode="cover"
          />
        );
      case 'text':
      default:
        return (
          <Text 
            style={[
              styles.radioText, 
              textStyle,
              isSelected && styles.radioTextActive
            ]}
          >
            {option.content}
          </Text>
        );
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => (
        <View key={option.value} style={styles.optionWrapper}>
          {option.caption && (
            <Text style={[styles.caption, captionStyle]}>
              {option.caption}
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.radioButton,
              // Pour les types couleur/image, on utilise un style rond
              (option.type === 'color' || option.type === 'image') && styles.roundRadioButton,
              selectedOption === option.value && styles.radioButtonActive,
              option.disabled && styles.disabledOption, // 👈 désactiver le style

            ]}
            onPress={() => {
              if (!option.disabled) {
                handleSelect(option.value);
              }
            }}
            activeOpacity={option.disabled ? 1 : 0.8} //             activeOpacity={0.8}
          >
            {renderContent(option, selectedOption === option.value)}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  optionWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  radioButton: {
    width: 45,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 4,
    marginVertical: 8
  },
  roundRadioButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Forme circulaire pour image/couleur
  },
  radioButtonActive: {
    borderColor: '#F2B632',
    backgroundColor: 'white',
  },
  radioText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'gray',
  },
  radioTextActive: {
    color: '#F2B632',
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 7,
    marginBottom: 2,
    textAlign: 'center',
    color: 'gray',
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  optionImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  disabledOption: {
    opacity: 0.3,
    
  },
  
});

export default CustomRadioInput;