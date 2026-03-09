import { Stack } from "expo-router";
import { useFonts, Montaga_400Regular } from '@expo-google-fonts/montaga';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import "./global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    'Montaga': Montaga_400Regular,
    'Inter': Inter_400Regular,
  });

  if (!loaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
