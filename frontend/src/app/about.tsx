import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function About() {
  return (
    <ImageBackground 
      source={require('../../assets/images/swirls.jpg')} 
      style={styles.background}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>About</Text>
        <Text style={styles.content}>This is the Memoir app, where you can create and share your memories with friends and family.</Text>
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
  content: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
