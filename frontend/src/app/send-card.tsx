import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../components/back-Button";
import BottomNavbar from "../components/BottomNavbar";
import CardSentAnimation from "../components/CardSentAnimation";

const ios = Platform.OS === "ios";

const CONTACTS = [
  { id: 1, name: "Teju", avatar: require("../../assets/images/origami-gorilla.png") },
  { id: 2, name: "Kasish", avatar: require("../../assets/images/default-avatar.png") },
  { id: 3, name: "Jiya", avatar: require("../../assets/images/origami-fox.png") },
  { id: 4, name: "Harleen", avatar: require("../../assets/images/origami-gorilla.png") },
  { id: 5, name: "Tammy", avatar: require("../../assets/images/default-avatar.png") },
];
// TODO: Replace mock data with real backend response
// TODO: Integrate with backend API here (endpoint: /contacts, method: GET)
// TODO: Integrate with backend API here (endpoint: /send-card, method: POST)
// TODO: Add backend integration logic (loading, error handling, response handling)

export default function SendCard() {
  const { top } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSend = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    router.push("/timelineScreen");
  };

  return (
    <View style={[styles.container, { paddingTop: ios ? top : top + 10 }]}>
      {showAnimation && (
        <CardSentAnimation onComplete={handleAnimationComplete} />
      )}
      {/* Header Area - Matching Messages Vibe */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <BackButton color="#f5e8d8" />
          <View style={styles.headerTitleGroup}>
            <Text style={styles.title}>Send Card</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area - The "Sheet" */}
      <View style={styles.listArea}>
        <Text style={styles.sectionLabel}>Contacts</Text>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          {CONTACTS.map((contact) => {
            const isSelected = selectedId === contact.id;
            return (
              <TouchableOpacity
                key={contact.id}
                onPress={() => setSelectedId(contact.id)}
                style={isSelected ? styles.userCardSelected : styles.userCardRead}
                activeOpacity={0.7}
              >
                <View style={styles.avatarWrapper}>
                  <Image source={contact.avatar} style={styles.avatarImg} />
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

        {/* Floating Send Button */}
        {selectedId && !showAnimation && (
          <TouchableOpacity
            style={styles.floatingSendBtn}
            onPress={handleSend}
          >
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
  headerSubtitle: {
    fontSize: 12,
    color: "#c89a7a",
    marginTop: 2,
    fontFamily: "Inter",
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
    borderColor: "#557263", // Green accent to show selection
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
    color: "#f5e8d8",
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