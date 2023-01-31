import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

const FontSize = {
  small: 15,
  medium: 18,
  large: 23,
  extraLarge: 35,
  mega: 75,
};

// CustomText component to display text with different font size and color 
// based on the theme and the passed size and isPrimary props
function CustomText({ size, style, children, isPrimary }) {
  const { colors } = useTheme();
  return (
    <Text style={[
      {
        fontSize: FontSize[size],
        fontFamily: "QuattrocentoSans",
        color: (isPrimary ? colors.text : colors.secondaryText),
        ...style
      }
    ]}>
      {children}
    </Text>
  )
}

export default CustomText