import React, { useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, 
  Pressable, Image, Platform, ImageBackground 
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
{ id: "6", name: "Hyacinth", image: require("../../assets/images/origami-hyacinth.png"), color: "#8B6A3E", tint: "#E6D8C2" },
{ id: "7", name: "Pinwheel", image: require("../../assets/images/origami-windmill.png"), color: "#4A6741", tint: "#D6E3D2" },
{ id: "8", name: "Dango", image: require("../../assets/images/origami-snack.png"), color: "#6B4F6B", tint: "#E1D6E1" },
{ id: "9", name: "Paper Heart", image: require("../../assets/images/origami-heart.png"), color: "#7B1D1D", tint: "#EBCFCF" },
];

export default function AvatarSelection() {
  const { top } = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    </Pressable>
  );
};
  return (
    <View style={styles.root}>
      {/* Muted Green Header Area */}
      <View style={[styles.headerArea, { paddingTop: top + 20 }]}>
        <Text style={styles.headerTitle}>Choose your Avatar</Text>

      </View>

      {/* REPLACED: Now uses the layered vintage paper background */}
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
              styles.loginButton, // Switched to match login button style
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
  headerSubtitle: {
    fontSize: 10,
    color: "#EDE8D9",
    opacity: 0.8,
    marginTop: 8,
    letterSpacing: 1.2,
    fontWeight: "700",
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
  sectionLabel: {
    fontSize: 11,
    color: "#A08D71",
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 25,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 25,
  },
  avatarContainer: {
    width: "30%",
    alignItems: "center",
  },
 outerCircle: {
  width: 92,
  height: 92,
  borderRadius: 46,
  justifyContent: "center",
  alignItems: "center",
  padding: 6,
},

dashedRing: {
  width: "100%",
  height: "100%",
  borderRadius: 40,
  borderWidth: 2,
  borderColor: "rgba(255,255,255,0.8)",
  borderStyle: "dashed",
  justifyContent: "center",
  alignItems: "center",
  padding: 5,
},

innerCircle: {
  width: "110%",
  height: "110%",
  borderRadius: 999,
  justifyContent: "center",
  alignItems: "center",
},

outerCircleSelected: {
  transform: [{ scale: 1.06 }],
},

  avatarImage: {
    width: 55,
    height: 55,
  },
  avatarLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#B4A68D",
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Inter",
  },
  avatarLabelSelected: {
    color: "#7A1A1A",
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },

  // MATCHES YOUR loginButton STYLE EXACTLY
  loginButton: {
    backgroundColor: '#6D1B12',
    borderRadius: 20, // Rounded pill shape from Login
    width: '60%',     // Matches Login width
    height: 40,       // Matches Login height
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 130,
  },

  loginButtonDisabled: {
    opacity: 0.45,
  },

  // MATCHES YOUR login TEXT STYLE EXACTLY
  loginText: {
    fontFamily: 'Inter', // Matches Login text font
    fontSize: 16,
    color: '#E8DCDC',    // Matches Login text color
    textAlign: 'center',
    fontWeight: 'bold',
  },
});