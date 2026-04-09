import { supabase } from '@/lib/supabase' // Importing the Supabase client instance to interact with the authentication and database services provided by Supabase.
import React, { useState } from 'react'; // Importing the useState hook from React to manage local state within the component.
import { Alert, Button, View, Text, TextInput , StyleSheet, ImageBackground,  Image, TouchableOpacity, Platform, Pressable, TouchableWithoutFeedback, Keyboard  } from "react-native"; // Importing various components from React Native to build the user interface, including View for layout, Text for displaying text, TextInput for user input fields, StyleSheet for styling, ImageBackground and Image for displaying images, TouchableOpacity and Pressable for creating touchable elements, and Keyboard for handling keyboard interactions.
import { useRouter } from 'expo-router'; // Importing the useRouter hook from Expo Router to enable navigation between different screens in the app.
import DateTimePicker from '@react-native-community/datetimepicker'; // Importing the DateTimePicker component from the @react-native-community/datetimepicker package to allow users to select dates, such as their birthday, in a user-friendly way.
import { RedButton } from '../components/redButton'; // Importing a custom RedButton component, which is likely a styled button used for actions like submitting the signup form.

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState(""); // State variable to hold the user's name input.
  const [email, setEmail] = useState(""); // State variable to hold the user's email input.
  const [dateofBirth, setdateofBirth] = useState(""); // State variable to hold the user's date of birth input, which may be used for age.
  const [date, setDate] = useState(new Date()); // State variable to hold the selected date from the DateTimePicker, initialized to the current date.
  const [show, setShow] = useState(false); // State variable to control the visibility of the DateTimePicker, allowing it to be shown or hidden based on user interaction.
  const [password, setPassword] = useState(""); // State variable to hold the user's password input.
  const [confirmPassword, setConfirmPassword] = useState(""); // State variable to hold the user's confirm password input, which can be used to validate that the user has entered their desired password correctly.
  const [isLoading, setIsLoading] = useState(false); // State variable to indicate whether a signup request is in progress. This can be used to disable the signup button and show a loading indicator while the request is being processed.


  const toggleDatePicker = () => { setShow(!show); } // Function to toggle the visibility of the DateTimePicker, allowing the user to open or close the date selection interface when they want to select their birthday.
  
  const onChange = (event: any, selectedDate?: Date) => {
  if (event.type === 'set') {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); 
    setDate(currentDate);
  } else {
    setShow(false);
  }
};
// INTEGRATION: This is where the signup logic will be triggered, which includes validating the input, making the API call to create a new user account, and handling the response (success or error). 
  async function handleSignup() {
    if(!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.') // Show an alert if any of the required fields (name, email, password, confirm password) are empty.
      return;
    }

    if(password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.') // Show an alert if the password is too short, enforcing a minimum password length for security.
      return;
    }

    if(password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.') // Show an alert if the password and confirm password fields do not match, ensuring that the user has entered their desired password correctly.
      return;
    }

    setIsLoading(true) // Set loading state to true to indicate that a signup request is in progress.

    // Call the signUp method from the Supabase client to attempt to create a new user account with the provided email and password.
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name, // Pass the user's full name as additional user metadata to be stored in the Supabase authentication system. This allows you to associate the user's name with their account and access it later when needed.
          birthday: date.toISOString().split('T')[0], // Pass the user's birthday as additional user metadata in the same way as the full name. The birthday is formatted as a string in the format 'YYYY-MM-DD' by splitting the ISO string representation of the date and taking the date portion. This allows you to store and access the user's birthday information in their account metadata
        }
      }
    }); 

    setIsLoading(false) // Set loading state back to false after the signup request is completed, regardless of success or error.

    if (error) {
      Alert.alert('Signup Error', error.message) // If there is an error during signup, show an alert with the error message to inform the user of what went wrong.
      return;
    }

    Alert.alert('Check your email', 'Please confirm your email before logging in.');
    router.replace('/loginScreen');
  }

  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>


   
     <ImageBackground
     
       source = {require('../../assets/images/layered-vintage-paper.png')} //paper background
       style = {styles.paperBackground}
       imageStyle = {{ width:'100%', height:'100%' }}
     >
       {/*dashed border around paper background*/}
       <View style={styles.border}>  
        {/*header*/}
       <Text style={styles.loginHeader}> Sign Up</Text>
      
      
        {/* inputs */}
       <Text style={styles.name}> Name</Text>
       <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        />

       
    
          <Text style={styles.date}> Birthday</Text>
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner" 
              maximumDate={new Date()} 
              onChange={onChange}
            />
          )}
          
        {show && (
          <View>
            <TouchableOpacity
            style = {styles.confirmDateButton}
              onPress = {toggleDatePicker}>
              <Text style = {styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}


          {!show && (
             <Pressable onPress={toggleDatePicker}>
              <View pointerEvents="none">
             <TextInput
                style={styles.input}
                placeholder="Select Birthday"
                value={date.toLocaleDateString()} 
                editable={false}
              />
              </View>
            </Pressable>
            )}  


        <Text style={styles.password}> Email </Text>
        <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        />

      <Text style={styles.password}> Password </Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)} // Saves typing to state
        />       

      <Text style={styles.password}> Confirm Password </Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)} // Saves typing to state
      />              
      
       


        <RedButton 
          title="Create Account" 
          onPress={handleSignup} 
        />



       <View style = {{ flexDirection: 'row' ,justifyContent:'center', padding:5, marginTop:10}}>{/*have account text and log in button next to each other s*/}
         <Text style = {styles.noAccount}>Already have an account?</Text>
         <TouchableOpacity onPress = {() => {router.push('/loginScreen' as any)}} activeOpacity={0.7}>{/*create button to go to login page*/}
           <Text style ={styles.loginText}> Log in</Text>
         </TouchableOpacity>
       </View>


      </View>
     </ImageBackground>
    
     <View
       style = {styles.frontEnvelopeWrapper}
       pointerEvents = "none">
     <Image
         source = {require('../../assets/images/front-envelope.png')} 
         style = {styles.frontEnvelope}
        
       />

      <Image
         source = {require('../../assets/images/envelope-stamp.png')}
         style = {styles.stamps}
       />

       </View>
  
    
 </View>
 </TouchableWithoutFeedback>
 )
}


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
     borderColor: '#590502',   
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


 name:{
   fontFamily:'Inter',
   fontSize : 18,
   color: "#5A390E",
   marginTop: 20,
   marginLeft: 34,
   marginBottom: 3,
 },

 date: {
  paddingTop: 3,
  fontFamily:'Inter',
  fontSize : 18,
  color: "#5A390E",
  marginLeft: 34,
},


confirmDateButton: {
  backgroundColor: '#590502', 
  padding: 10,
  borderRadius: 10,
  alignSelf: 'center',
  marginTop: 10,
  marginBottom: 20,
},

confirmButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontFamily: 'Inter',
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
   marginBottom: 3,
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


 signupButton:{
   backgroundColor:'#590502',
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
 },

 loginText:{
   fontFamily:'Inter',
   fontSize: 12,
   color: "#5A390E",
   textDecorationLine: 'underline'
 },


 frontEnvelopeWrapper:{
   bottom: -100,
   position: 'absolute',
   width: '100%',
   zIndex: 3,
   alignItems: 'center',


 },

 stamps:{
  position: 'absolute',
  resizeMode: 'contain',
  bottom : 0,
  width: 450,  
  height: 500,
  zIndex: 2,
  
 },


 frontEnvelope:{
   resizeMode: 'contain',
   width: '100%',
   zIndex : 3,
  
 }
});

// TODO: Integrate with backend API here (endpoint: /signup, method: POST)
// TODO: Add backend integration logic (loading, error handling, response handling)
// TODO: Connect to authentication/user session backend