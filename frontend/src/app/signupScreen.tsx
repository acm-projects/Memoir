import React,{useState} from 'react';
import { Button, View, Text, TextInput , StyleSheet, ImageBackground,  Image, TouchableOpacity, Platform,Pressable, TouchableWithoutFeedback, 
  Keyboard  } from "react-native";
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RedButton } from '../components/redButton';


export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [dateofBirth, setdateofBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const toggleDatePicker = () => {
    setShow(!show);
  };

  const onChange = (event: any, selectedDate?: Date) => {
  if (event.type === 'set') {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  } else {
    setShow(false);
  }
};

  const handleSignup = () => {
    if (!name || !email) {
      alert("Please fill in all fields");
      return;
    }
    const userData = {
      fullName: name,
      email: email,
      birthday: date.toISOString(), 
    };
    router.push('/avatar-selection');
  };

  

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
        onChangeText={(text) => setemail(text)}
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

// TODO: Integrate with backend API here (endpoint: /signup, method: POST)
// TODO: Add backend integration logic (loading, error handling, response handling)
// TODO: Connect to authentication/user session backend
