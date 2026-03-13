import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity, } from "react-native";
import { router } from "expo-router";


export default function viewFolder() {
    return (
        <View style={styles.container}>
            <ImageBackground
     
                source = {require('../../assets/images/vintage-paper-background.png')}
                style = {styles.paperBackground}
                imageStyle = {{ width:'100%', height:'100%' }}>
            
            <View style={styles.swirlBackgroundContainer}>
            <ImageBackground
            source={require('../../assets/images/blue-swirl-background.png')}
            style={styles.swirlBackground}
            >
           
                </ImageBackground>
                </View>
                </ImageBackground>
   

        </View>
    )}



    const styles = StyleSheet.create({
        container:{
            flex:1,
        },

        paperBackground:{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        },

        swirlBackgroundContainer: {
            flex: 1,
            width: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            marginTop: 100,
          },

          swirlBackground: {
            flex: 1,
            borderRadius: 20,
            resizeMode: 'cover',
          },


    })