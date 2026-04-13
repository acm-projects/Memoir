import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, Pressable, ImageBackground, Image,
  TouchableOpacity, ScrollView, Keyboard, TouchableWithoutFeedback,
  TextInput, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import DraggableItem from "../components/draggableItem";
import BottomNavbar from "../components/BottomNavbar";
import {
  fetchBoardItems, addNote as addNoteService, addSticker as addStickerService,
  addGif as addGifService, addPhoto as addPhotoService,
  updateItemPosition, deleteItem as deleteItemService, updateNoteContent,
  fetchStickers,
} from "@/services/bulletin-board.services";
import { supabase } from "@/lib/supabase";

type ItemType = "note" | "sticker" | "card" | "photo" | "gif" | "custom_card";

type Item = {
  id: string;
  type: ItemType;
  content: string;
  x: number;
  y: number;
  color?: string;
  sticker?: string;
  image?: any;
  rotation: number;
  scale: number;
  cardColor?: string;
  cardItems?: string;
  cardId?: string;
};

const NOTE_COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];
const ACCENT_COLORS = ["#557263", "#7B1D1D", "#8B6A3E", "#4A6741", "#6B4F6B"];


function seededRotation(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return (hash % 13) - 6;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

export default function BulletinBoard() {
  const router = useRouter();
  const { title, id } = useLocalSearchParams<{ title: string; id: string }>();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [activeTool, setActiveTool] = useState<"note" | "sticker" | "gif" | "photo" | null>(null);
  const [gifs, setGifs] = useState<any[]>([]);
  // Add state
  const [availableStickers, setAvailableStickers] = useState<{id: string, name: string, image_url: string}[]>([]);
  const [gifSearch, setGifSearch] = useState("");


  useEffect(() => { loadItems(); 
    fetchStickers().then(setAvailableStickers).catch(console.error); // added fix: fetch stickers
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const channels = [
      { channel: `notes:${id}`, table: 'notes', type: 'note' as ItemType },
      { channel: `cards:${id}`, table: 'cards', type: 'card' as ItemType },
      { channel: `folder_stickers:${id}`, table: 'folder_stickers', type: 'sticker' as ItemType },
      { channel: `board_gifs:${id}`, table: 'board_gifs', type: 'gif' as ItemType },
      { channel: `board_photos:${id}`, table: 'board_photos', type: 'photo' as ItemType },
    ].map(({ channel, table, type }) =>
      supabase.channel(channel)
        .on('postgres_changes', { event: '*', schema: 'public', table, filter: `folder_id=eq.${id}` },
          (payload) => handleRealtimeChange(type, payload))
        .subscribe()
    );
    return () => { channels.forEach((c) => supabase.removeChannel(c)); };
  }, [id]);

  async function loadItems() {
    try {
      setLoading(true);
      const data = await fetchBoardItems(id);
      const deduped = data.filter((item, index, self) => index === self.findIndex(i => i.id === item.id));
      setItems(deduped as Item[]);
    } catch (e) {
      console.error("Failed to load board items:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleRealtimeChange(type: ItemType, payload: any) {
    const { eventType, new: newRow, old: oldRow } = payload;
    if (eventType === 'DELETE') {
      setItems((prev) => prev.filter((item) => item.id !== oldRow.id));
      return;
    }
    const mapped = mapRowToItem(type, newRow);
    if (!mapped) return;
    if (eventType === 'INSERT') {
      setItems((prev) => prev.some((i) => i.id === mapped.id) ? prev.map((i) => i.id === mapped.id ? mapped : i) : [...prev, mapped]);
    }
    if (eventType === 'UPDATE') {
      setItems((prev) => prev.map((i) => i.id === mapped.id ? { ...i, ...mapped } : i));
    }
  }

  function mapRowToItem(type: ItemType, row: any): Item | null {
    if (!row) return null;
    const base = { id: row.id, type, content: '', x: row.x, y: row.y, rotation: row.rotation, scale: row.scale };
    switch (type) {
      case 'note': return { ...base, content: row.content, color: row.color };
      case 'card': return { ...base, content: row.title, image: { uri: row.image_url } };
      case 'sticker': return { ...base, sticker: row.image_url };
      case 'gif': return { ...base, sticker: row.giphy_url };
      case 'photo': return { ...base, sticker: row.image_url };
      case 'custom_card': return { ...base, cardColor: row.custom_cards?.card_color, cardItems: row.custom_cards?.card_items, cardId: row.card_id };
      default: return null;
    }
  }

  const debouncedSave = useCallback(
    debounce((itemId: string, type: ItemType, fields: Partial<Item>) => {
      updateItemPosition(type, itemId, fields).catch((e) => console.error("Failed to save:", e));
    }, 600), []
  );

  const handlePositionChange = (itemId: string, newX: number, newY: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) debouncedSave(itemId, item.type, { x: newX, y: newY });
      return prev.map((i) => i.id === itemId ? { ...i, x: newX, y: newY } : i);
    });
  };

  const handleRotationChange = (itemId: string, newRotation: number) => {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, rotation: newRotation } : i));
    const item = items.find((i) => i.id === itemId);
    if (item) debouncedSave(itemId, item.type, { rotation: newRotation });
  };

  const handleScaleChange = (itemId: string, newScale: number) => {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, scale: newScale } : i));
    const item = items.find((i) => i.id === itemId);
    if (item) debouncedSave(itemId, item.type, { scale: newScale });
  };

  const debouncedContentSave = useCallback(
    debounce((itemId: string, content: string) => {
      updateNoteContent(itemId, content).catch((e) => console.error("Failed to save content:", e));
    }, 800), []
  );

  const onContentChange = (itemId: string, newContent: string) => {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, content: newContent } : i));
    debouncedContentSave(itemId, newContent);
  };

  const addNote = async (color: string) => {
    try {
      const newItem = await addNoteService(id, color);
      setItems((prev) => [...prev, { ...newItem, rotation: seededRotation(newItem.id) }]);
    } catch (e) { console.error("Failed to add note:", e); }
    setActiveTool(null);
  };

  const addSticker = async (stickerKey: string) => {
   try {
    const newItem = await addStickerService(id, stickerKey);
    setItems((prev) => [...prev, { ...newItem, rotation: seededRotation(newItem.id) }]);
  } catch (e) { console.error("Failed to add sticker:", e); }
  setActiveTool(null);
  };

  const addGif = async (gifUrl: string) => {
    try {
      const newItem = await addGifService(id, gifUrl);
      setItems((prev) => [...prev, { ...newItem, rotation: seededRotation(newItem.id) }]);
    } catch (e) { console.error("Failed to add gif:", e); }
    setActiveTool(null);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { alert("Permission required."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled && res.assets[0]?.uri) {
      try {
        const newItem = await addPhotoService(id, res.assets[0].uri);
        setItems((prev) => [...prev, { ...newItem, rotation: seededRotation(newItem.id) }]);
      } catch (e) { console.error("Failed to add photo:", e); }
      setActiveTool(null);
    }
  };

  const deleteItem = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await deleteItemService(item.type, itemId);
    } catch (e) {
      console.error("Failed to delete:", e);
      setItems((prev) => [...prev, item]);
    }
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
        <Text style={styles.bannerTitle} numberOfLines={1}>{title}</Text>
        {!isEditing && (
          <TouchableOpacity style={styles.bannerEditButton} onPress={() => setIsEditing(true)}>
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
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#6D1B12" />
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setActiveTool(null); }}>
            <View style={styles.corkboardFrame} onLayout={(e) => setBoardSize(e.nativeEvent.layout)}>
              <ScrollView style={styles.board} contentContainerStyle={styles.boardContent} scrollEnabled={!isEditing}>
                <Svg width="100%" height="1500" style={styles.absoluteFull}>
                  {Array.from({ length: 60 }).map((_, i) => (
                    <Circle key={i} cx={(i % 10) * 40 + 20} cy={Math.floor(i / 10) * 200 + 50} r={1.2} fill="#8B6A3E" opacity={0.12} />
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
        )}

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
                      <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }]} onPress={() => addNote(c)} />
                    ))}
                  </View>
                )}

                {activeTool === "sticker" && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stickerRow}>
                    {availableStickers.map((s) => (
                      <TouchableOpacity key={s.id} onPress={() => addSticker(s.id)}>
                        <Image source={{ uri: s.image_url }} style={styles.stickerThumb} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {activeTool === "photo" && (
                  <TouchableOpacity style={styles.panelUploadArea} onPress={pickImage}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#8B7355" />
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
                      onChangeText={(t) => { setGifSearch(t); searchGifs(t); }}
                    />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {gifs.map((gif) => (
                        <TouchableOpacity key={gif.id} onPress={() => addGif(gif.images.fixed_height.url)}>
                          <Image source={{ uri: gif.images.fixed_height.url }} style={styles.gifThumb} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <View style={styles.toolbar}>
              {[
                { tool: "note", icon: "document-text-outline" },
                { tool: "photo", icon: "image-outline" },
                { tool: "sticker", icon: "happy-outline" },
                { tool: "gif", icon: "film-outline" },
              ].map(({ tool, icon }) => (
                <Pressable
                  key={tool}
                  style={[styles.toolButton, activeTool === tool && styles.activeToolBtn]}
                  onPress={() => { setActiveTool(tool as any); if (tool === "gif") searchGifs(""); }}
                >
                  <Ionicons name={icon as any} size={24} color="#5A390E" />
                </Pressable>
              ))}
              <View style={styles.toolbarDivider} />
              <Pressable style={styles.doneButton} onPress={() => { setIsEditing(false); setActiveTool(null); }}>
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
  topBanner: { height: 150, width: "105%", flexDirection: "row", alignItems: "flex-end", paddingTop: 40, paddingBottom: 16, paddingHorizontal: 16 },
  bannerBack: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(246,229,205,0.2)", alignItems: "center", justifyContent: "center", marginRight: 8, marginBottom: 8 },
  bannerBackText: { fontSize: 20, color: "#F6E5CD" },
  bannerTitle: { flex: 1, fontSize: 24, fontWeight: "700", color: "#F6E5CD", fontFamily: "Calistoga", marginBottom: 8 },
  bannerEditButton: { backgroundColor: "rgba(246,229,205,0.25)", borderRadius: 12, paddingVertical: 3, paddingHorizontal: 14, marginBottom: 10, alignItems: "center", justifyContent: "center", marginRight: 20 },
  bannerEditText: { color: "#F6E5CD", fontSize: 13, fontWeight: "600" },
  tornEdgeContainer: { marginTop: -18, zIndex: 10 },
  paperBackground: { flex: 1, width: "100%" },
  corkboardFrame: { flex: 1, borderWidth: 12, borderColor: "#8B6A3E", borderRadius: 24, margin: 10, overflow: "hidden", backgroundColor: "rgba(139,106,62,0.04)", marginTop: 16 },
  board: { flex: 1 },
  boardContent: { height: 1500, paddingTop: 20 },
  absoluteFull: { position: "absolute", top: 0, left: 0 },
  footerWrapper: { position: "absolute", bottom: 100, left: 0, right: 0, alignItems: "center", gap: 10, zIndex: 100 },
  toolbar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: "#ede0cc", height: 60, width: "90%", borderRadius: 30, borderWidth: 1, borderColor: "#6D1B12", elevation: 5, shadowOpacity: 0.1, shadowRadius: 10, paddingHorizontal: 8 },
  toolButton: { padding: 12, borderRadius: 25 },
  activeToolBtn: { backgroundColor: "rgba(90, 57, 14, 0.15)" },
  toolbarDivider: { width: 1, height: 28, backgroundColor: "rgba(109,27,18,0.25)", marginHorizontal: 4 },
  doneButton: { backgroundColor: "#6D1B12", width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  panel: { backgroundColor: "#ede0cc", width: "92%", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#d7c3ac" },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  panelTitle: { fontWeight: "bold", fontSize: 12, color: "#5A390E", letterSpacing: 1 },
  colorRow: { flexDirection: "row", justifyContent: "center", gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  stickerRow: { gap: 15, paddingVertical: 5 },
  stickerThumb: { width: 60, height: 60, resizeMode: "contain" },
  panelUploadArea: { borderWidth: 1.5, borderColor: "#C8B89A", borderStyle: "dashed", borderRadius: 12, padding: 25, alignItems: "center", gap: 8 },
  uploadText: { fontSize: 13, color: "#8B7355" },
  gifInput: { backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#C8B89A", borderRadius: 10, padding: 10, marginBottom: 10 },
  gifThumb: { width: 90, height: 90, borderRadius: 8 },
});