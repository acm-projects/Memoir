import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function ImagePreview({ uri }: { uri?: string | null }) {
  if (!uri) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.text}>No image yet</Text>
      </View>
    );
  }
  return (
    <Image source={{ uri }} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  placeholder: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6b7f74' },
  text: { color: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 6 },
});
