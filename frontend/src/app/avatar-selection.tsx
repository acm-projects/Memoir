import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock avatar data - replace with real backend response
const AVATAR_DATA = [
  {
    id: "1",
    name: "Little Bear",
    image: require("../../assets/images/origami-gorilla.png"),
    color: "#A62D00",
    tint: "#E8B8A6",
  },
  {
    id: "2",
    name: "Llama",
    image: require("../../assets/images/default-avatar.png"),
    color: "#7B5A9A",
    tint: "#DDD0EA",
  },
  {
    id: "3",
    name: "Clever Fox",
    image: require("../../assets/images/origami-fox.png"),
    color: "#6D8A7A",
    tint: "#D6E2DB",
  },
  {
    id: "4",
    name: "Purple Flower",
    image: require("../../assets/images/origami-purpleflower.png"),
    color: "#B32046",
    tint: "#F0C7D2",
  },
  {
    id: "5",
    name: "Sunflower",
    image: require("../../assets/images/origami-sunflower.png"),
    color: "#5F84A2",
    tint: "#D5E2EC",
  },
  {
    id: "6",
    name: "Hyacinth",
    image: require("../../assets/images/origami-hyacinth.png"),
    color: "#8B6A3E",
    tint: "#E6D8C2",
  },
  {
    id: "7",
    name: "Pinwheel",
    image: require("../../assets/images/origami-windmill.png"),
    color: "#4A6741",
    tint: "#D6E3D2",
  },
  {
    id: "8",
    name: "Dango",
    image: require("../../assets/images/origami-snack.png"),
    color: "#6B4F6B",
    tint: "#E1D6E1",
  },
  {
    id: "9",
    name: "Paper Heart",
    image: require("../../assets/images/origami-heart.png"),
    color: "#7B1D1D",
    tint: "#EBCFCF",
  },
];
// TODO: Replace mock data with real backend response
export default function AvatarSelection() {
  const { top } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedAvatar = AVATAR_DATA.find((avatar) => avatar.id === selectedId);

  const renderAvatar = ({ item }: { item: typeof AVATAR_DATA[0] }) => {
    const isSelected = item.id === selectedId;

    return (
      <Pressable
        onPress={() => setSelectedId(item.id)}
        style={styles.avatarContainer}
      >
        <View
          style={[
            styles.outerCircle,
            { backgroundColor: item.color },
            isSelected && styles.outerCircleSelected,
          ]}
        >
          <View style={styles.stitchShadow}>
            <View style={styles.dashedRing}>
              <View
                style={[
                  styles.innerCircle,
                  { backgroundColor: item.tint },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.headerArea, { paddingTop: top + 20 }]}>
        <Text style={styles.headerTitle}>Choose your Avatar</Text>
      </View>

      <ImageBackground
        source={require("../../assets/images/layered-vintage-paper.png")}
        style={styles.sheetArea}
        imageStyle={styles.paperImageStyle}
      >
        <FlatList
          data={AVATAR_DATA}
          renderItem={renderAvatar}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 40 }}
        />

        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={() => selectedId && router.push("/timelineScreen")}
            style={[
              styles.loginButton,
              selectedAvatar && { backgroundColor: selectedAvatar.color },
              !selectedId && styles.loginButtonDisabled,
            ]}
            disabled={!selectedId}
          >
            <Text style={styles.loginText}>Continue</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#557263",
  },
  headerArea: {
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: "Calistoga",
    fontSize: 36,
    color: "#EDE8D9",
    textAlign: "center",
  },
  sheetArea: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  paperImageStyle: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 28,
  },
  avatarContainer: {
    width: "30%",
    alignItems: "center",
  },
  outerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    padding:.5,
  },
  stitchShadow: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  dashedRing: {
    width: "100%",
    height: "100%",
    borderRadius: 42,
    borderWidth: 1.5,
    borderColor: "#F3EBDD",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  innerCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  outerCircleSelected: {
    transform: [{ scale: 1.06 }],
  },
  avatarImage: {
    width: 50,
    height: 50,
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  loginButton: {
    borderRadius: 20,
    width: "60%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 130,
  },
  loginButtonDisabled: {
    opacity: 0.45,
    backgroundColor: "#6D1B12",
  },
  loginText: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#E8DCDC",
    textAlign: "center",
    fontWeight: "bold",
  },
});
// TODO: Integrate with backend API here (endpoint: /avatar, method: GET/POST)
// TODO: Add backend integration logic (loading, error handling, response handling)
// TODO: Connect to authentication/user session backend