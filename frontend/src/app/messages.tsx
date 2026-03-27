import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ios = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7a1a1a'
  },

  headerRow: {
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
    color: '#f5e8d8',
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#c89a7a',
    marginTop: 2
  },

  composeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#557263',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listArea: {
    flex: 1,
    backgroundColor: '#f5e8d8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 14,
  },

  sectionLabel: {
    fontSize: 11,
    color: '#a07050',
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  userCardUnread: {
    backgroundColor: '#fff8f0',
    borderRadius: 18,
    padding: 13,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(122,26,26,0.1)',
  },

  userCardRead: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 13,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(122,26,26,0.08)',
  },

  avatarWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
    marginRight: 11,
  },

  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d4b896',
  },

  avatarDot: {
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
    fontSize: 15,
    fontWeight: '500',
    color: '#3a1010',
  },

  userNameRead: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5a2a20',
  },

  timestamp: {
    fontSize: 11,
    color: '#a07050',
  },

  timestampRead: {
    fontSize: 11,
    color: '#b09070',
  },

  userMessageUnread: {
    fontSize: 13,
    color: '#7a4030',
  },

  userMessageRead: {
    fontSize: 13,
    color: '#a08070',
  },

  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#557263',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  unreadBadgeText: {
    fontSize: 10,
    color: '#f5e8d8',
    fontWeight: '500',
  },

  scrollView: {
    flex: 1,
  },

  cardTextArea: {
    flex: 1,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },

  searchBox: {
    backgroundColor: 'rgba(245,232,216,0.14)',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#c89a7a',
  },

  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default function Messages() {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const [users] = useState([
    { id: 1, name: 'Teju', lastMessage: 'memoir the best project', avatar: require('../../assets/images/origami-gorilla.png'), unread: 2, timestamp: '2m ago' },
    { id: 2, name: 'Kasish', lastMessage: 'hi', avatar: require('../../assets/images/default-avatar.png'), unread: 100, timestamp: '2h ago' },
    { id: 3, name: 'Jiya', lastMessage: 'we will win first place!', avatar: require('../../assets/images/origami-fox.png'), unread: 67, timestamp: '3h ago' },
    { id: 4, name: 'Harleen', lastMessage: 'wsp lol.', avatar: require('../../assets/images/origami-gorilla.png'), unread: 0, timestamp: '5h ago' },
    { id: 5, name: 'Tammy', lastMessage: 'Happy birthday unc', avatar: require('../../assets/images/default-avatar.png'), unread: 0, timestamp: '7d ago' },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={{ color: '#f5e8d8', fontSize: 22 }}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search messages"
        placeholderTextColor="#c89a7a"
        style={styles.searchBox}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.listArea}>
        <Text style={styles.sectionLabel}>Recent</Text>

        {users.length > 0 ? (
          <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
            {filteredUsers.map(user => {
              const isUnread = user.unread > 0;

              return (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => openChatRoom(user)}
                  style={isUnread ? styles.userCardUnread : styles.userCardRead}
                >
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
                      numberOfLines={1}
                    >
                      {user.lastMessage}
                    </Text>
                  </View>

                  {isUnread && (
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
    </View>
  );
}