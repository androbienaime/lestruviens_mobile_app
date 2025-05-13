import { useThemeColors } from '@/theme';
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

interface QuantityControlProps {
  min: number;
  max ?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  containerStyle?: ViewStyle;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  min,
  max=10000000,
  initialValue = min,
  onValueChange,
  containerStyle,
  ...otherPros
}) => {
  const [quantity, setQuantity] = useState<number>(
    Math.max(min, Math.min(max, initialValue))
  );
  const inputRef = useRef<TextInput>(null);

  const handleIncrement = () => {
    if (quantity < max) {
      const newValue = quantity + 1;
      setQuantity(newValue);
      onValueChange?.(newValue);
    }
    Keyboard.dismiss();
  };

  const handleDecrement = () => {
    if (quantity > min) {
      const newValue = quantity - 1;
      setQuantity(newValue);
      onValueChange?.(newValue);
    }
    Keyboard.dismiss();
  };

  const handleInputChange = (text: string) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
    
    if (isNaN(numericValue)) {
      return;
    }
    
    let newValue = Math.max(min, Math.min(max, numericValue));
    setQuantity(newValue);
    onValueChange?.(newValue);
  };

  const handleBlur = () => {
    // S'assurer que la valeur est dans les limites quand l'utilisateur termine la saisie
    const newValue = Math.max(min, Math.min(max, quantity));
    setQuantity(newValue);
    onValueChange?.(newValue);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const colors = useThemeColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, containerStyle]} {...otherPros}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleDecrement}
        disabled={quantity <= min}
      >
        <Text style={[styles.buttonText, quantity <= min && styles.disabledText]}>-</Text>
      </TouchableOpacity>
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        keyboardType="numeric"
        value={quantity.toString()}
        onChangeText={handleInputChange}
        onBlur={handleBlur}
        selectTextOnFocus
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleIncrement}
        disabled={quantity >= max}
      >
        <Text style={[styles.buttonText, quantity >= max && styles.disabledText]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>  
    StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 42 * 3, // Pour que les 3 éléments fassent bien 42 de large au total
        height: 13 * 3, // Multiplié par 3 pour une meilleure visibilité
        backgroundColor: colors.gray, // Gris
        borderRadius: 10,
    },
    button: {
        width: 42,
        height: 39, // 13*3
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 39, // 13*3
        textAlign: 'center',
        color: 'black',
        backgroundColor: colors.gray,
        fontSize: 16,
        paddingVertical: 0,
    },
    buttonText: {
        fontSize: 20,
        color: colors.text.primary,
        fontWeight: 'bold',
    },
    disabledText: {
        opacity: 0.5,
    }
    });

export default QuantityControl;