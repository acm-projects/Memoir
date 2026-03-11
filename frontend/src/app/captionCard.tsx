import { Text, View,  StyleSheet, ImageBackground, TextInput,Platform, Pressable, TouchableOpacity }from 'react-native';
import { Redirect } from 'expo-router'
import React,{useState} from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function CaptionCard() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [Uploaddate, setUploadDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false); 


  const toggleDatePicker = () => {
    setShow(!show);
  };

  const onChange = (event : DateTimePickerEvent, selectedDate?:Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); 
    setShow(false);
    setDate(currentDate);
  };

    return(
    <View style={styles.container}>
        <View style= {styles.paperBackgroundContainer}>
            <ImageBackground
                source = {require('../../assets/images/vintage-paper-background.png')}
                style = {styles.paperBackground}
                imageStyle = {{ width:'100%', height:'100%' }}>





                    
                
                <View style = {styles.inputContainer}>
                <Text style={{fontFamily:'Inter', fontSize:18 , marginLeft: 34,}}> Date</Text>
                        {show && (
                            <DateTimePicker
                            value={date}
                            mode="date"
                            display="spinner" 
                            maximumDate={new Date()} 
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
                
                
                    <Text style={{fontFamily:'Inter', fontSize:18,  marginLeft: 34}}> Title</Text>
                        <TextInput
                            style = {styles.input}
                            onChangeText={(text) => setTitle(text)}
                            value = {title}
                        />
            
                    
                    <Text style={{fontFamily:'Inter', fontSize:18,  marginLeft: 34}}> Caption</Text>
                        <TextInput
                            style = {styles.multilineInput}
                            onChangeText={(text) => setCaption(text)}
                            multiline = {true}
                            numberOfLines={4}
                            value={caption}
                        />

                    



                </View>
            </ImageBackground>
        </View>
    </View>
)}




const styles = StyleSheet.create({

    
    container:{
        flex:1,
        backgroundColor:'#557263',
        alignItems:'center',
    },

    paperBackgroundContainer:{
        width: '90%',
        height: '90%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop:60,

    },

    paperBackground:{
        width: '100%',
        height: '100%',
       
    },

    inputContainer:{

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

      multilineInput: {

        minHeight: 120,          
        paddingTop: 12,       
        paddingBottom: 12,    
        paddingHorizontal: 10,
        textAlignVertical: 'top', 
        backgroundColor:'#F5EEE1',
        width: '80%',
        borderRadius: 8,
        alignSelf:'center',
        borderWidth: .25,           
        borderColor: '#590502',   
        borderStyle: 'solid',
      }
      
})