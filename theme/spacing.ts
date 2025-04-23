const spacing = {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    
    // For layout
    container: 16,
    section: 24,
    
    // Specific component spacing
    buttonPaddingVertical: 12,
    buttonPaddingHorizontal: 16,
    inputPaddingVertical: 12,
    inputPaddingHorizontal: 16,
    cardPadding: 16,
    iconSize: {
      small: 16,
      medium: 24,
      large: 32,
    },
    
    // Helper functions for responsive spacing
    responsive: (size: number) => size,
  };
  
  export default spacing;