import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
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
import { Svg, Path, Circle, Line, Ellipse, G, Text as SvgText } from 'react-native-svg';

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
    console.log('partner raw:', partner); // ← add this

    if (partner) {
      // If partner.profiles is an array, use the first element; otherwise, use as object
      const profile = Array.isArray(partner.profiles) ? partner.profiles[0] : partner.profiles;
      setPartnerName(profile?.username ?? 'Unknown');
      setPartnerAvatar(profile?.avatar_url ?? null);
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

  //--Renders a mini preview of the card's items--
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

      <ImageBackground
        source={require('../../assets/images/layered-vintage-paper.png')}
        style={{ flex: 1 }}
      >
        {/* Background Illustrations Layer */}
        <View style={[StyleSheet.absoluteFillObject]} pointerEvents="none">
          {/* Compass Rose */}
          <Svg width="90" height="90" style={{ position: 'absolute', top: 10, left: 8 }} viewBox="0 0 90 90" fill="none">
            <G opacity={0.10}>
              <Circle cx="45" cy="45" r="44" stroke="#8B6A3E" strokeWidth="2" />
              <Path d="M45 10 L45 80" stroke="#8B6A3E" strokeWidth="2" />
              <Path d="M10 45 L80 45" stroke="#8B6A3E" strokeWidth="2" />
              <Path d="M45 45 L70 20 L45 45 L20 70 Z" stroke="#8B6A3E" strokeWidth="2" fill="none" />
              <Circle cx="45" cy="45" r="6" stroke="#8B6A3E" strokeWidth="2" fill="none" />
            </G>
          </Svg>
          {/* Sailing Ship */}
          <Svg width="90" height="70" style={{ position: 'absolute', top: 120, right: -5 }} viewBox="0 0 90 70" fill="none">
            <G opacity={0.10}>
              <Path d="M10 60 Q45 10 80 60 Z" stroke="#8B6A3E" strokeWidth="2" fill="none" />
              <Path d="M45 60 L45 20" stroke="#8B6A3E" strokeWidth="2" />
              <Path d="M45 20 L60 40 L45 40 Z" fill="#8B6A3E" fillOpacity="0.10" stroke="#8B6A3E" strokeWidth="1.5" />
              <Path d="M45 20 L30 35 L45 35 Z" fill="#8B6A3E" fillOpacity="0.10" stroke="#8B6A3E" strokeWidth="1.5" />
            </G>
          </Svg>
          {/* Dotted Travel Path with Crosshairs */}
          <Svg width="60" height="180" style={{ position: 'absolute', top: 250, left: 40 }} viewBox="0 0 60 180" fill="none">
            <G opacity={0.10}>
              <Path d="M30 10 Q10 60 30 110 Q50 160 30 170" stroke="#8B6A3E" strokeWidth="2" strokeDasharray="4 6" fill="none" />
              {/* Crosshair markers */}
              <G>
                <Circle cx="30" cy="10" r="5" stroke="#8B6A3E" strokeWidth="1.5" fill="none" />
                <Line x1="30" y1="5" x2="30" y2="15" stroke="#8B6A3E" strokeWidth="1" />
                <Line x1="25" y1="10" x2="35" y2="10" stroke="#8B6A3E" strokeWidth="1" />
              </G>
              <G>
                <Circle cx="30" cy="110" r="5" stroke="#8B6A3E" strokeWidth="1.5" fill="none" />
                <Line x1="30" y1="105" x2="30" y2="115" stroke="#8B6A3E" strokeWidth="1" />
                <Line x1="25" y1="110" x2="35" y2="110" stroke="#8B6A3E" strokeWidth="1" />
              </G>
              <G>
                <Circle cx="30" cy="170" r="5" stroke="#8B6A3E" strokeWidth="1.5" fill="none" />
                <Line x1="30" y1="165" x2="30" y2="175" stroke="#8B6A3E" strokeWidth="1" />
                <Line x1="25" y1="170" x2="35" y2="170" stroke="#8B6A3E" strokeWidth="1" />
              </G>
            </G>
          </Svg>
          {/* Coordinates Text */}
          <Svg width="120" height="30" style={{ position: 'absolute', top: 470, right: 12 }}>
            <SvgText
              x="100%"
              y="22"
              fontSize="18"
              fontWeight="bold"
              fill="#8B6A3E"
              opacity={0.11}
              textAnchor="end"
            >
              43°N · 12°E
            </SvgText>
          </Svg>
          {/* ATLAS Oval Frame with Scrollwork */}
          <Svg width="120" height="80" style={{ position: 'absolute', bottom: 90, left: 0 }} viewBox="0 0 120 80" fill="none">
            <G opacity={0.10}>
              <Ellipse cx="60" cy="40" rx="55" ry="32" stroke="#8B6A3E" strokeWidth="2" fill="none" />
              <Path d="M20 40 Q10 60 30 70" stroke="#8B6A3E" strokeWidth="1.5" fill="none" />
              <Path d="M100 40 Q110 60 90 70" stroke="#8B6A3E" strokeWidth="1.5" fill="none" />
              <SvgText x="60" y="48" fontSize="18" fontWeight="bold" fill="#8B6A3E" opacity="0.18" textAnchor="middle">ATLAS</SvgText>
            </G>
          </Svg>
          {/* Wave Border Dashed Path */}
          <Svg width="340" height="30" style={{ position: 'absolute', bottom: 60, left: 0 }} viewBox="0 0 340 30" fill="none">
            <G opacity={0.10}>
              <Path d="M0 15 Q40 0 80 15 T160 15 T240 15 T320 15" stroke="#8B6A3E" strokeWidth="2" fill="none" strokeDasharray="8 8" />
            </G>
          </Svg>
          {/* ~ est. 2026 ~ Text */}
          <Svg width="160" height="30" style={{ position: 'absolute', bottom: 38, left: 18 }}>
            <SvgText
              x="50%"
              y="22"
              fontSize="16"
              fontWeight="bold"
              fill="#8B6A3E"
              opacity={0.11}
              textAnchor="middle"
            >
              ~ est. 2026 ~
            </SvgText>
          </Svg>
          {/* Decorative Divider with Diamonds and Tick Marks */}
          <Svg width="180" height="18" style={{ position: 'absolute', bottom: 18, left: 10 }} viewBox="0 0 180 18" fill="none">
            <G opacity={0.10}>
              <Path d="M10 9 H170" stroke="#8B6A3E" strokeWidth="2" />
              <Path d="M90 3 L96 9 L90 15 L84 9 Z" fill="#8B6A3E" />
              <Line x1="30" y1="6" x2="30" y2="12" stroke="#8B6A3E" strokeWidth="1.5" />
              <Line x1="60" y1="6" x2="60" y2="12" stroke="#8B6A3E" strokeWidth="1.5" />
              <Line x1="120" y1="6" x2="120" y2="12" stroke="#8B6A3E" strokeWidth="1.5" />
              <Line x1="150" y1="6" x2="150" y2="12" stroke="#8B6A3E" strokeWidth="1.5" />
            </G>
          </Svg>
        </View>

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