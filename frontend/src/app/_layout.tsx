import { Calistoga_400Regular } from '@expo-google-fonts/calistoga';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Montaga_400Regular, useFonts } from '@expo-google-fonts/montaga';
import { Stack } from "expo-router";
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
      {/* Back to default animation behavior */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="chatRoom" options={{ headerShown: true }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
