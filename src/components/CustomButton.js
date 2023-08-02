import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

export default function CustomButton(props) {
  const {title, onPress, variant} = props;

  const colorGenerator = useCallback(() => {
    switch (variant) {
      case 'danger':
        return '#FF5252';
      case 'warning':
        return '#FCD900';
      default:
        return '#009688';
    }
  }, [variant]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[
        styles.container,
        {
          borderColor: colorGenerator(),
        },
      ]}>
      <Text
        style={[
          styles.titleText,
          {
            color: colorGenerator(),
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'black',
  },
});
