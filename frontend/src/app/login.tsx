import { supabase } from '@/lib/supabase' // Importing the Supabase client instance to interact with the authentication and database services provided by Supabase.
import { useState } from 'react' // Importing the useState hook from React to manage local state within the component.
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native' // Importing various components from React Native to build the user interface of the login screen.
import { Stack } from 'expo-router' // Importing the Stack component from Expo Router to handle navigation between screens in the app.

export default function LoginScreen() {
    //state memory to hold what user types
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle email/password sign up
  async function handleSignUp() {
    if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters')
        return
    }
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      Alert.alert('Sign Up Error', error.message)
    } else {
      Alert.alert('Success!', 'Check your email for a confirmation link')
    }
    setIsLoading(false)
  }

  // Handle email/password login
  async function handleLogin() {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      Alert.alert('Login Error', error.message)
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

      <TouchableOpacity
        style={[styles.button, styles.signUpButton]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
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
  signUpButton: {
    backgroundColor: '#363b40',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})