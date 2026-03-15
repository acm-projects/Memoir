import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, Image, TouchableOpacity, } from "react-native"; 

import { router } from "expo-router"; 

 

 

export default function CreateFolder() { 

return( 

<View style = {styles.container}> 

<ImageBackground 

source = {require('../../assets/images/vintage-paper-background.png')} 

style={styles.paperBackground}> 

<ImageBackground 

source = {require('../../assets/images/RED swirl subtle.png')} 

imageStyle={styles.redSwirl}> 

<Text style = {styles.FolderName}>FolderName</Text> 

</ImageBackground> 

 

</ImageBackground> 

</View> 

) 

 

} 

 

const styles = StyleSheet.create({ 

 

container:{ 

flex:1, 

}, 

 

redSwirl:{ 

height: 100, 

}, 

 

paperBackground:{ 

flex: 1,  

width: '100%', 

height: '100%', 

}, 

 

FolderName:{ 

fontFamily: 'Calistoga', 

fontSize: 32, 

color:"#6D1B12", 

marginTop: 150, 

textAlign : 'left', 

} 

 

}) 

 