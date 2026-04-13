import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
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
import {
  getConversationPartner,
  getMessages,
  sendMessage,
  sendCardMessage,          // ← new
  markConversationAsRead,
} from '@/services/messages.service';
import { pinCustomCard } from '@/services/bulletin-board.services';

interface Message {
  id: string;
  text: string;
  sent: boolean;
  type: "text" | "card";
  cardColor?: string;
  cardItems?: string;
  cardId?: string;
}

export default function ChatRoom() {
  const { id, pendingCard, pendingCardColor, pendingCardItems } = useLocalSearchParams<{
    id: string;
    pendingCard?: string;
    pendingCardColor?: string;
    pendingCardItems?: string;
  }>();

  const router = useRouter();
  const [messages, setMessages]           = useState<Message[]>([]);
  const [inputText, setInputText]         = useState('');
  const [loading, setLoading]             = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [partnerName, setPartnerName]     = useState('');
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [pinConfirmTarget, setPinConfirmTarget] = useState<Message | null>(null); // ← new
  const cardSentRef    = useRef(false);
  const scrollViewRef  = useRef<ScrollView | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    if (pendingCard === "true" && currentUserId && !cardSentRef.current) {
      cardSentRef.current = true;
      handleSendCardMessage();
    }
  }, [currentUserId]);

  useEffect(() => {
    const channel = supabase
      .channel(`chatroom-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}` },
        () => { fetchMessages(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setCurrentUserId(user.id);

    const { data: partner } = await getConversationPartner(id, user.id);
    if (partner) {
      setPartnerName(partner.profiles?.username ?? 'Unknown');
      setPartnerAvatar(partner.profiles?.avatar_url ?? null);
    }

    const { data, error } = await getMessages(id);
    if (error) { console.error('Error fetching messages:', error); setLoading(false); return; }

    await markConversationAsRead(id, user.id);

    if (data) {
      const mapped: Message[] = data.map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sent: msg.sender_id === user.id,
        type: msg.shared_card_id ? "card" : "text",
        cardColor: msg.custom_cards?.card_color ?? undefined,
        cardItems: msg.custom_cards?.card_items ?? undefined,
        cardId: msg.shared_card_id ?? undefined,
      }));
      setMessages(mapped);
    }

    setLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
  }

  const handleSendCardMessage = async () => {
    if (!currentUserId || !pendingCardColor) return;
    const { error } = await sendCardMessage(id, currentUserId, pendingCardColor, pendingCardItems ?? "[]");
    if (error) console.error("Error sending card message:", error);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    const { error } = await sendMessage(id, currentUserId, inputText);
    if (error) { console.error('Error sending message:', error); return; }
    setInputText('');
  };

  const handlePinToBoard = async () => {
    if (!pinConfirmTarget?.cardId) return;
    setPinConfirmTarget(null);
    try {
      await pinCustomCard(pinConfirmTarget.cardId);
      router.push({ pathname: "/bulletin-board" });
    } catch (e) {
      console.error('Error pinning card to board:', e);
    }
  };

  // Renders a mini preview of the card's items
  const renderCardPreview = (cardItems: string, cardColor: string) => {
    try {
      const items: string[] = JSON.parse(cardItems);
      return (
        <View style={{ backgroundColor: cardColor, borderRadius: 10, padding: 10, minWidth: 160, minHeight: 90 }}>
          {items.slice(0, 3).map((item, i) => (
            <Text key={i} style={{ color: '#5a2a20', fontSize: 12, marginBottom: 2 }}>• {item}</Text>
          ))}
          {items.length > 3 && (
            <Text style={{ color: '#a07050', fontSize: 11 }}>+{items.length - 3} more…</Text>
          )}
        </View>
      );
    } catch {
      return <View style={{ backgroundColor: cardColor, borderRadius: 10, width: 160, height: 90 }} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#7a1a1a' }}>
      <StatusBar barStyle="light-content" />
      <ChatRoomHeader name={partnerName} avatar={partnerAvatar} router={router} />

      <ImageBackground source={require('../../assets/images/layered-vintage-paper.png')} style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="small" color="#7a1a1a" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView ref={scrollViewRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
            {messages.map(message => {
              if (message.type === "card") {
                return (
                  <View
                    key={message.id}
                    style={{ alignSelf: message.sent ? 'flex-end' : 'flex-start', marginBottom: 8, maxWidth: '75%' }}
                  >
                    <View style={{
                      backgroundColor: '#fffaf4',
                      borderRadius: 16,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "rgba(122,26,26,0.15)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 4,
                    }}>
                      <Text style={{ fontSize: 11, color: "#a07050", marginBottom: 6 }}>
                        🎴 Card from {message.sent ? "you" : partnerName}
                      </Text>

                      {/* Mini card preview */}
                      {message.cardColor && message.cardItems
                        ? renderCardPreview(message.cardItems, message.cardColor)
                        : <View style={{ backgroundColor: message.cardColor ?? '#e8d5b7', borderRadius: 10, width: 160, height: 90 }} />
                      }

                      {/* + pin button — only shown to recipient */}
                      {!message.sent && (
                        <TouchableOpacity
                          onPress={() => setPinConfirmTarget(message)}
                          style={{
                            marginTop: 10,
                            alignSelf: "flex-end",
                            backgroundColor: "#557263",
                            borderRadius: 20,
                            paddingHorizontal: 12,
                            paddingVertical: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Feather name="plus" size={14} color="#fff" />
                          <Text style={{ color: "#fff", fontSize: 12, fontFamily: "Inter" }}>Add to board</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              }

              // Plain text bubble
              return (
                <View
                  key={message.id}
                  style={{ alignSelf: message.sent ? 'flex-end' : 'flex-start', marginBottom: 8, maxWidth: '75%' }}
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
              );
            })}
          </ScrollView>
        )}

        {/* Input bar */}
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
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{ backgroundColor: '#F5EEE1', borderRadius: 20, padding: 10 }}
          >
            <Feather name="send" size={20} color="#590502" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* ── Pin confirmation modal ── */}
      <Modal transparent animationType="fade" visible={!!pinConfirmTarget} onRequestClose={() => setPinConfirmTarget(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            backgroundColor: '#fffaf4',
            borderRadius: 20,
            padding: 28,
            width: '78%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}>
            <Text style={{ fontSize: 22 }}>📌</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#5a2a20', marginTop: 10, textAlign: 'center' }}>
              Add to bulletin board?
            </Text>
            <Text style={{ fontSize: 13, color: '#a07050', marginTop: 6, textAlign: 'center' }}>
              This card will be pinned to your board.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 22 }}>
              <TouchableOpacity
                onPress={() => setPinConfirmTarget(null)}
                style={{ flex: 1, borderRadius: 14, borderWidth: 1, borderColor: '#c9a98a', paddingVertical: 10, alignItems: 'center' }}
              >
                <Text style={{ color: '#7a4a30', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePinToBoard}
                style={{ flex: 1, borderRadius: 14, backgroundColor: '#557263', paddingVertical: 10, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}