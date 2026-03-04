import { Stack } from "expo-router";
 import { useFonts, Montaga_400Regular } from '@expo-google-fonts/montaga';
 import { Inter_400Regular, } from '@expo-google-fonts/inter';



export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Montaga': Montaga_400Regular,
    'Inter': Inter_400Regular,
  });
  return <Stack screenOptions={{ headerShown: false }}/>;
}
