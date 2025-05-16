import React from 'react';
import { View } from 'react-native';
import CustomRadioInput from '@/components/CustomRadioInput';

type DeclinationRadioProps = {
  attributeName: string;
  values: Array<{
    id: number;
    value: string;
  }>;
  selectedValue: string;
  disabledValues: Set<string>;
  onSelect: (value: string) => void;
};

const DeclinationRadio: React.FC<DeclinationRadioProps> = ({
  attributeName,
  values,
  selectedValue,
  disabledValues,
  onSelect
}) => {
  // Préparer les options pour CustomRadioInput
  const options = values.map(val => ({
    value: val.id.toString(),
    type: 'text' as const,
    content: val.value,
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

export default DeclinationRadio;