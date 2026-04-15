import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../components/back-Button";
import BottomNavbar from "../components/BottomNavbar";
import CardSentAnimation from "../components/CardSentAnimation";
import { supabase } from "@/lib/supabase";
import { getContacts, Contact } from "@/services/messages.service";

const ios = Platform.OS === "ios";

// ← removed local Contact interface, using the imported one

export default function SendCard() {
  const { top } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const { cardColor, cardItems } = useLocalSearchParams<{
    cardColor?: string;
    cardItems?: string;
  }>();

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await getContacts(user.id);
    if (error) console.error('Error fetching contacts:', error);
    else if (data) setContacts(data);
    setLoading(false);
  }

  const handleSend = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = async () => {
  setShowAnimation(false);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const selected = contacts.find(c => c.id === selectedId);

  // 1. Save the card
  const { data: card, error: cardError } = await supabase
    .from("custom_cards")
    .insert({
      card_color: cardColor ?? "#fffaf4",
      card_items: cardItems ?? "[]",
    })
    .select()
    .single();

  if (cardError) { console.error("Failed to save card:", cardError); return; }

  // 2. Send the message
  const { error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: selectedId,
      sender_id: user.id,
      content: "Shared a card",
      shared_card_id: card.id,
    });

  if (msgError) { console.error("Failed to send message:", msgError); return; }

  router.push({
    pathname: "/chatRoom",
    params: {
      id: selectedId!,
      name: selected?.name ?? '',
      pendingCard: "true",
      pendingCardColor: cardColor ?? "#fffaf4",
      pendingCardItems: cardItems ?? "[]",
    },
  });
};

  return (
    <View style={[styles.container, { paddingTop: ios ? top : top + 10 }]}>
      {showAnimation && (
        <CardSentAnimation onComplete={handleAnimationComplete} />
      )}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <BackButton color="#f5e8d8" />
          <View style={styles.headerTitleGroup}>
            <Text style={styles.title}>Send Card</Text>
          </View>
        </View>
      </View>

      <View style={styles.listArea}>
        <Text style={styles.sectionLabel}>Contacts</Text>

        {loading ? (
          <ActivityIndicator size="small" color="#7a1a1a" style={{ marginTop: 40 }} />
        ) : contacts.length === 0 ? (
          <View style={{ padding: 30, alignItems: 'center' }}>
            <Text style={{ color: '#a07050', fontSize: 14 }}>No conversations yet</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}
          >
            {contacts.map((contact) => {
              const isSelected = selectedId === contact.id;
              return (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => setSelectedId(contact.id)}
                  style={isSelected ? styles.userCardSelected : styles.userCardRead}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatarWrapper}>
                    {contact.avatar ? (
                      <Image source={{ uri: contact.avatar }} style={styles.avatarImg} />
                    ) : (
                      <Image source={require("../../assets/images/default-avatar.png")} style={styles.avatarImg} />
                    )}
                    {isSelected && (
                      <View style={styles.selectedDot}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardTextArea}>
                    <Text style={isSelected ? styles.userNameSelected : styles.userNameRead}>
                      {contact.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {selectedId && !showAnimation && (
          <TouchableOpacity style={styles.floatingSendBtn} onPress={handleSend}>
            <Text style={styles.sendText}>Send Card</Text>
          </TouchableOpacity>
        )}

        <View style={styles.navbarContainer}>
          <BottomNavbar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7a1a1a",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 25,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerTitleGroup: {
    marginLeft: 5,
  },
  title: {
    fontFamily: "Calistoga",
    fontSize: 27,
    color: "#f5e8d8",
    letterSpacing: -0.5,
  },
  listArea: {
    flex: 1,
    backgroundColor: "#f5e8d8",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#a07050",
    fontWeight: "500",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  userCardRead: {
    backgroundColor: "transparent",
    borderRadius: 18,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(122,26,26,0.08)",
  },
  userCardSelected: {
    backgroundColor: "#fff8f0",
    borderRadius: 18,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#557263",
  },
  avatarWrapper: {
    position: "relative",
    width: 48,
    height: 48,
    marginRight: 15,
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#d4b896",
  },
  selectedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#557263",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f5e8d8",
  },
  checkMark: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardTextArea: {
    flex: 1,
  },
  userNameRead: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#5a2a20",
  },
  userNameSelected: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#3a1010",
  },
  floatingSendBtn: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#7a1a1a",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  sendText: {
    color: "#f5ede0",
    fontFamily: "Calistoga",
    fontSize: 18,
  },
  navbarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});