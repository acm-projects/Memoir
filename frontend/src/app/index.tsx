import { Text, View,  StyleSheet } from 'react-native';
import { Redirect } from 'expo-router'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
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
  },
});
import React, { useState } from 'react';
import EnvelopeLoading from '../components/EnvelopeLoading';
import { View, Text } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <EnvelopeLoading onComplete={() => setIsLoading(false)} />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Welcome to the App!</Text>
    </View>
  );
}
