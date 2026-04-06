import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,                            // FIX: was imported from 'react-native-svg', now from 'react-native'
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatRoomHeader from "../components/ChatRoomHeader";
import { supabase } from '@/lib/supabase';
import { getConversationPartner, getMessages, sendMessage } from '@/services/messages.service';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  text: string;
  sent: boolean; // true = current user sent it → renders right side dark red
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatRoom() {
  // CHANGED: was grabbing 'item' (whole user object), now just 'id' (conversation_id)
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]); // CHANGED: was MOCK_MESSAGES
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);           // ADDED
  const [currentUserId, setCurrentUserId] = useState('');  // ADDED

  // ADDED: other person's profile, fetched from conversation_participants + profiles
  const [partnerName, setPartnerName] = useState('');
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView | null>(null);

  // ── Fetch messages + partner profile on mount ────────────────────────────────
  // ADDED: was missing entirely, messages were just hardcoded mock data
  useEffect(() => {
    fetchMessages();
  }, []);

  // ── Real-time subscription — new messages appear instantly ───────────────────
  // ADDED: without this, you'd have to manually refresh to see new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chatroom-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`, // scoped to only this conversation
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); }; // cleanup on unmount
  }, []);

  // ── Fetch messages for this conversation ─────────────────────────────────────
  // ADDED: replaces MOCK_MESSAGES with real data from Supabase
  async function fetchMessages() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setCurrentUserId(user.id);

    // get the other person's profile from conversation_participants
    const { data: partner } = await getConversationPartner(id, user.id);
    if (partner) {
      setPartnerName(partner.profiles?.username ?? 'Unknown'); // BACKEND: adjust if column name differs
      setPartnerAvatar(partner.profiles?.avatar_url ?? null);  // BACKEND: adjust if column name differs
    }

    // fetch all messages oldest → newest
    const { data, error } = await getMessages(id);
    if (error) { console.error('Error fetching messages:', error); setLoading(false); return; }

    if (data) {
      const mapped: Message[] = data.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sent: msg.sender_id === user.id, // true → right dark red, false → left cream
      }));
      setMessages(mapped);
    }

    setLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
  }

  // ── Send a message ────────────────────────────────────────────────────────────
  // CHANGED: was only updating local state, now inserts into Supabase
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const { error } = await sendMessage(id, currentUserId, inputText);
    if (error) { console.error('Error sending message:', error); return; }

    setInputText('');
    // no manual state update needed — real-time subscription re-fetches automatically
  };
  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#7a1a1a' }}>
      <StatusBar barStyle="light-content" />

      {/* CHANGED: was passing 'user={item}' from nav params, now passes real fetched profile */}
      <ChatRoomHeader
        name={partnerName}
        avatar={partnerAvatar}
        router={router}
      />

      <ImageBackground
        source={require('../../assets/images/layered-vintage-paper.png')}
        style={{ flex: 1 }}
      >
        {/* ADDED: loading spinner while fetching */}
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#7a1a1a"
            style={{ marginTop: 40 }}
          />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 10 }}
          >
            {messages.map(message => (
              <View
                key={message.id}
                style={{
                  alignSelf: message.sent ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                  maxWidth: '75%',
                }}
              >
                <View style={{
                  backgroundColor: message.sent ? '#7a1a1a' : '#fff8f0',
                  borderRadius: 12,
                  padding: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                }}>
                  <Text style={{ color: message.sent ? '#F5EEE1' : 'black', fontSize: hp(1.8) }}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* ── Input bar ── */}
        <View style={{
          flexDirection: 'row',
          marginHorizontal: 10,
          marginBottom: 20,
          backgroundColor: '#7a1a1a',
          borderRadius: 20,
          paddingHorizontal: 15,
          paddingVertical: 10,
          gap: 10,
        }}>
          <TextInput
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="white"
            style={{ color: '#f5e8d8', fontSize: 16, flex: 1, marginRight: 2 }}
          />
          {/* CHANGED: now calls handleSendMessage() instead of old local sendMessage() */}
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{ backgroundColor: '#F5EEE1', borderRadius: 20, padding: 10 }}
          >
            <Feather name="send" size={20} color="#590502" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}