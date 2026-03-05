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