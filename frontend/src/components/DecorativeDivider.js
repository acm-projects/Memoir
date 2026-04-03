import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function DecorativeDivider() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/decorative-divider.png')} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: '80%',
    height: 16,
  },
});
