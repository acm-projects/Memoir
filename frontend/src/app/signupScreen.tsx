import { supabase } from '@/lib/supabase' // Importing the Supabase client instance to interact with the authentication and database services provided by Supabase.
import { useState } from 'react' // Importing the useState hook from React to manage local state within the component.
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native' // Importing various components from React Native to build the user interface of the login screen.
import { Link, router } from 'expo-router' // Importing the Link component from Expo Router to enable navigation between different screens in the app.
import { createDefaultFolder } from '@/services/folders.service' // Importing a function to create a default folder for the user after they sign up. This will be called in the signup flow to ensure every user starts with a default "All Memories" folder.

export default function SignUpScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSignUp() {
        //Validation checks for user input
        if(!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        if(password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters')
            return
        }if(password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match')
            return
        }

        setIsLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            Alert.alert('Sign Up Error', error.message)
            setIsLoading(false)
            return
        }

        if (data.user) {
          const { error: folderError } = await createDefaultFolder(data.user.id) // Automatically create the default "All Memories" folder for the new user. This ensures that every user starts with a folder to store their memories, improving the initial user experience.
          if (folderError) {
            console.error('Failed to create default folder:', folderError)
            // optionally alert the user or retry
          }
        }

        //Success - go to avatar selection screen
        router.replace('/avatar-selection')
        setIsLoading(false)
}
return (
    <View style={styles.container}>
      <Text style={styles.title}>Memoir</Text>
      <Text style={styles.subtitle}>Create your account</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>
          Already have an account? Login
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