import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const ios = Platform.OS === 'ios';

export default function Messages() {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  
  //BACKEND: replace  array with actual data from backend API 
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
  //BACKEND: connect to the actual chat room screen for the selected user
  const openChatRoom = (user: any) => {
    router.push({ pathname: '/chatRoom', params: user });
  };

  const [areaWidth, setAreaWidth] = useState(0);
  const [areaHeight, setAreaHeight] = useState(0);

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.greenBase} />
        <ImageBackground
          source={require('../../assets/images/swirly-subtle.png')}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.swirlImage}
        />
      </View>

      <View style={styles.screenContent}>
        <View style={[styles.header, { paddingTop: ios ? top + 16 : top + 20 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <Text style={styles.headerTitle}>Messages</Text>
            <TouchableOpacity style={styles.composeButton}>
              <Ionicons name="add" size={22} color="#EDE8D9" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#EDE8D9" />
            <TextInput
              style={styles.searchInput}
              placeholder="   Search messages"
              placeholderTextColor="rgba(237,232,217,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        <ImageBackground
          source={require('../../assets/images/layered-vintage-paper.png')}
          style={styles.listArea}
          imageStyle={styles.paperImage}
        >
          <View
            style={styles.paperInner}
            onLayout={e => {
              setAreaWidth(e.nativeEvent.layout.width);
              setAreaHeight(e.nativeEvent.layout.height);
            }}
          >
            {areaWidth > 0 && areaHeight > 0 && (
              <Svg
                width={areaWidth}
                height={areaHeight}
                style={styles.dotOverlay}
              >
                {Array.from({ length: Math.ceil(areaWidth / 6) }).map((_, ix) =>
                  Array.from({ length: Math.ceil(areaHeight / 6) }).map((_, iy) => (
                    <Circle
                      key={`dot-${ix}-${iy}`}
                      cx={ix * 6}
                      cy={iy * 6}
                      r={0.6}
                      fill="#8B6A3E"
                      opacity={0.06}
                    />
                  ))
                )}
              </Svg>
            )}

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
                        <View style={styles.avatarStampBorder}>
                          <Image source={user.avatar} style={styles.avatarImg} /> {/*BACKEND: replace with actual avatar from backend */}
                        </View>
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
          </View>
        </ImageBackground>
      </View>

      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7a1a1a',
  },

  greenBase: {
    flex: 1,
    backgroundColor: '#7a1a1a',
  },

  swirlImage: {
    resizeMode: 'cover',
    opacity: 0.15,
  },

  screenContent: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerSpacer: {
    width: 36,
  },

  headerTitle: {
    flex: 1,
    marginLeft: -5,
    fontSize: 28,
    fontWeight: '700',
    color: '#EDE8D9',
    textAlign: 'center',
    fontFamily: 'Calistoga',
  },

  composeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBar: {
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#EDE8D9',
  },

  listArea: {
  flex: 1,
  borderTopLeftRadius: 32,
  borderTopRightRadius: 32,
  overflow: 'hidden',
  marginTop: 6,
},

  paperImage: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  paperInner: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 14,
    position: 'relative',
  },

  dotOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
    pointerEvents: 'none',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarStampBorder: {
    borderWidth: 2,
    borderColor: '#C8B89A',
    borderStyle: 'dashed',
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 999,
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

  cardTextArea: {
    flex: 1,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
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

  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});