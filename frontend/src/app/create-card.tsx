import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNavbar from "../components/BottomNavbar";
import BackButton from "../components/back-Button";
import DraggableItem from "../components/draggableItem";

type Item = {
  id: string;
  type: "text" | "sticker" | "photo";
  content: string;
  x: number;
  y: number;
  sticker?: string;
  image?: any;
  color?: string;
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

export default function CreateCard() {
  const [cardColor, setCardColor] = useState("#fffaf4");
  const [items, setItems] = useState<Item[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gifs, setGifs] = useState<any[]>([]);
  const [gifSearch, setGifSearch] = useState("");
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const STICKERS = [
    { id: "star", image: require("../../assets/images/star-stamp.png") },
    { id: "heart", image: require("../../assets/images/costa-rica-stamp.png") },
    { id: "flower", image: require("../../assets/images/Australia-Stamp.png") },
  ];

  const COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];

  const updateItemColor = (id: string, color: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, color } : i)));
  };

  const handlePositionChange = (id: string, newX: number, newY: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, x: newX, y: newY } : i))
    );
  };

  const handleRotationChange = (id: string, newRotation: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, rotation: newRotation } : i))
    );
  };

  const handleScaleChange = (id: string, newScale: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, scale: newScale } : i))
    );
  };

  const handleContentChange = (id: string, newContent: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, content: newContent } : i))
    );
  };

  const addText = () => {
    const id = Date.now().toString();
    const newItem: Item = {
      id,
      type: "text",
      content: "Tap to type...",
      x: 20,
      y: 20,
      color: "#5A390E",
      rotation: seededRotation(id),
      scale: 1,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const addSticker = (stickerId: string) => {
    const id = Date.now().toString();
    const newItem: Item = {
      id,
      type: "sticker",
      content: stickerId,
      sticker: stickerId,
      x: 30,
      y: 30,
      rotation: seededRotation(id),
      scale: 1,
    };
    setItems((prev) => [...prev, newItem]);
    setActiveTool(null);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  async function searchGifs(query: string) {
    const apiKey = process.env.EXPO_PUBLIC_GIPHY_KEY;
    const url = query
      ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=50`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=50`;
    const res = await fetch(url);
    const json = await res.json();
    setGifs(json.data || []);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <BackButton color="#f5ede0" />
          <Text style={styles.headerTitle}>Create a Card</Text>
        </View>
      </View>

      <ImageBackground
        source={require("../../assets/images/layered-vintage-paper.png")}
        style={styles.paperArea}
        imageStyle={styles.paperImage}
      >
        <View style={styles.bgArea}>
          <View
            style={[styles.cardPreview, { backgroundColor: cardColor }]}
            onLayout={(e) => setBoardSize(e.nativeEvent.layout)}
          >
            {items.length === 0 && (
              <Text style={styles.previewText}>Card preview</Text>
            )}

            {items.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                isEditing={true}
                deleteItem={deleteItem}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onColorChange={updateItemColor}
                onPositionChange={handlePositionChange}
                onRotationChange={handleRotationChange}
                onScaleChange={handleScaleChange}
                onContentChange={handleContentChange}
                boardWidth={boardSize.width}
                boardHeight={boardSize.height}
                accentColor="#8B6A3E"
              />
            ))}
          </View>

          <View style={styles.footerWrapper}>
            {activeTool && (
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>
                    {activeTool.toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={() => setActiveTool(null)}>
                    <Ionicons name="close-circle" size={20} color="#5A390E" />
                  </TouchableOpacity>
                </View>

                {activeTool === "background" && (
                  <View style={styles.colorRow}>
                    {COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorDot,
                          { backgroundColor: color },
                          cardColor === color && styles.activeColor,
                        ]}
                        onPress={() => setCardColor(color)}
                      />
                    ))}
                  </View>
                )}

                {activeTool === "text" && (
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.panelTitle}>ADD TEXT</Text>
                    <TouchableOpacity
                      style={styles.addTextButton}
                      onPress={addText}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#F8E5CF"
                      />
                      <Text style={styles.buttonText}>New Text Box</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {activeTool === "sticker" && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.stickerRow}
                  >
                    {STICKERS.map((s) => (
                      <TouchableOpacity key={s.id} onPress={() => addSticker(s.id)}>
                        <Image source={s.image} style={styles.stickerThumb} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {activeTool === "gif" && (
                  <View>
                    <TextInput
                      style={styles.gifInput}
                      placeholder="Search GIFs..."
                      placeholderTextColor="#9a7a60"
                      value={gifSearch}
                      onChangeText={(text) => {
                        setGifSearch(text);
                        searchGifs(text);
                      }}
                    />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {gifs.map((gif: any) => (
                        <Pressable
                          key={gif.id}
                          onPress={() => {
                            const id = Date.now().toString();
                            setItems((prev) => [
                              ...prev,
                              {
                                id,
                                type: "sticker",
                                content: "",
                                x: 30,
                                y: 30,
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
                            style={{
                              width: 100,
                              height: 100,
                              margin: 4,
                              borderRadius: 8,
                            }}
                          />
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <View style={styles.toolbarRow}>
              <View style={styles.toolbar}>
                <Pressable
                  style={[
                    styles.toolButton,
                    activeTool === "background" && styles.activeToolBtn,
                  ]}
                  onPress={() =>
                    setActiveTool(activeTool === "background" ? null : "background")
                  }
                >
                  <Ionicons
                    name="color-palette-outline"
                    size={24}
                    color="#5A390E"
                  />
                </Pressable>

                <Pressable
                  style={[
                    styles.toolButton,
                    activeTool === "text" && styles.activeToolBtn,
                  ]}
                  onPress={() =>
                    setActiveTool(activeTool === "text" ? null : "text")
                  }
                >
                  <Ionicons name="text-outline" size={24} color="#5A390E" />
                </Pressable>

                <Pressable
                  style={[
                    styles.toolButton,
                    activeTool === "sticker" && styles.activeToolBtn,
                  ]}
                  onPress={() =>
                    setActiveTool(activeTool === "sticker" ? null : "sticker")
                  }
                >
                  <Ionicons name="happy-outline" size={24} color="#5A390E" />
                </Pressable>

                <Pressable
                  style={[
                    styles.toolButton,
                    activeTool === "gif" && styles.activeToolBtn,
                  ]}
                  onPress={() => {
                    setActiveTool(activeTool === "gif" ? null : "gif");
                    searchGifs("");
                  }}
                >
                  <Ionicons name="film-outline" size={24} color="#5A390E" />
                </Pressable>
              </View>

              <TouchableOpacity
                style={styles.plusButton}
                activeOpacity={0.8}
                onPress={() => router.push("/send-card" as any)}
              >
                <Image
                  source={require("../../assets/images/sparkle-chat.png")}
                  style={{
                    marginLeft: 2,
                    width: 45,
                    height: 45,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={() => router.push("/send-card" as any)}
              >
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7a1a1a",
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    marginLeft: -5,
    fontSize: 28,
    fontWeight: "700",
    color: "#f5e8d8",
    textAlign: "center",
    fontFamily: "Calistoga",
  },

  paperArea: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },

  paperImage: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  bgArea: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 14,
  },

  cardPreview: {
    width: "90%",
    height: 500,
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139,26,26,0.15)",
    marginTop: 20,
    overflow: "hidden",
    position: "relative",
  },

  previewText: {
    fontSize: 18,
    color: "#5A390E",
  },

  footerWrapper: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 10,
  },

  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ede0cc",
    height: 50,
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(139,26,26,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#4A7568",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  toolButton: {
    padding: 10,
    borderRadius: 20,
  },

  activeToolBtn: {
    backgroundColor: "rgba(90, 57, 14, 0.1)",
  },

  panel: {
    backgroundColor: "#ede0cc",
    width: "90%",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },

  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  panelTitle: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#5A390E",
  },

  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },

  colorDot: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "white",
  },

  activeColor: {
    borderColor: "#5A390E",
    transform: [{ scale: 1.1 }],
  },

  addTextButton: {
    backgroundColor: "#6D1B12",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    elevation: 3,
  },

  buttonText: {
    color: "#F8E5CF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  stickerRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
  },

  stickerThumb: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  headerButtons: {
    flexDirection: "row",
    width: "85%",
    gap: 10,
    marginTop: 8,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139,26,26,0.3)",
    alignItems: "center",
    backgroundColor: "#ede0cc",
  },

  cancelText: {
    color: "#8b1a1a",
    fontSize: 14,
  },

  sendBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#7a1a1a",
    alignItems: "center",
  },

  sendText: {
    color: "#f5ede0",
    fontSize: 14,
  },

  gifInput: {
    backgroundColor: "#F5EEE1",
    borderWidth: 1,
    borderColor: "#c8b89a",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: "#3a2010",
    marginBottom: 8,
  },
});