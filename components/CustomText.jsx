import React from 'react';
import { StyleSheet, Text } from 'react-native';

const FontSize = {
  small: 13,
  medium: 18,
  large: 23,
  extraLarge: 27,
};

function CustomText({size, style, children}) {
  return (
    <Text style={[{fontSize:FontSize[size], ...style}]}>
      {children}
    </Text>
  )
}

export default CustomText