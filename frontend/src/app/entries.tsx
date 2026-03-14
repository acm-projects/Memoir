import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Entries() {
  return (
    <ImageBackground 
      source={require('../../assets/images/swirls.jpg')} 
      style={styles.background}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Your Entries</Text>
        {/* Add your entries list here */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
