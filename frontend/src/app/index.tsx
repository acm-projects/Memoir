import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import EnvelopeLoading from '../components/EnvelopeLoading';
import { useRouter } from 'expo-router';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  if (isLoading) {
    return (
      <EnvelopeLoading
        onComplete={() => {
          setIsLoading(false);
          router.push('/loginScreen');
        }}
      />
    );
  }

  // Fallback while routing
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting…</Text>
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

