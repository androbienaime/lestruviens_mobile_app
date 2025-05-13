import { typography, useThemeColors } from '@/theme';
import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  LayoutAnimation, 
  Platform, 
  UIManager, 
  ViewStyle,
  TextStyle
} from 'react-native';

// Activer les animations de layout pour Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  content: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

const AccordionButton: React.FC<AccordionProps> = ({
  title,
  content,
  containerStyle,
  titleStyle,
  contentStyle
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    // Animation fluide lors du changement d'état
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const colors = useThemeColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleAccordion} 
        activeOpacity={0.7}
      >
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[
          styles.arrow,
          { transform: [{ rotate: expanded ? '90deg' : '0deg' }] }
        ]}>
          &gt;
        </Text>
      </TouchableOpacity>
      
      {expanded && (
        <View style={[styles.content, contentStyle]}>
          {content}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) => 
StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderColor: colors.border.default,
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  title: {
    ...typography.h4,
    flex: 1,

  },
  arrow: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: colors.text.tertiary
  },
  content: {
    paddingTop: 5,
    textAlign: 'justify'
  },
});

export default AccordionButton;