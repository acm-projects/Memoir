import { supabase } from '@/lib/supabase' // Importing the Supabase client instance to interact with the authentication and database services provided by Supabase.
import { useState } from 'react' // Importing the useState hook from React to manage local state within the component.
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native' // Importing various components from React Native to build the user interface of the login screen.
import { Link, router } from 'expo-router' // Importing the Link component from Expo Router to enable navigation between different screens in the app.
import { getProfile } from '@/services/profile.service'

export default function LoginScreen() {
    //state memory to hold what user types
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle email/password login
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password')
      return
    }
    setIsLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      Alert.alert('Login Error', error.message)
      setIsLoading(false)
      return
    }

    // Check if user has an avatar set
    if (data.user) {
      const { data: profile } = await getProfile(data.user.id)
      if (!profile?.avatar_url) {
        router.replace('/avatar-selection')  // first time user
      } else {
        // router.replace('/(tabs)')            // returning user — go to main app
      }
    }

    setIsLoading(false)
  }
  //visuals (what the user sees) of the login screen -----FRONTEND CHANGES START HERE-----
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memoir</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Link href="/signupScreen" style={styles.link}>
        <Text style={styles.linkText}>
          Don't have an account? Sign Up
        </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#363b40',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#208AEF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    color: '#208AEF',
    fontSize: 14,
  },
})