import React from 'react';
import { View } from 'react-native';
import CustomRadioInput from '@/components/forms/CustomRadioInput';

type DeclinationColorProps = {
  attributeName: string;
  values: Array<{
    id: number;
    color: string;
  }>;
  selectedValue: string;
  disabledValues: Set<string>;
  onSelect: (value: string) => void;
};

const DeclinationColor: React.FC<DeclinationColorProps> = ({
  attributeName,
  values,
  selectedValue,
  disabledValues,
  onSelect
}) => {
  // Préparer les options pour CustomRadioInput (type couleur)
  const options = values.map(val => ({
    value: val.id.toString(),
    type: 'color' as const,
    content: val.color,
    disabled: disabledValues.has(val.id.toString())
  }));

  return (
    <View style={{ marginLeft: -8 }}>
      <CustomRadioInput
        options={options}
        defaultValue={selectedValue}
        onSelect={onSelect}
      />
    </View>
  );
};

export default DeclinationColor;