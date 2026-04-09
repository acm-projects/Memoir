import { useAuthContext } from '@/hooks/use-auth-context'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {
  const { isLoading } = useAuthContext()

  if (!isLoading) {
    SplashScreen.hideAsync()
  }

  return null
}