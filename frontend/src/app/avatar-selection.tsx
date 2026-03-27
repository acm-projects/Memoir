import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Animated,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useState, useRef } from "react";
import { AvatarOptions } from "../components/avatarOptions";

const AVATAR_DATA = [
  { id: "1", image: require("../../assets/images/origami-gorilla.png") },
  { id: "2", image: require("../../assets/images/default-avatar.png") },
  { id: "3", image: require("../../assets/images/origami-fox.png") },
  { id: "4", image: require("../../assets/images/origami-purpleflower.png") },
  { id: "5", image: require("../../assets/images/origami-sunflower.png") },
  { id: "6", image: require("../../assets/images/origami-hyacinth.png") },
  { id: "7", image: require("../../assets/images/origami-windmill.png") },
  { id: "8", image: require("../../assets/images/origami-snack.png") },
  { id: "9", image: require("../../assets/images/origami-heart.png") },
];

export default function AvatarSelection() {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleSelectAvatar = (id: string) => setSelectedAvatarId(id);

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  return (
    <View style={styles.root}>

      {/* ── Top beige section with header ── */}
      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>Select an Avatar</Text>
      </View>

      {/* ── Green curved panel with background image ── */}
      <ImageBackground
        source={require("../../assets/images/swirly-subtle.png")}
        style={styles.greenPanelWrapper}
        resizeMode="cover"
      >
        <View style={styles.greenPanel}>
          <FlatList
            data={AVATAR_DATA}
            renderItem={({ item }) => (
              <AvatarOptions
                imageSource={item.image}
                onSelect={() => handleSelectAvatar(item.id)}
                isSelected={item.id === selectedAvatarId}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.buttonWrapper}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => router.push("/timelineScreen")}
                style={[
                  styles.continueButton,
                  !selectedAvatarId && styles.continueButtonDisabled,
                ]}
                disabled={!selectedAvatarId}
              >
                <Text style={styles.continueText}>Continue →</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EDE8D9",
  },

  // ── Top beige band ───────────────────────────────────────────────────
  topSection: {
    backgroundColor: "#EDE8D9",
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: "center",
    width: "100%",
  },

  headerTitle: {
    fontFamily: "Calistoga",
    fontSize: 42,
    color: "#5A390E",
    lineHeight: 46,
  },

  // ── Green curved panel ────────────────────────────────────────────────
  greenPanelWrapper: {
    flex: 1,
    marginTop: -40,
    backgroundColor: "#557263",
    borderRadius:32,
    overflow: "hidden",
  },

  greenPanel: {
    flex: 1,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 24,
  },

  // ── Grid ─────────────────────────────────────────────────────────────
  listContainer: {
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 16,
  },

  columnWrapper: {
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },

  // ── Button ───────────────────────────────────────────────────────────
  buttonWrapper: {
    alignItems: "center",
    marginBottom: 48,
    marginTop: 4,
  },

  continueButton: {
    backgroundColor: "#590502",
    borderRadius: 20,
    width: 220,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  continueButtonDisabled: {
    opacity: 0.45,
  },

  continueText: {
    fontFamily: "Calistoga",
    fontSize: 22,
    color: "#EDE8D9",
    letterSpacing: 0.5,
  },
});
