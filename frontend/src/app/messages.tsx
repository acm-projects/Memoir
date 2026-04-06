import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';                                               // FIX: use @/ alias, matching your folder screen pattern
import { getConversations, markConversationAsRead, ConversationUser} from '@/services/messages.service'; // FIX: make sure this service file exists (see below)

const ios = Platform.OS === 'ios';

// ─── Types ────────────────────────────────────────────────────────────────────


// ─── Helpers ──────────────────────────────────────────────────────────────────

// Converts an ISO timestamp into a human-readable relative string (e.g. "2m ago")
function formatTimestamp(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Messages() {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<ConversationUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [areaWidth, setAreaWidth] = useState(0);
  const [areaHeight, setAreaHeight] = useState(0);

  // ── Fetch on mount (same pattern as fetchFolders in viewFolder) ─────────────
  useEffect(() => {
    fetchConversations();
  }, []);

  // ── Real-time subscription — re-fetches when any new message is inserted ────
  useEffect(() => {
    const channel = supabase
      .channel('messages-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          fetchConversations(); // just re-fetch, same as folder screen pattern
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); }; // cleanup on unmount
  }, []);

  // ── Main fetch function ──────────────────────────────────────────────────────
  async function fetchConversations() {
    setLoading(true);

    // BACKEND: get the currently logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    setCurrentUserId(user.id);

    // BACKEND: calls getConversations() from messages.service.ts
    // Returns the latest message per conversation_id, joined with sender profile
    const { data, error } = await getConversations(user.id);

    if (error) {
      console.error('Error fetching conversations:', error);
    } else if (data) {

      // Map raw Supabase rows into the shape the UI expects
      // FIX: type msg explicitly to avoid implicit 'any' error
      const mapped: ConversationUser[] = data.map((msg: any) => ({
        id: msg.conversation_id,
        name: msg.profiles?.username ?? 'Unknown', // BACKEND: adjust field name to match your profiles table
        avatar: msg.profiles?.avatar_url
          ? { uri: msg.profiles.avatar_url }
          : require('../../assets/images/default-avatar.png'), // fallback avatar
        lastMessage: msg.content,
        unread: msg.unread ?? 0,
        timestamp: formatTimestamp(msg.created_at),
      }));
      setUsers(mapped);
    }

    setLoading(false);
  }

  // ── Mark conversation as read + navigate to chat room ───────────────────────
  // BACKEND: calls markConversationAsRead() from messages.service.ts
  const openChatRoom = async (user: ConversationUser) => {
    await markConversationAsRead(user.id, currentUserId);
    // FIX: expo-router params must be a plain string-keyed object, not a typed interface
    router.push({
      pathname: '/chatRoom',
      params: { // PASS these to chat room
        id: user.id,
        name: user.name,
        lastMessage: user.lastMessage,
        unread: String(user.unread), // unread is a number so we made it a string
        timestamp: user.timestamp,
      },
    });
  };

  // FIX: filter over the 'users' state array (useState above), type the param explicitly
  const filteredUsers = users.filter((user: ConversationUser) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.greenBase} />
        <ImageBackground
          source={require('../../assets/images/swirly-subtle.png')}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.swirlImage}
        />
      </View>

      <View style={styles.screenContent}>

        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: ios ? top + 16 : top + 20 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <Text style={styles.headerTitle}>Messages</Text>
            <TouchableOpacity style={styles.composeButton}>
              <Ionicons name="add" size={22} color="#EDE8D9" />
            </TouchableOpacity>
          </View>

          {/* Search bar — connected to state so typing actually filters */}
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
            {/* Clear button — only shows when user has typed something */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="rgba(237,232,217,0.6)" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── List Area (paper background) ── */}
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
            {/* Dot overlay texture */}
            {areaWidth > 0 && areaHeight > 0 && (
              <Svg width={areaWidth} height={areaHeight} style={styles.dotOverlay}>
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

            {/* ── Loading state ── */}
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#7a1a1a"
                style={{ marginTop: 40 }}
              />

            /* ── Empty state ── */
            ) : filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 0 ? 'No results found' : 'No messages yet'}
                </Text>
              </View>

            /* ── Conversation list ── */
            ) : (
              <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
                {filteredUsers.map(user => {
                  const isUnread = user.unread > 0;
                  return (
                    <TouchableOpacity
                      key={user.id}
                      onPress={() => openChatRoom(user)}
                      style={isUnread ? styles.userCardUnread : styles.userCardRead}
                    >
                      {/* Avatar with online dot if unread */}
                      <View style={styles.avatarWrapper}>
                        <View style={styles.avatarStampBorder}>
                          {/* BACKEND: avatar_url from profiles table, falls back to default */}
                          <Image source={user.avatar} style={styles.avatarImg} />
                        </View>
                        {isUnread && <View style={styles.avatarDot} />}
                      </View>

                      {/* Name + last message */}
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

                      {/* Unread badge */}
                      {isUnread && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>{user.unread}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </ImageBackground>
      </View>

      {/* Bottom nav */}
      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  emptyState: {
    padding: 30,
    alignItems: 'center',
    marginTop: 40,
  },

  emptyStateText: {
    color: '#a07050',
    fontFamily: 'Inter',
    fontSize: 14,
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