
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import EnvelopeLoading from '../components/EnvelopeLoading';
import { useRouter,Redirect } from 'expo-router';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  if (isLoading) {
    return (
      <EnvelopeLoading
        onComplete={() => {
          setIsLoading(false);
          router.replace('/signupScreen');
        }}
      />
    );
  }

  // Fallback while routing
  return (
    

    <Redirect href="/view-folder2" />
   
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

