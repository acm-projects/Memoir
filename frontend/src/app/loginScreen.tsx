//INTEGRATED
import { supabase } from '@/lib/supabase' // Importing the Supabase client instance to interact with the authentication and database services provided by Supabase.
import { useState } from 'react' // Importing the useState hook from React to manage local state within the component.
import { TouchableWithoutFeedback, View, Keyboard,  Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity, Alert,  } from "react-native"; // Importing various components from React Native to build the user interface, including View for layout, Text for displaying text, TextInput for user input fields, Pressable and TouchableOpacity for creating touchable elements, StyleSheet for styling, ImageBackground and Image for displaying images, Keyboard for handling keyboard interactions, and Alert for showing alert dialogs.
import { useRouter } from 'expo-router'; // Importing the useRouter hook from Expo Router to enable navigation between different screens in the app, allowing for programmatic navigation based on user actions such as successful login or signup.
import { createDefaultFolder } from '@/services/folders.service'; // Importing the createDefaultFolder function from the folders service, which is likely used to create a default folder for the user upon successful login if they do not already have one. This helps ensure that new users have a default organizational structure in place for their content.

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState('') // State variable to hold the user's email input.
  const [password, setPassword] = useState('') // State variable to hold the user's password input.
  const [isLoading, setIsLoading] = useState(false) // State variable to indicate whether a login request is in progress, used to disable the login button and show a loading indicator.

  // Handle email/password login
  async function handleLogin() {
    if(!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.') // Show an alert if either the email or password fields are empty.
      return;
    }

    setIsLoading(true) // Set loading state to true to indicate that a login request is in progress.
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); // Call the signInWithPassword method from the Supabase client to attempt to log in the user with the provided email and password.

    if (error) {
      Alert.alert('Login Error', error.message) // If there is an error during login, show an alert with the error message.
      setIsLoading(false) // Set loading state back to false if there was an error.
      return;
    }

    // Create default folder if it doesn't exist
    const { data: folders } = await supabase.from('folders').select('id').eq('user_id', data.user.id).eq('is_default', true);

    if(!folders || folders.length === 0) {
      await createDefaultFolder(data.user.id) // If the user does not have a default folder, create one using the createDefaultFolder function.
    }

    // Check if avatar exists
    const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', data.user.id).single();
    
    setIsLoading(false) // Set loading state back to false after checking for the avatar.

    if(!profile?.avatar_url) {
      router.push('/avatar-selection') // If the user does not have an avatar, navigate to the avatar setup screen.
    } else {
      router.replace('/timelineScreen') // If the user has an avatar, navigate to the timeline screen.
    }
  }
      {/* TODO: Integrate with backend API here (endpoint: /login, method: POST) */}
      {/* TODO: Add backend integration logic (loading, error handling, response handling) */}
      {/* TODO: Connect to authentication/user session backend */}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ImageBackground
          source = {require('../../assets/images/layered-vintage-paper.png')}
          style = {styles.paperBackground}
          imageStyle = {{ width:'100%', height:'100%' }}
        >
          <View style={styles.border}>
            <Text style={styles.loginHeader}> Login</Text>
            <Text style={styles.email}> Email </Text>
            <TextInput
              style = {styles.input}
              keyboardType="email-address"
              // stores the email input in the state variable 'email' whenever the text changes
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.password}> Password </Text>
            <TextInput
              style = {styles.input}
              secureTextEntry = {true}
              // stores the password input in the state variable 'password' whenever the text changes
              value={password}
              onChangeText={setPassword}
            />

            { /* INTEGRATION: This is where the login logic will be triggered, which includes validating the input, making the API call to log in, and handling the response (success or error). */ }
            <TouchableOpacity onPress={ handleLogin } style={styles.loginButton} activeOpacity={0.8}>
              <Text style ={styles.login}> Login</Text>
            </TouchableOpacity>

            <View style = {{ flexDirection: 'row' ,justifyContent:'center', padding:5}}>
              <Text style = {styles.noAccount}>Don't have an account?</Text>
              <TouchableOpacity 
                onPress={() => router.push('/signupScreen')} 
                activeOpacity={0.7}
                hitSlop={20} // Simple way to make it easier to tap
              >
                <Text style={styles.SignUp}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      
        <View 
          pointerEvents="none" 
          style={styles.stamps}
        >
          <Image
            source={require('../../assets/images/envelope-stamp.png')}
            style = {styles.stamps}
          />
        </View>

        <View 
          pointerEvents="none" 
          style={styles.frontEnvelope}
        >
          <Image
            source={require('../../assets/images/front-envelope.png')}
            style = {styles.frontEnvelope}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
)}

const styles = StyleSheet.create({
 container:{
    flex: 1,
     backgroundColor: "#557263",
     alignItems: 'center',
     justifyContent: 'center',
   },

  border:{
    marginLeft:9,
    marginTop:10,
    width:'95%',
    height:'96%',
    borderWidth: 2,           
    borderColor: '#6D1B12',   
    borderStyle: 'dashed',
  },

 loginHeader:{
   fontFamily: 'Calistoga',
   paddingTop: 50,
   fontSize : 60,
   color: "#5A390E",
   textAlign: 'center',
   justifyContent: 'flex-start',
   marginRight: 20,
 },

 email:{
   fontFamily:'Inter',
   fontSize : 18,
   color: "#5A390E",
   marginTop: 90,
   marginBottom: 3,
   marginLeft: 34,
 },

 input:{
   backgroundColor:'#F5EEE1',
   width: '80%',
   height: 25,
   borderRadius: 8,
   alignSelf:'center',
   marginBottom: 10,
   borderWidth: .25,           
   borderColor: '#590502',   
   borderStyle: 'solid',
 },

 password:{
   fontFamily:'Inter',
   fontSize : 18,
   color: "#5A390E",
   marginLeft: 34,
 },

  paperBackground:{
   width: '93%',
   height: '80%',
   marginBottom: 60,
   borderRadius: 15,
   overflow: 'hidden',
 },
 
 login:{
   fontFamily:'Inter',
   fontSize: 16,
   color: '#E8DCDC',
   textAlign: 'center',
   fontWeight: 'bold',
   marginTop: 10,
   marginRight: 5,
 },

 loginButton:{
   backgroundColor:'#6D1B12',
   borderRadius: 20,
   width: '60%',
   height:40,
   alignSelf:'center',
   marginTop: 20,
  
 },

 noAccount:{
   fontFamily:'Inter',
   fontSize: 12,
   color: "#5A390E",
   marginTop:10,
 },

 SignUp:{
   fontFamily:'Inter',
   fontSize: 12,
   color: "#5A390E",
   textDecorationLine: 'underline',
   marginTop:10,
   zIndex:5,
 },
 
 frontEnvelope:{
   position: 'absolute',
   resizeMode: 'contain',
   bottom:-50,
   width: '100%',
   zIndex: 3,
  
 },

 stamps:{
  position: 'absolute',
  resizeMode: 'contain',
  bottom : -50,
  width: 450,  
  height: 500,
  zIndex: 2,
 },

 subtitle: {
  marginTop: 12,
  marginHorizontal: 24,
  textAlign: 'center',
  color: '#F6E5CD',
  fontSize: 14,
},
})
