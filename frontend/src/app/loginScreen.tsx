import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity,TouchableWithoutFeedback, 
  Keyboard,  } from "react-native";
import { useRouter } from 'expo-router';
import { RedButton } from '../components/redButton';

export default function Login() {
  const router = useRouter();
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
         />


     
       <Text style={styles.password}> Password </Text>
       <TextInput
         style = {styles.input}
         secureTextEntry = {true}
         />
      
       <TouchableOpacity onPress={() => { router.push('/timelineScreen'); }} style={styles.loginButton} activeOpacity={0.8}>
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
