import { View, Text, Pressable, FlatList, StyleSheet, ImageBackground,  Image, TouchableOpacity, } from "react-native"; // importing components from react native
import { router } from "expo-router"; // importing router from expo-router
import { useState, useEffect } from 'react'; // importing useState from react for state management
import { supabase } from "../lib/supabase"; // importing supabase client for database interactions
import { AvatarOptions } from '../components/avatarOptions'; // importing AvatarOptions component for rendering avatar options
import { RedButton } from '../components/redButton'; // importing RedButton component, which is likely a styled button component used in the avatar selection screen for user interactions.

export default function AvatarSelection() {
  const [avatars, setAvatars] = useState<{ id: string; name: string; image_url: string }[]>([]); // State to hold the list of avatars fetched from the database
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null); // State to hold the URL of the currently selected avatar
  const [loading, setLoading] = useState(false); // State to indicate whether the avatars are still being loaded from the database

  // Fetch avatars from the database when the component mounts
  useEffect(() => {
    fetchAvatars();
  }, []);

  // Function to fetch avatars from the database
  async function fetchAvatars() {
    const { data, error } = await supabase.from('avatars').select('id, name, image_url'); // Query the 'avatars' table to get the id, name, and image_url of each avatar
    if(error) {
      console.error('Failed to fetch avatars:', error); // Log any errors that occur during the fetch
      return;
    }
    if(data) { setAvatars(data); } // If data is successfully fetched, update the avatars state with the fetched data
  }

  async function handleContinue() {
    if(!selectedAvatarUrl) {
      alert('Please select an avatar before continuing.'); // Alert the user if they try to continue without selecting an avatar
      return;
    }

    setLoading(true); // Set loading state to true while we update the user's profile with the selected avatar

    const { data: { user } } = await supabase.auth.getUser(); // Get the currently authenticated user

    if(!user) {
      setLoading(false); // Set loading to false if there is no authenticated user
      return;
    }

    const { error } = await supabase.from('profiles').update({ avatar_url: selectedAvatarUrl }).eq('id', user.id); // Update the user's profile in the 'profiles' table with the selected avatar URL

    if(error) {
      console.error('Failed to update avatar:', error); // Log any errors that occur during the update
    }

    setLoading(false); // Set loading to false after the update is complete
    router.push('/timelineScreen'); // Navigate to the timeline screen after successfully updating the avatar
  }

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
          data={avatars}
          renderItem={({ item }) => (
            <AvatarOptions
              imageSource={{ uri: item.image_url }}
              onSelect={() => setSelectedAvatarUrl(item.image_url)}
              isSelected={item.image_url === selectedAvatarUrl} 
            />
          )}
        
          keyExtractor={(item: { id: any; }) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContainer} 
          columnWrapperStyle={styles.columnWrapper} 
        />

        <TouchableOpacity onPress={handleContinue} style={styles.continueButton} activeOpacity={0.7} disabled={loading}>
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
});
