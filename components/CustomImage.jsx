import React from 'react';
import { Image } from 'react-native';

const ImageSize = {
  tiny: {
    width: 30,
    height: 30,
  },
  regular: {
    width: 40,
    height: 40
  }
}

function CustomImage(props) {
  const { size } = props;
  return (
    <Image
      {...props}
      style={
        [
          ImageSize[size]
        ]
      }
    />
  )
}

export default CustomImage;