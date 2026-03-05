import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import EnvelopeLoading from '../components/EnvelopeLoading';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <EnvelopeLoading onComplete={() => setIsLoading(false)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
