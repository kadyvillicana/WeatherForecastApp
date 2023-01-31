import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

// CustomIcon component to wrap the FontAwesome Icon component
function CustomIcon({ name, size, color, style }) {
  return (
    // Render the FontAwesome Icon component
    <Icon
      name={name}
      size={size}
      color={color}
      style={{ ...style }}
    />
  )
}

export default CustomIcon;