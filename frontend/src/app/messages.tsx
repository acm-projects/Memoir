import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, FlatList, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import ImagePreview from '../components/ImagePreview';
import BottomNavbar from '../components/BottomNavbar';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarOptions } from '../components/avatarOptions';

const ios = Platform.OS === 'ios';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7a1a1a' // update color 
  },

  headerRow:
  {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 8, 
    paddingBottom: 14, 

  }, 
  title: {
    fontFamily: 'Calistoga',
    fontSize: 27,
    color: '#f5e8d8', // updated color
    letterSpacing: -0.5, 
    // updated: no shadows, and removed all other margins
    // because header row now takes care of that
    
  },
  headerSubtitle: {
    fontSize: 12, // unread column 
    color: '#c89a7a', 
    marginTop: 2 


  },
  composeButton: {        // new — "+" circle top right
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#557263',
  alignItems: 'center',
  justifyContent: 'center',
},
listArea: {               // new — cream tray with rounded top corners over crimson bg
  flex: 1,
  backgroundColor: '#f5e8d8',
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingTop: 20,
  paddingHorizontal: 14,
},
sectionLabel: {           // new — "RECENT" label above the list
  fontSize: 11,
  color: '#a07050',
  fontWeight: '500',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  marginBottom: 12,
  paddingHorizontal: 4,
},
  userCardUnread: {
  backgroundColor: '#fff8f0',          // was '#f5f0e8'
  borderRadius: 18,                    // was 8
  padding: 13,                         // was 18
  marginBottom: 9,                     // was 15
  flexDirection: 'row',                // moved from inline JSX
  alignItems: 'center',
  gap: 11,
  borderWidth: 0.5,                    // new
  borderColor: 'rgba(122,26,26,0.1)',
  // removed: marginHorizontal, all shadow props, elevation
},
userCardRead: {                        // new — transparent card for read rows
  backgroundColor: 'transparent',
  borderRadius: 18,
  padding: 13,
  marginBottom: 9,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 11,
  borderWidth: 0.5,
  borderColor: 'rgba(122,26,26,0.08)',
},
avatarWrapper: {   // new — needed so dot can be absolutely positioned on top
  position: 'relative',
  width: 48,
  height: 48,
},
avatarImg: {
  width: 48,        // was 40 inline
  height: 48,       // was 40 inline
  borderRadius: 24, // was 20 inline
  backgroundColor: '#d4b896',
  // removed: marginRight: 12, borderWidth: 2, borderColor: 'black'
},
avatarDot: {       // new — orange notification dot on unread avatars
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 13,
  height: 13,
  borderRadius: 6.5,
  backgroundColor: '#557263',
  borderWidth: 2,
  borderColor: '#fff8f0',
},
  userNameUnread: {
  fontSize: 15,      // was 16
  fontWeight: '500', // was '700'
  color: '#3a1010',  // new
  // removed: textAlign
},
userNameRead: {    // new — lighter for read rows
  fontSize: 15,
  fontWeight: '400',
  color: '#5a2a20',
},
timestamp: {       // new — did not exist before
  fontSize: 11,
  color: '#a07050',
},
timestampRead: {   // new
  fontSize: 11,
  color: '#b09070',
},
  userMessageUnread: {
  fontSize: 13,
  color: '#7a4030', // was '#666'
  // removed: textAlign, marginTop
},
userMessageRead: { // new — more muted for read rows
  fontSize: 13,
  color: '#a08070',
},
unreadBadge: {     // new — count bubble, did not exist before
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#557263',
  alignItems: 'center',
  justifyContent: 'center',
},
unreadBadgeText: { // new
  fontSize: 10,
  color: '#f5e8d8',
  fontWeight: '500',
},
  scrollView: {
    flex: 1,
  },
  cardTextArea: {    // new — flex container for name row + preview
  flex: 1,
},
cardTopRow: {      // new — name left, timestamp right
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 3,
},
  
  searchBox: {
    backgroundColor: 'rgba(245,232,216,0.14)', // transparent
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#c89a7a', // text color for search box
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 0,
  },
});

export default function Messages() {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here, e.g., filter users based on the query
  };

  const [users, setusers] = useState([
    { id: 1, name: 'Teju', lastMessage: 'memoir the best project', avatar: require('../../assets/images/origami-gorilla.png'), unread: 2, timestamp: '2m ago'  },
    { id: 2, name: 'Kasish', lastMessage: 'hi', avatar: require('../../assets/images/default-avatar.png'), unread: 100, timestamp: '2h ago'},
    { id: 3, name: 'Jiya', lastMessage: 'we will win first place!', avatar: require('../../assets/images/origami-fox.png'), unread: 67 , timestamp: '3h ago'},
    { id: 4, name: 'Harleen', lastMessage: 'wsp lol.', avatar: require('../../assets/images/origami-gorilla.png'), unread: 0, timestamp: '5h ago' },
    { id: 5, name: 'Tammy', lastMessage: 'Happy birthday unc', avatar: require('../../assets/images/default-avatar.png'), unread: 0, timestamp: '7d ago' },
  ]);

  const AVATAR_DATA = [
    { id: '1', image: require('../../assets/images/origami-gorilla.png') },
    { id: '2', image: require('../../assets/images/default-avatar.png') },
    { id: '3', image: require('../../assets/images/origami-fox.png') },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const openChatRoom = (user: any) => {
    router.push({ pathname: '/chatRoom', params: user });
  };


  return (
      <View style={[styles.container, { paddingTop: ios ? top : top + 10 }]}> 
            <View style={styles.headerRow}>  
        <View>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.headerSubtitle}>  
            {users.filter(u => u.unread > 0).length} 
          </Text>
        </View>
        <TouchableOpacity style={styles.composeButton}> 
          <Text style={{ color: '#f5e8d8', fontSize: 22, lineHeight: 24 }}>+</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Search messages"
        placeholderTextColor="#c89a7a" 
        clearButtonMode="always"
        style={styles.searchBox}
        value={searchQuery}
        onChangeText={(query: string) => handleSearch(query)}
      />
      <View style={styles.listArea}>
        <Text style={styles.sectionLabel}>Recent</Text>
        {users.length > 0 ? (
          <ScrollView style={styles.scrollView}showsVerticalScrollIndicator={false}>
            {filteredUsers.map(user => {
              const isUnread = user.unread > 0; 
              return(
                <TouchableOpacity onPress={() => openChatRoom(user)} key={user.id} style={isUnread ? styles.userCardUnread: styles.userCardRead}>
                        <View style={styles.avatarWrapper}>   
                        <Image source={user.avatar} style={styles.avatarImg} />
                        {isUnread && <View style={styles.avatarDot} />}  
                      </View>
                        <View style={styles.cardTextArea}>    
                        <View style={styles.cardTopRow}>    
                        <Text style={isUnread ? styles.userNameUnread : styles.userNameRead}>
                        {user.name}
                            </Text>
                            <Text style={isUnread ? styles.timestamp : styles.timestampRead}>
                              {user.timestamp}           
                            </Text>
                          </View>
                          <Text
                            style={isUnread ? styles.userMessageUnread : styles.userMessageRead}
                            numberOfLines={1}               // new — truncates long previews
                          >
                            {user.lastMessage}
                          </Text>
                        </View>
                        {isUnread && (                       // new — unread badge, did not exist before
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{user.unread}</Text>
                          </View>
                        )}
                </TouchableOpacity>
            );
})}
          </ScrollView>
        ) : (
          <Text>No messages yet</Text>
        )}

        <View style={styles.navbarContainer}>
          <BottomNavbar />
        </View>
      </View>
      </View> // closes list
  );
}