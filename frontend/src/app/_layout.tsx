import "./global.css"
import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native' // ThemeProvider is used to provide the current theme (dark or light) to the entire app, allowing for consistent theming across all screens and components. DarkTheme and DefaultTheme are predefined themes provided by React Navigation that can be used as a base for your app's styling.
import { StatusBar } from 'expo-status-bar' //Top Bar of our phone that shows time, battery, etc.
import { SplashScreenController } from "@/components/splash-screen-controller"; // This component will control the splash screen visibility based on the authentication loading state.
import { useAuthContext } from '@/hooks/use-auth-context' // Custom hook to access authentication context, which provides information about the user's authentication state.
import { useColorScheme } from '@/hooks/use-color-scheme' // Custom hook to determine the current color scheme (light or dark mode) of the app.
import AuthProvider from '@/providers/auth-provider' // Context provider that manages authentication state and provides it to the rest of the app.

// Separate component so it can access AuthContext
function RootNavigator() {
  const { isLoggedIn } = useAuthContext()

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  )
}

// import "./global.css"
// import { Stack } from "expo-router"
// import AuthProvider from '@/providers/auth-provider'
// import { SplashScreenController } from "@/components/splash-screen-controller"
// import { useAuthContext } from '@/hooks/use-auth-context'

// function RootNavigator() {
//   const { isLoggedIn } = useAuthContext()

//   return (
//     <Stack>
//       <Stack.Protected guard={isLoggedIn}>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//       </Stack.Protected>
//       <Stack.Protected guard={!isLoggedIn}>
//         <Stack.Screen name="login" options={{ headerShown: false }} />
//       </Stack.Protected>
//     </Stack>
//   )
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <SplashScreenController />
//       <RootNavigator />
//     </AuthProvider>
//   )
// }