import { Stack } from "expo-router";
import { useFonts, Montaga_400Regular } from '@expo-google-fonts/montaga';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Calistoga_400Regular } from '@expo-google-fonts/calistoga';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    'Montaga': Montaga_400Regular,
    'Inter': Inter_400Regular,
    'Calistoga': Calistoga_400Regular,
  });

  if (!loaded) return null;
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
  <Stack screenOptions={{ headerShown: false }} />
  </GestureHandlerRootView>
);}
