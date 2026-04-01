import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";

import DraggableItem from "../components/draggableItem";
import BottomNavbar from "../components/BottomNavbar";

type Item = {
  id: string;
  type: "note" | "sticker" | "card" | "photo";
  content: string;
  x: number;
  y: number;
  color?: string;
  sticker?: string;
  image?: any;
  noteBackground?: any;
  rotation: number;
  scale: number;
};

function seededRotation(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (hash % 13) - 6;
}

export default function BulletinBoard() {
  const router = useRouter();
  const { title } = useLocalSearchParams();

  const [items, setItems] = useState<Item[]>([
    {
      id: "2",
      type: "card",
      content: "card1",
      x: 30,
      y: 260,
      image: require("../../assets/images/cards.jpg"),
      rotation: seededRotation("2"),
      scale: 1,
    },
    {
      id: "3",
      type: "card",
      content: "card2",
      x: 200,
      y: 400,
      image: require("../../assets/images/card2.jpg"),
      rotation: seededRotation("3"),
      scale: 1,
    },
    {
      id: "4",
      type: "card",
      content: "card3",
      x: 60,
      y: 550,
      image: require("../../assets/images/card3.jpg"),
      rotation: seededRotation("4"),
      scale: 1,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [activeTool, setActiveTool] = useState<
    "note" | "sticker" | "gif" | "photo" | null
  >(null);
  const [gifs, setGifs] = useState<any[]>([]);
  const [gifSearch, setGifSearch] = useState("");

  const NOTE_COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];
  const STICKERS = [
    { key: "star", source: require("../../assets/images/star-stamp.png") },
    { key: "heart", source: require("../../assets/images/costa-rica-stamp.png") },
    { key: "flower", source: require("../../assets/images/Australia-Stamp.png") },
  ];
  const ACCENT_COLORS = ["#557263", "#7B1D1D", "#8B6A3E", "#4A6741", "#6B4F6B"];

  const addNote = (color: string) => {
    const id = Date.now().toString();
    setItems((prev) => [
      ...prev,
      {
        id,
        type: "note",
        content: "New note",
        x: 80,
        y: 100,
        color,
        rotation: seededRotation(id),
        scale: 1,
      },
    ]);
    setActiveTool(null);
  };

  const addSticker = (stickerKey: string) => {
    const id = Date.now().toString();
    setItems((prev) => [
      ...prev,
      {
        id,
        type: "sticker",
        content: "",
        x: 150,
        y: 200,
        sticker: stickerKey,
        rotation: seededRotation(id),
        scale: 1,
      },
    ]);
    setActiveTool(null);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePositionChange = (id: string, newX: number, newY: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  const handleRotationChange = (id: string, newRotation: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: newRotation } : item
      )
    );
  };

  const handleScaleChange = (id: string, newScale: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, scale: newScale } : item
      )
    );
  };

  const onContentChange = (id: string, newContent: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };

  async function searchGifs(query: string) {
    const apiKey = process.env.EXPO_PUBLIC_GIPHY_KEY;
    const url = query
      ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=20`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20`;

    const res = await fetch(url);
    const json = await res.json();
    setGifs(json.data || []);
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission required.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled && res.assets[0]?.uri) {
      const id = Date.now().toString();
      setItems((prev) => [
        ...prev,
        {
          id,
          type: "sticker",
          content: "",
          x: 100,
          y: 150,
          sticker: res.assets[0].uri,
          rotation: seededRotation(id),
          scale: 1,
        },
      ]);
      setActiveTool(null);
    }
  }

  const handleDone = () => {
    setIsEditing(false);
    setActiveTool(null);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/RED swirl subtle.png")}
        style={styles.topBanner}
        imageStyle={{ resizeMode: "cover" }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.bannerBack}>
          <Text style={styles.bannerBackText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.bannerTitle} numberOfLines={1}>
          {title}
        </Text>

        {!isEditing && (
          <TouchableOpacity
            style={styles.bannerEditButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.bannerEditText}>Edit</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>

      <View style={styles.tornEdgeContainer}>
        <Svg height="28" width="100%">
          <Path
            d="M0,10 Q20,0 40,20 Q60,0 80,20 Q100,0 120,20 Q140,0 160,20 Q180,0 200,20 Q220,0 240,20 Q260,0 280,20 Q300,0 320,20 Q340,0 360,20 Q380,0 400,20 Q420,0 440,20 Q460,0 480,20 Q500,0 520,20 Q540,0 560,20 Q580,0 600,20 Q620,0 640,20 Q660,0 680,20 Q700,0 720,20 Q740,0 760,20 Q780,0 800,20 Q820,0 840,20 Q860,0 880,20 Q900,0 920,20 Q940,0 960,20 Q980,0 1000,20 L1000,28 L0,28 Z"
            fill="#F0E8D8"
          />
        </Svg>
      </View>

      <ImageBackground
        source={require("../../assets/images/layered-vintage-paper.png")}
        style={styles.paperBackground}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setActiveTool(null);
          }}
        >
          <View
            style={styles.corkboardFrame}
            onLayout={(e) => setBoardSize(e.nativeEvent.layout)}
          >
            <ScrollView
              style={styles.board}
              contentContainerStyle={styles.boardContent}
              scrollEnabled={!isEditing}
            >
              <Svg width="100%" height="1500" style={styles.absoluteFull}>
                {Array.from({ length: 60 }).map((_, i) => (
                  <Circle
                    key={i}
                    cx={(i % 10) * 40 + 20}
                    cy={Math.floor(i / 10) * 200 + 50}
                    r={1.2}
                    fill="#8B6A3E"
                    opacity={0.12}
                  />
                ))}
              </Svg>

              {items.map((item, idx) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  deleteItem={deleteItem}
                  isEditing={isEditing}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  onPositionChange={handlePositionChange}
                  onRotationChange={handleRotationChange}
                  onScaleChange={handleScaleChange}
                  accentColor={ACCENT_COLORS[idx % ACCENT_COLORS.length]}
                  onContentChange={onContentChange}
                  boardWidth={boardSize.width}
                  boardHeight={boardSize.height}
                />
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {isEditing && (
          <View style={styles.footerWrapper}>
            {activeTool && (
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>{activeTool.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => setActiveTool(null)}>
                    <Ionicons name="close-circle" size={22} color="#5A390E" />
                  </TouchableOpacity>
                </View>

                {activeTool === "note" && (
                  <View style={styles.colorRow}>
                    {NOTE_COLORS.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorDot, { backgroundColor: c }]}
                        onPress={() => addNote(c)}
                      />
                    ))}
                  </View>
                )}

                {activeTool === "sticker" && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.stickerRow}
                  >
                    {STICKERS.map((s) => (
                      <TouchableOpacity key={s.key} onPress={() => addSticker(s.key)}>
                        <Image source={s.source} style={styles.stickerThumb} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {activeTool === "photo" && (
                  <TouchableOpacity
                    style={styles.panelUploadArea}
                    onPress={pickImage}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color="#8B7355"
                    />
                    <Text style={styles.uploadText}>Upload from Camera Roll</Text>
                  </TouchableOpacity>
                )}

                {activeTool === "gif" && (
                  <View>
                    <TextInput
                      style={styles.gifInput}
                      placeholder="Search GIFs..."
                      placeholderTextColor="#9a7a60"
                      value={gifSearch}
                      onChangeText={(t) => {
                        setGifSearch(t);
                        searchGifs(t);
                      }}
                    />

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 8 }}
                    >
                      {gifs.map((gif) => (
                        <TouchableOpacity
                          key={gif.id}
                          onPress={() => {
                            const id = Date.now().toString();
                            setItems((prev) => [
                              ...prev,
                              {
                                id,
                                type: "sticker",
                                content: "",
                                x: 100,
                                y: 150,
                                sticker: gif.images.fixed_height.url,
                                rotation: seededRotation(id),
                                scale: 1,
                              },
                            ]);
                            setActiveTool(null);
                          }}
                        >
                          <Image
                            source={{ uri: gif.images.fixed_height.url }}
                            style={styles.gifThumb}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <View style={styles.toolbar}>
              <Pressable
                style={[
                  styles.toolButton,
                  activeTool === "note" && styles.activeToolBtn,
                ]}
                onPress={() => setActiveTool("note")}
              >
                <Ionicons name="document-text-outline" size={24} color="#5A390E" />
              </Pressable>

              <Pressable
                style={[
                  styles.toolButton,
                  activeTool === "photo" && styles.activeToolBtn,
                ]}
                onPress={() => setActiveTool("photo")}
              >
                <Ionicons name="image-outline" size={24} color="#5A390E" />
              </Pressable>

              <Pressable
                style={[
                  styles.toolButton,
                  activeTool === "sticker" && styles.activeToolBtn,
                ]}
                onPress={() => setActiveTool("sticker")}
              >
                <Ionicons name="happy-outline" size={24} color="#5A390E" />
              </Pressable>

              <Pressable
                style={[
                  styles.toolButton,
                  activeTool === "gif" && styles.activeToolBtn,
                ]}
                onPress={() => {
                  setActiveTool("gif");
                  searchGifs("");
                }}
              >
                <Ionicons name="film-outline" size={24} color="#5A390E" />
              </Pressable>

              <View style={styles.toolbarDivider} />

              <Pressable style={styles.doneButton} onPress={handleDone}>
                <Ionicons name="checkmark" size={22} color="#F6E5CD" />
              </Pressable>
            </View>
          </View>
        )}
      </ImageBackground>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F3EE" },

  topBanner: {
    height: 150,
    width: "105%",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },

  bannerBack: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(246,229,205,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },

  bannerBackText: {
    fontSize: 20,
    color: "#F6E5CD",
  },

  bannerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#F6E5CD",
    fontFamily: "Calistoga",
    marginBottom: 8,
  },

  bannerEditButton: {
    backgroundColor: "rgba(246,229,205,0.25)",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 14,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  bannerEditText: {
    color: "#F6E5CD",
    fontSize: 13,
    fontWeight: "600",
  },

  tornEdgeContainer: {
    marginTop: -18,
    zIndex: 10,
  },

  paperBackground: {
    flex: 1,
    width: "100%",
  },

  corkboardFrame: {
    flex: 1,
    borderWidth: 12,
    borderColor: "#8B6A3E",
    borderRadius: 24,
    margin: 10,
    overflow: "hidden",
    backgroundColor: "rgba(139,106,62,0.04)",
    marginTop: 16,
  },

  board: {
    flex: 1,
  },

  boardContent: {
    height: 1500,
    paddingTop: 20,
  },

  absoluteFull: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  footerWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 10,
    zIndex: 100,
  },

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ede0cc",
    height: 60,
    width: "90%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#6D1B12",
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 8,
  },

  toolButton: {
    padding: 12,
    borderRadius: 25,
  },

  activeToolBtn: {
    backgroundColor: "rgba(90, 57, 14, 0.15)",
  },

  toolbarDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(109,27,18,0.25)",
    marginHorizontal: 4,
  },

  doneButton: {
    backgroundColor: "#6D1B12",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  panel: {
    backgroundColor: "#ede0cc",
    width: "92%",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },

  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  panelTitle: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#5A390E",
    letterSpacing: 1,
  },

  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  stickerRow: {
    gap: 15,
    paddingVertical: 5,
  },

  stickerThumb: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  panelUploadArea: {
    borderWidth: 1.5,
    borderColor: "#C8B89A",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    gap: 8,
  },

  uploadText: {
    fontSize: 13,
    color: "#8B7355",
  },

  gifInput: {
    backgroundColor: "#F5EEE1",
    borderWidth: 1,
    borderColor: "#C8B89A",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  gifThumb: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
});