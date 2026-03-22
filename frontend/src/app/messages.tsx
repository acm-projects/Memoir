import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router, useRouter } from 'expo-router';
import ImagePreview from '../components/ImagePreview';
import BottomNavbar from '../components/BottomNavbar';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarOptions } from '../components/avatarOptions';

const ios = Platform.OS === 'ios';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#590502'
  },
  title: {
    fontFamily: 'Calistoga',
    fontSize: 35,
    color: '#f5f0e8',
    textAlign: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.57,
    shadowRadius: 4
  },
  userCard: {
  backgroundColor: '#f5f0e8',
  borderRadius: 8,
  padding: 18, // thickness 
  marginBottom: 15,
  marginHorizontal: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
userName: {
  fontSize: 16,
  textAlign: 'left',
  fontWeight: '700',
},
userMessage: {
  fontSize: 13,
  color: '#666',
  textAlign: 'left',
  marginTop: 4,
},
scrollView: {
  marginTop: 1,
}, 
 listContainer: {
        paddingHorizontal:20,
        paddingBottom: 0.001 * hp('100%'), // 25% of screen height for bottom padding
        marginTop: 30,
},
columnWrapper: {
  justifyContent: 'space-between', // Spreads the 3 items evenly
  marginBottom: 40, // Space between rows
  gap: 20,
},

searchBox: {
  backgroundColor: '#f5f0e8',
  borderRadius: 12,
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderWidth: 1,

}

});
export default function Messages() {
  const {top} = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState(''); // sets search query for search bar, implement search logic in handleSearch function
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here, e.g., filter users based on the query
  }
  
  const [users, setusers] = useState([ // fetch from backend in future
    { id: 1, name: 'Teju', lastMessage: 'memoir the best project', avatar: require('../../assets/images/origami-gorilla.png') },
    { id: 2, name: 'Kasish', lastMessage: 'hi', avatar: require('../../assets/images/default-avatar.png') },
    { id: 3, name: 'Jiya', lastMessage: 'we will win first place!', avatar: require('../../assets/images/origami-fox.png') },
    { id: 4, name: 'Harleen', lastMessage: 'wsp lol.', avatar: require('../../assets/images/origami-gorilla.png') },
    { id: 5, name: 'Tammy', lastMessage: 'Happy birthday unc', avatar: require('../../assets/images/default-avatar.png') },
  ]);
   const AVATAR_DATA = [
        {id:'1', image: require('../../assets/images/origami-gorilla.png')},
        {id:'2', image: require('../../assets/images/default-avatar.png')},
        {id:'3', image: require('../../assets/images/origami-fox.png')},

   ];
   const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
   const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
   const openChatRoom = (user: any) => {
    // Placeholder for navigation to chat room
    router.push({pathname:'/chatRoom', params: user});
  }
  return(
    <View style={[styles.container, {paddingTop: ios ? top : top+10}]}>
      <TextInput placeholder="Search" clearButtonMode="always" style={styles.searchBox}
      value={searchQuery} onChangeText={(query) => handleSearch(query)} />
      <Text style={styles.title}>Messages</Text>
      <FlatList
                data={AVATAR_DATA}
                renderItem={({ item }) => (
                  <AvatarOptions
                    imageSource={item.image}
                     isSelected={selectedAvatar === item.id}
                    onSelect={() => {}}
                  />
                )}
                
                keyExtractor={(item: { id: any; }) => item.id}
                numColumns={3}
                contentContainerStyle={styles.listContainer} 
                columnWrapperStyle={styles.columnWrapper} 
              />
      
      {
        users.length > 0 ? (
          <ScrollView style={styles.scrollView}>
            {filteredUsers.map(user => (
              <TouchableOpacity onPress={openChatRoom} key={user.id} style={styles.userCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={user.avatar} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, borderWidth: 2, borderColor: 'black'}}/>
                    <Text style={styles.userName}>{user.name}</Text>
                    </View>
                    <Text style={styles.userMessage}>{user.lastMessage}</Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text>No messages yet</Text>
        )
      }
    </View>
  )


}