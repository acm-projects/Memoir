import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity, } from "react-native";
import { router } from "expo-router";
import { hide } from "expo-router/build/utils/splash";


export default function Signup() {
 return (

   <View style={styles.container}>


   
     <ImageBackground
     
       source = {require('../../assets/images/vintage-paper-background.jpg')} //paper background
       style = {styles.paperBackground}
       imageStyle = {{ width:'100%', height:'100%' }}
     >
       <View style={styles.border}>  {/*border around paper background*/}
       <Text style={styles.loginHeader}> Sign Up</Text>{/*header*/}
      
      
        {/* inputs */}
       <Text style={styles.name}> Name</Text>
       <TextInput
         style = {styles.input}
         />


       <Text style={styles.password}> Birthday</Text>
         <TextInput
         style = {styles.input}
        
       />


       <Text style={styles.password}> Email</Text>
         <TextInput
         style = {styles.input}
         keyboardType="email-address"
       />


       <Text style={styles.password}> Password </Text>
         <TextInput
         style = {styles.input}
         secureTextEntry = {true}
         />       
     
       <Text style={styles.password}> Confirm Password </Text>
       <TextInput
         style = {styles.input}
         secureTextEntry = {true}
         />
      
       <TouchableOpacity onPress = {() => {}} style={styles.signupButton} activeOpacity={0.5}>{/*create create account button, and lower opacity when pressed*/}
         <Text style ={styles.login}> Create Account </Text>
       </TouchableOpacity>




       <View style = {{ flexDirection: 'row' ,justifyContent:'center', padding:5}}>{/*have account text and log in button next to each other s*/}
         <Text style = {styles.noAccount}>Already have an account?</Text>
         <TouchableOpacity onPress = {() => {router.replace('/loginScreen')}} activeOpacity={0.7}>{/*create button to go to login page*/}
           <Text style ={styles.noAccount}> Log in</Text>
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
       </View>
  
    
 </View>
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
     borderColor: '#557263',   
     borderStyle: 'dashed',
   },


 loginHeader:{
   fontFamily: 'Montaga',
   paddingTop: 50,
   fontSize : 64,
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


 frontEnvelopeWrapper:{
   bottom: -100,
   position: 'absolute',
   width: '100%',
   zIndex: 3,


 },


 frontEnvelope:{
   resizeMode: 'contain',
   width: '100%',
  
  
  
 }




})
