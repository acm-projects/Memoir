import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,  Image, TouchableOpacity, } from "react-native";
import { router } from "expo-router";
import BottomNavbar from '../components/BottomNavbar';


export default function viewFolder() {
    return (
        <View style={styles.container}>
         <Text>View Folder</Text>
         <BottomNavbar />
        </View>
    )}



    const styles = StyleSheet.create({
        container:{
            flex:1,
        }
        
    })