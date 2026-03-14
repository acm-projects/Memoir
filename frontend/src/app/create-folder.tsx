import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity,FlatList } from "react-native";
import { router } from "expo-router";


export default function BulletinBoard() {
    return(
        <View style = {styles.container}>
            <ImageBackground
            source = {require('../../assets/images/vintage-paper-background.png')}
            style={styles.paperBackground}>
            <ImageBackground
            source = {require('../../assets/images/blue-swirl-background.png')}
            imageStyle={styles.redSwirl}>
            </ImageBackground>
            <Text style = {styles.header}>Create a New Folder</Text>

            </ImageBackground>
        </View>
    )

}

const styles = StyleSheet.create({

    container:{
        flex:1,
    },

    redSwirl:{
        height: 90,
    },

    paperBackground:{
        flex: 1, 
        width: '100%',
        height: '100%',
    },

    header:{
        fontFamily: 'Calistoga',
        fontSize: 32,
        color:"#5A390E",
        marginTop:100,
        textAlign : 'center',
    },



})
