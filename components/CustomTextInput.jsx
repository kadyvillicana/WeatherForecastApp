import React from 'react';
import { TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

const FontSize = {
  small: 15,
  medium: 18,
  large: 23,
  extraLarge: 35,
  mega: 75,
};

function CustomTextInput(props) {
  const { colors } = useTheme();
  const { style, size } = props;
  return (
    <TextInput
      {...props}
      style={[
        {
          fontSize: FontSize[size],
          fontFamily: "QuattrocentoSans",
          color: colors.text,
          ...style
        }
      ]} />
  )
}

export default CustomTextInput