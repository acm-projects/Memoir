import React from 'react'; 

import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native'; 

import { Ionicons } from '@expo/vector-icons'; // For the pencil icon 

 

interface FolderItemProps { 

title: string; 

imageSource?: ImageSourcePropType;  

isAddButton?: boolean; 

} 

 

 

const FolderItem = ({ title, imageSource, isAddButton = false }: FolderItemProps) => { 

return ( 

<View style={styles.cardContainer}> 

<View style={styles.folderBase}> 

{/* Layer 1: The Red Background */} 

<View style={styles.folderTop} /> 

{/* Layer 2: The Stamp (Now inside the folder box) */} 

{!isAddButton && ( 

<View style={styles.stampInsideContainer}> 

<Image source={imageSource} style={styles.stampImage} /> 

</View> 

)} 

{/* Layer 3: The Tan Bottom (The pocket front) */} 

<View style={styles.folderBottom}> 

<Text numberOfLines={1} style={styles.folderText}>{title}</Text> 

</View> 

</View> 

{/* The Plus Button for 'Add' stays as an overlay */} 

{isAddButton && ( 

<View style={styles.plusContainer}> 

<Ionicons name="add-outline" size={40} color="#D9C5A3" /> 

</View> 

)} 

</View> 

); 

}; 

const styles = StyleSheet.create({ 

    cardContainer: {
        width: 110,        // fixed pixel width instead of % (works in any grid)
        aspectRatio: .8,
        marginBottom: 6,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },

 

folderBase: { 

width: '100%', 

height: '100%',  

borderRadius: 12, 

borderWidth: 0.5, 

borderColor: 'rgba(0,0,0,0.1)', 

}, 

folderTop: { 

flex: 2, // 80% of the folder is red 

backgroundColor: '#6D1B12', 

borderTopRightRadius:10, 

borderTopLeftRadius:10, 

}, 

folderBottom: { 

flex: 1, // 20% of the folder is tan 

backgroundColor: '#D9C5A3', 

flexDirection: 'row', 

alignItems: 'center', 

justifyContent: 'center', 

zIndex: 20,  

borderBottomRightRadius:10, 

borderBottomLeftRadius:10, 

}, 

stampInsideContainer: {
    position: 'absolute',
    top: -40,          // adjusted to match smaller paddingTop
    left: 10,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

stampImage: {
    width: 90,         // slightly smaller to fit the fixed container
    height: 120,
    resizeMode: 'contain',
  },

folderText: { 

fontSize: 15, 

color: '#5A390E', // Darker brown for readability 

fontWeight: 'bold', 

}, 

plusContainer: { 

position: 'absolute', 

top: '55%', 

width: 40, 

height: 40, 

borderRadius: 8, 

borderWidth: 2, 

borderColor: '#D9C5A3', 

justifyContent: 'center', 

alignItems: 'center', 

zIndex: 20, 

}, 

}); 

 

export default FolderItem; 

 