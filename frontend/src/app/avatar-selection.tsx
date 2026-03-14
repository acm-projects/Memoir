import { View, Text, Pressable,FlatList, StyleSheet, ImageBackground,  Image, TouchableOpacity, } from "react-native";
import { router } from "expo-router";
import {useState} from 'react';
import { AvatarOptions } from '../components/avatarOptions';
import { RedButton } from '../components/redButton';


      const AVATAR_DATA = [
        {id:'1', image: require('../../assets/images/origami-gorilla.png')},
        {id:'2', image: require('../../assets/images/default-avatar.png')},
        {id:'3', image: require('../../assets/images/origami-fox.png')},

        {id:'4', image: require('../../assets/images/origami-purpleflower.png')},
        {id:'5', image: require('../../assets/images/origami-sunflower.png')},
        {id:'6', image: require('../../assets/images/origami-hyacinth.png')},

        {id:'7', image: require('../../assets/images/origami-windmill.png')},
        {id:'8', image: require('../../assets/images/origami-snack.png')},
        {id:'9', image: require('../../assets/images/origami-heart.png')},
      ];


      export default function AvatarSelection() {
        const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

        const handleSelectAvatar = (id: string) => {
          setSelectedAvatarId(id); // Update our state
          console.log(`Avatar ${id} selected!`);
        };
      


      return(
        
        <View style = {styles.container}>
          <ImageBackground 
            source={require('../../assets/images/swirls.jpg')} 
            imageStyle={{ opacity: 0.2 }} 
  >
          <View style={styles.headerContainer}>
            <ImageBackground
              source={require('../../assets/images/header-paper.png')}
              style={styles.paperHeader}
              resizeMode="stretch" 
              >
          <Text style={styles.avatarText}>Select an Avatar</Text>
            </ImageBackground>
          </View>

        <FlatList
          data={AVATAR_DATA}
          renderItem={({ item }) => (
            <AvatarOptions
              imageSource={item.image}
              onSelect={() => handleSelectAvatar(item.id)}
              isSelected={item.id === selectedAvatarId} 
            />
          )}
          

          keyExtractor={(item: { id: any; }) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContainer} 
          columnWrapperStyle={styles.columnWrapper} 
        />


        <TouchableOpacity onPress = {() => {router.push('/timelineScreen')}} style= {styles.continueButton}activeOpacity={0.7}>
         <Text style ={styles.continue}> Continue</Text>
        </TouchableOpacity>
        </ImageBackground>
        </View>
       
      



      
      
      );
    }










const styles = StyleSheet.create({
    container:{
       flex: 1,
        backgroundColor: "#557263",
        alignItems: 'center',
        justifyContent: 'flex-start',
      },

      headerContainer:{
        width: '100%',
        marginRight:200,
        marginBottom: 50,
        
      },

      paperHeader:{
        width: '120%',
        height: 120,
        marginTop:70,
        
      },

      avatarText:{
        width: '100%',
        fontFamily: 'Montaga',
        fontSize: 40,
        color:"#5A390E",
        textAlign: 'center',
        marginTop: 40,
        marginLeft:200,
      },

      listContainer: {
        paddingHorizontal:180,
        paddingBottom: 40,
      },
      columnWrapper: {
        justifyContent: 'space-between', // Spreads the 3 items evenly
        marginBottom: 40, // Space between rows
        gap: 20,
      },

      continueButton:{
        backgroundColor:'#590502',
        borderRadius: 20,
        width: 200,
        height: '5%',
        alignSelf:'center',
        marginBottom: 150,
        marginTop: 20,
      },

      continue:{
        fontFamily:'Inter',
        fontSize: 20,
        color: '#E8DCDC',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
        marginRight: 5,
     
      }


    })