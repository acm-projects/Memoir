import React, { useState } from "react";
import {
  View, Text, StyleSheet, ImageBackground,
  ScrollView, TouchableOpacity, Image
} from "react-native";
import { router } from "expo-router";
import BackButton from "../components/back-Button";
import BottomNavbar from "../components/BottomNavbar";

const CONTACTS = [
    { id: 1, name: 'Teju', lastMessage: 'memoir the best project', avatar: require('../../assets/images/origami-gorilla.png') },
    { id: 2, name: 'Kasish', lastMessage: 'hi', avatar: require('../../assets/images/default-avatar.png') },
    { id: 3, name: 'Jiya', lastMessage: 'we will win first place!', avatar: require('../../assets/images/origami-fox.png') },
    { id: 4, name: 'Harleen', lastMessage: 'wsp lol.', avatar: require('../../assets/images/origami-gorilla.png') },
    { id: 5, name: 'Tammy', lastMessage: 'Happy birthday unc', avatar: require('../../assets/images/default-avatar.png') },
];

export default function SendCard() {
const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/swirly-subtle.png")}
        style={styles.background}
        imageStyle={{ width: "100%", height: "100%" }}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <BackButton color="#557263" />
          <Text style={styles.headerText}>Send Card</Text>
          <Text style={styles.subText}>Choose who to send this to</Text>
        </View>

        {/* Contacts List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {CONTACTS.map((contact) => {
            const isSelected = selectedId === contact.id;
            return (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactRow, isSelected && styles.contactRowSelected]}
                onPress={() => setSelectedId(contact.id)}
                activeOpacity={0.8}
              >
                <Image source={contact.avatar} style={styles.avatar} />
                <Text style={styles.contactName}>{contact.name}</Text>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Send Button */}
        {selectedId && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => router.push("/timelineScreen")}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  headerCard: {
    backgroundColor: "#F8E5CF",
    borderRadius: 18,
    marginHorizontal: 12,
    marginTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  headerText: {
    fontFamily: "Calistoga",
    fontSize: 32,
    color: "#5A390E",
    textAlign: "center",
    paddingTop: 5,
  },
  subText: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#8a6a3e",
    textAlign: "center",
    marginTop: 4,
  },
  scroll: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8E5CF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  contactRowSelected: {
    borderColor: "#6D1B12",
    backgroundColor: "#fdf3e3",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  contactName: {
    flex: 1,
    fontFamily: "Calistoga",
    fontSize: 18,
    color: "#5A390E",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6D1B12",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#F8E5CF",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
  },
  sendBtn: {
    backgroundColor: "#6D1B12",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  sendText: {
    color: "#F8E5CF",
    fontFamily: "Calistoga",
    fontSize: 18,
  },
});