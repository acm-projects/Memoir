import React, { useState, useRef, useEffect } from "react";
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
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { DancingScript_400Regular } from "@expo-google-fonts/dancing-script";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { Caveat_400Regular } from "@expo-google-fonts/caveat";
import { PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import BottomNavbar from "../components/BottomNavbar";
import BackButton from "../components/back-Button";
import DraggableItem from "../components/draggableItem";
import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type TemplateMatch = {
  id: string;
  name: string;
  card_color: string;
  text_1?: string; text_2?: string; text_3?: string; text_4?: string; text_5?: string;
  sticker_1?: string; sticker_2?: string; sticker_3?: string; sticker_4?: string; sticker_5?: string;
  gif_1?: string; gif_2?: string;
  similarity?: number;
  custom_card_id?: string;
};

type Item = {
  id: string;
  type: "text" | "sticker" | "photo";
  content: string;
  x: number;
  y: number;
  sticker?: string;
  image?: any;
  color?: string;
  font?: string;
  rotation: number;
  scale: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const FLASK_URL = process.env.EXPO_PUBLIC_FLASK_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seededRotation(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (hash % 13) - 6;
}

function templateToItems(template: TemplateMatch): Item[] {
  const items: Item[] = [];
  const textFields = [template.text_1, template.text_2, template.text_3, template.text_4, template.text_5];
  const stickerFields = [template.sticker_1, template.sticker_2, template.sticker_3, template.sticker_4, template.sticker_5, template.gif_1, template.gif_2];

  textFields.filter(Boolean).forEach((raw, i) => {
    try {
      const parsed = JSON.parse(raw!);
      const id = `tpl-text-${i}-${Date.now()}`;
      items.push({
        id, type: "text",
        content: parsed.content ?? "...",
        x: parsed.x ?? 20, y: parsed.y ?? 20,
        color: parsed.color ?? "#5A390E",
        font: parsed.font,
        rotation: parsed.rotation ?? seededRotation(id),
        scale: parsed.scale ?? 1,
      });
    } catch {}
  });

  stickerFields.filter(Boolean).forEach((raw, i) => {
    try {
      const parsed = JSON.parse(raw!);
      const id = `tpl-sticker-${i}-${Date.now()}`;
      items.push({
        id, type: "sticker",
        content: parsed.sticker ?? "",
        sticker: parsed.image_url || parsed.sticker,
        x: parsed.x ?? 30, y: parsed.y ?? 30,
        rotation: parsed.rotation ?? seededRotation(id),
        scale: parsed.scale ?? 1,
      });
    } catch {}
  });

  return items;
}

// ─── Template Search Modal ────────────────────────────────────────────────────

function TemplateSearchModal({
  visible,
  onClose,
  onApplyTemplate,
}: {
  visible: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TemplateMatch) => void;
}) {
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState<TemplateMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => fetchTemplates(search), 300);
    return () => clearTimeout(timer);
  }, [visible, search]);

  const fetchTemplates = async (query: string) => {
    setLoading(true);
    try {
      let req = supabase
        .from("templates2")
        .select("id, name, card_color, text_1, text_2, text_3, text_4, text_5, sticker_1, sticker_2, sticker_3, sticker_4, sticker_5, gif_1, gif_2")
        .limit(30);

      if (query.trim()) {
        req = req.ilike("name", `%${query.trim()}%`);
      }

      const { data, error } = await req;
      if (!error && data) setTemplates(data as TemplateMatch[]);
    } catch {}
    setLoading(false);
  };

  const handleApply = (template: TemplateMatch) => {
    onApplyTemplate(template);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={tmStyles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tmStyles.sheet}
        >
          <View style={tmStyles.handle} />

          <View style={tmStyles.header}>
            <View style={tmStyles.headerLeft}>
              <View style={tmStyles.sparkleIcon}>
                <Ionicons name="albums-outline" size={16} color="#f5ede0" />
              </View>
              <View>
                <Text style={tmStyles.title}>Templates</Text>
                <Text style={tmStyles.subtitle}>Pick a starting point</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={tmStyles.closeBtn}>
              <Ionicons name="close" size={20} color="#5A390E" />
            </TouchableOpacity>
          </View>

          <View style={tmStyles.searchRow}>
            <Ionicons name="search-outline" size={16} color="#9a7a60" style={{ marginLeft: 12 }} />
            <TextInput
              style={tmStyles.searchInput}
              placeholder="Search templates..."
              placeholderTextColor="#9a7a60"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} style={{ marginRight: 10 }}>
                <Ionicons name="close-circle" size={16} color="#9a7a60" />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={tmStyles.loadingWrap}>
              <ActivityIndicator color="#7a1a1a" />
              <Text style={tmStyles.loadingText}>Loading templates...</Text>
            </View>
          ) : templates.length === 0 ? (
            <View style={tmStyles.emptyWrap}>
              <Ionicons name="search" size={32} color="#d7c3ac" />
              <Text style={tmStyles.emptyText}>No templates found</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tmStyles.scrollContent}
              style={tmStyles.scrollArea}
            >
              {templates.map((template) => {
                // Map local sticker keys → require() sources (mirrors the STICKERS array)
                const LOCAL_STICKER_MAP: Record<string, any> = {
                  "star-sticker":          require("../../assets/images/star-sticker.png"),
                  "heart-sticker":         require("../../assets/images/heart-sticker.png"),
                  "orange-flower-stamp":   require("../../assets/images/orange-flower-stamp.png"),
                  "photo-strip":           require("../../assets/images/photo-strip.png"),
                  "cake-sticker":          require("../../assets/images/cake-sticker.png"),
                  "sun-sticker":           require("../../assets/images/sun-sticker.png"),
                  "grass-sticker":         require("../../assets/images/grass-sticker.png"),
                  "butterfly-sticker":     require("../../assets/images/butterfly-sticker.png"),
                  "balloon-sticker":       require("../../assets/images/balloon-sticker.png"),
                  "banner-sticker":        require("../../assets/images/banner-sticker.png"),
                  "gradguy-sticker":       require("../../assets/images/gradguy-sticker.png"),
                  "snowman-sticker":       require("../../assets/images/snowman-sticker.png"),
                  "snowflake-sticker":     require("../../assets/images/snowflake-sticker.png"),
                  // legacy ids without suffix
                  "star":      require("../../assets/images/star-sticker.png"),
                  "heart":     require("../../assets/images/heart-sticker.png"),
                  "flower":    require("../../assets/images/orange-flower-stamp.png"),
                  "strip":     require("../../assets/images/photo-strip.png"),
                  "cake":      require("../../assets/images/cake-sticker.png"),
                  "sun":       require("../../assets/images/sun-sticker.png"),
                  "grass":     require("../../assets/images/grass-sticker.png"),
                  "butterfly": require("../../assets/images/butterfly-sticker.png"),
                  "balloon":   require("../../assets/images/balloon-sticker.png"),
                  "banner":    require("../../assets/images/banner-sticker.png"),
                  "gradguy":   require("../../assets/images/gradguy-sticker.png"),
                  "snowman":   require("../../assets/images/snowman-sticker.png"),
                  "snowflake": require("../../assets/images/snowflake-sticker.png"),
                };

                // Returns { type: "local", source } | { type: "uri", uri } | null
                const parseStickerSource = (raw: string | undefined): { type: "local"; source: any } | { type: "uri"; uri: string } | null => {
                  if (!raw) return null;
                  try {
                    const p = JSON.parse(raw);
                    const key = p.sticker || p.image_url || p.url || "";
                    if (key && LOCAL_STICKER_MAP[key]) return { type: "local", source: LOCAL_STICKER_MAP[key] };
                    if (key && key.startsWith("http")) return { type: "uri", uri: key };
                    if (p.image_url?.startsWith("http")) return { type: "uri", uri: p.image_url };
                  } catch {
                    if (typeof raw === "string" && raw.startsWith("http")) return { type: "uri", uri: raw };
                  }
                  return null;
                };

                const parseTextContent = (raw: string | undefined): string => {
                  if (!raw) return "";
                  try {
                    const p = JSON.parse(raw);
                    return p.content || p.text || "";
                  } catch {
                    return typeof raw === "string" ? raw : "";
                  }
                };

                const allStickerFields = [
                  template.sticker_1, template.sticker_2, template.sticker_3,
                  template.sticker_4, template.sticker_5, template.gif_1, template.gif_2,
                ];
                const previewStickers = allStickerFields
                  .map(parseStickerSource)
                  .filter(Boolean) as ({ type: "local"; source: any } | { type: "uri"; uri: string })[];

                const allTextFields = [
                  template.text_1, template.text_2, template.text_3,
                  template.text_4, template.text_5,
                ];
                const previewTexts = allTextFields.map(parseTextContent).filter(Boolean);

                return (
                  <TouchableOpacity
                    key={template.id}
                    style={tmStyles.card}
                    onPress={() => handleApply(template)}
                    activeOpacity={0.85}
                  >
                    <View style={[tmStyles.cardPreview, { backgroundColor: template.card_color || "#fffaf4" }]}>
                      {previewStickers.length > 0 && (
                        <View style={tmStyles.stickerRow}>
                          {previewStickers.slice(0, 3).map((s, i) => (
                            <Image
                              key={i}
                              source={s.type === "local" ? s.source : { uri: (s as any).uri }}
                              style={[tmStyles.stickerPreview, { transform: [{ rotate: `${(i - 1) * 10}deg` }] }]}
                              resizeMode="contain"
                            />
                          ))}
                        </View>
                      )}
                      {previewTexts.length > 0 && (
                        <View style={tmStyles.textPreviewWrap}>
                          {previewTexts.slice(0, 2).map((t, i) => (
                            <Text key={i} style={tmStyles.previewText} numberOfLines={2}>{t}</Text>
                          ))}
                        </View>
                      )}
                      {previewStickers.length === 0 && previewTexts.length === 0 && (
                        <Ionicons name="card-outline" size={32} color="rgba(90,57,14,0.2)" />
                      )}
                    </View>

                    <View style={tmStyles.cardLabel}>
                      <Text style={tmStyles.cardName} numberOfLines={1}>{template.name}</Text>
                      <View style={tmStyles.useBtn}>
                        <Text style={tmStyles.useBtnText}>Use</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <TouchableOpacity style={tmStyles.scratchBtn} onPress={onClose}>
            <Ionicons name="brush-outline" size={16} color="#7a1a1a" />
            <Text style={tmStyles.scratchText}>Start from scratch</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const tmStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: "#fdf6ed",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: "80%",
  },
  handle: { width: 40, height: 4, backgroundColor: "#d7c3ac", borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 6 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ede0cc" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  sparkleIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#7a1a1a", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#3a2010" },
  subtitle: { fontSize: 11, color: "#9a7a60", marginTop: 1 },
  closeBtn: { padding: 6, borderRadius: 20, backgroundColor: "#ede0cc" },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#ede0cc", borderRadius: 14, marginHorizontal: 16, marginVertical: 14, borderWidth: 1, borderColor: "#d7c3ac" },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14, color: "#3a2010" },
  scrollArea: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  card: { width: 150, borderRadius: 16, overflow: "hidden", backgroundColor: "#fff", borderWidth: 1, borderColor: "#d7c3ac" },
  cardPreview: { height: 160, alignItems: "center", justifyContent: "center", padding: 10 },
  stickerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 6 },
  stickerPreview: { width: 44, height: 44 },
  textPreviewWrap: { alignItems: "center", paddingHorizontal: 8, marginTop: 4, gap: 2 },
  previewText: { fontSize: 11, color: "#5A390E", fontStyle: "italic", textAlign: "center" },
  cardLabel: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#ede0cc", backgroundColor: "#fdf6ed", gap: 6 },
  cardName: { flex: 1, fontSize: 12, fontWeight: "600", color: "#3a2010" },
  useBtn: { backgroundColor: "#7a1a1a", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  useBtnText: { color: "#f5ede0", fontSize: 11, fontWeight: "600" },
  loadingWrap: { paddingVertical: 40, alignItems: "center", gap: 10 },
  loadingText: { fontSize: 13, color: "#9a7a60" },
  emptyWrap: { paddingVertical: 40, alignItems: "center", gap: 8 },
  emptyText: { fontSize: 13, color: "#9a7a60" },
  scratchBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, marginHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: "#d7c3ac", backgroundColor: "#ede0cc" },
  scratchText: { fontSize: 13, color: "#7a1a1a", fontWeight: "600" },
});

// ─── Send/Share Modal ─────────────────────────────────────────────────────────

function SendShareModal({ visible, onClose, onSend }: { visible: boolean; onClose: () => void; onSend: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sendModalOverlay} onPress={onClose}>
        <Pressable style={styles.sendModalBox} onPress={() => {}}>
          <View style={styles.sendModalHeader}>
            <Text style={styles.sendModalTitle}>What would you like to do?</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={20} color="#7a2a2a" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendModalOption} onPress={onSend}>
            <View style={styles.sendModalIconWrap}><Ionicons name="send-outline" size={20} color="#7a2a2a" /></View>
            <View>
              <Text style={styles.sendModalOptionTitle}>Send</Text>
              <Text style={styles.sendModalOptionDesc}>Send this card to someone</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendModalOption} onPress={onClose}>
            <View style={styles.sendModalIconWrap}><Ionicons name="share-social-outline" size={20} color="#7a2a2a" /></View>
            <View>
              <Text style={styles.sendModalOptionTitle}>Save</Text>
              <Text style={styles.sendModalOptionDesc}>Save this card</Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CreateCard() {
  const [fontsLoaded] = useFonts({
    DancingScript_400Regular,
    Pacifico_400Regular,
    Caveat_400Regular,
    PlayfairDisplay_400Regular,
  });

  const [cardColor, setCardColor] = useState("#fffaf4");
  const [items, setItems] = useState<Item[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gifs, setGifs] = useState<any[]>([]);
  const [gifSearch, setGifSearch] = useState("");
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const STICKERS = [
    { id: "star",      image: require("../../assets/images/star-sticker.png") },
    { id: "heart",     image: require("../../assets/images/heart-sticker.png") },
    { id: "flower",    image: require("../../assets/images/orange-flower-stamp.png") },
    { id: "strip",     image: require("../../assets/images/photo-strip.png") },
    { id: "cake",      image: require("../../assets/images/cake-sticker.png") },
    { id: "sun",       image: require("../../assets/images/sun-sticker.png") },
    { id: "grass",     image: require("../../assets/images/grass-sticker.png") },
    { id: "butterfly", image: require("../../assets/images/butterfly-sticker.png") },
    { id: "balloon",   image: require("../../assets/images/balloon-sticker.png") },
    { id: "banner",    image: require("../../assets/images/banner-sticker.png") },
    { id: "gradguy",   image: require("../../assets/images/gradguy-sticker.png") },
    { id: "snowman",   image: require("../../assets/images/snowman-sticker.png") },
    { id: "snowflake", image: require("../../assets/images/snowflake-sticker.png") },
  ];

  const COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];

  const updateItemColor      = (id: string, color: string)     => setItems((p) => p.map((i) => i.id === id ? { ...i, color } : i));
  const handlePositionChange = (id: string, x: number, y: number) => setItems((p) => p.map((i) => i.id === id ? { ...i, x, y } : i));
  const handleRotationChange = (id: string, rotation: number)     => setItems((p) => p.map((i) => i.id === id ? { ...i, rotation } : i));
  const handleScaleChange    = (id: string, scale: number)        => setItems((p) => p.map((i) => i.id === id ? { ...i, scale } : i));
  const handleContentChange  = (id: string, content: string)      => setItems((p) => p.map((i) => i.id === id ? { ...i, content } : i));

  const addText = () => {
    const id = Date.now().toString();
    setItems((prev) => [...prev, { id, type: "text", content: "Tap to type...", x: 20, y: 20, color: "#5A390E", rotation: seededRotation(id), scale: 1 }]);
  };

  const addSticker = (stickerId: string) => {
    const id = Date.now().toString();
    setItems((prev) => [...prev, { id, type: "sticker", content: stickerId, sticker: stickerId, x: 30, y: 30, rotation: seededRotation(id), scale: 1 }]);
    setActiveTool(null);
  };

  const deleteItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  async function searchGifs(query: string) {
    const apiKey = process.env.EXPO_PUBLIC_GIPHY_KEY;
    const url = query
      ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=50`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=50`;
    const res = await fetch(url);
    const data = JSON.parse(await res.text());
    setGifs(data.data || []);
  }

  const handleApplyTemplate = async (template: TemplateMatch) => {
    if (template.card_color) setCardColor(template.card_color);
    if (template.custom_card_id) {
      const { data: card } = await supabase.from("custom_cards").select("*").eq("id", template.custom_card_id).single();
      if (card?.card_items) {
        const cardItems = JSON.parse(card.card_items);
        const newItems: Item[] = [];
        cardItems.texts?.forEach((raw: string, i: number) => {
          try {
            const parsed = JSON.parse(raw);
            const id = `tpl-text-${i}-${Date.now()}`;
            newItems.push({ id, type: "text", content: parsed.content ?? "...", x: parsed.x ?? 20, y: parsed.y ?? 20, color: parsed.color ?? "#5A390E", font: parsed.font, rotation: parsed.rotation ?? seededRotation(id), scale: parsed.scale ?? 1 });
          } catch {}
        });
        cardItems.stickers?.forEach((raw: string, i: number) => {
          try {
            const parsed = JSON.parse(raw);
            if (!parsed.image_url && !parsed.sticker) return;
            const id = `tpl-sticker-${i}-${Date.now()}`;
            newItems.push({ id, type: "sticker", content: parsed.sticker ?? "", sticker: parsed.image_url || parsed.sticker, x: parsed.x ?? 30, y: parsed.y ?? 30, rotation: parsed.rotation ?? seededRotation(id), scale: parsed.scale ?? 1 });
          } catch {}
        });
        cardItems.gifs?.forEach((raw: string, i: number) => {
          try {
            const parsed = JSON.parse(raw);
            if (!parsed.sticker) return;
            const id = `tpl-gif-${i}-${Date.now()}`;
            newItems.push({ id, type: "sticker", content: parsed.sticker ?? "", sticker: parsed.sticker, x: parsed.x ?? 30, y: parsed.y ?? 30, rotation: parsed.rotation ?? seededRotation(id), scale: parsed.scale ?? 1 });
          } catch {}
        });
        setItems(newItems);
        setCardId(template.custom_card_id ?? null);
      }
    } else {
      setItems(templateToItems(template));
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <TemplateSearchModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      <SendShareModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
        onSend={() => {
          setSendModalVisible(false);
          router.push({
            pathname: "/send-card",
            params: {
              cardColor: cardColor,
              cardItems: JSON.stringify(items),
            },
          } as any);
        }}
      />

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
            onStartShouldSetResponder={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
              return false;
            }}
          >
            {items.length === 0 && <Text style={styles.previewText}>Card preview</Text>}
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
                accentColor="#8B6A3E"
                showControls={false}
              />
            ))}
          </View>

          <View style={styles.footerWrapper}>

            {activeTool && !selectedId && (
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>{activeTool.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => setActiveTool(null)}>
                    <Ionicons name="close-circle" size={20} color="#5A390E" />
                  </TouchableOpacity>
                </View>

                {activeTool === "background" && (
                  <View style={styles.colorRow}>
                    {COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[styles.colorDot, { backgroundColor: color }, cardColor === color && styles.activeColor]}
                        onPress={() => setCardColor(color)}
                      />
                    ))}
                  </View>
                )}

                {activeTool === "text" && (
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.panelTitle}>ADD TEXT</Text>
                    <TouchableOpacity style={styles.addTextButton} onPress={addText}>
                      <Ionicons name="add-circle-outline" size={20} color="#F8E5CF" />
                      <Text style={styles.buttonText}>New Text Box</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {activeTool === "sticker" && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.compactStrip}>
                    {STICKERS.map((s) => (
                      <TouchableOpacity key={s.id} style={styles.stickerChip} onPress={() => addSticker(s.id)}>
                        <Image source={s.image} style={styles.stickerThumbSmall} />
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
                      onChangeText={(text) => { setGifSearch(text); searchGifs(text); }}
                    />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {gifs.map((gif: any) => (
                        <Pressable
                          key={gif.id}
                          onPress={() => {
                            const id = Date.now().toString();
                            setItems((prev) => [...prev, { id, type: "sticker", content: "", x: 30, y: 30, sticker: gif.images.fixed_height.url, rotation: seededRotation(id), scale: 1 }]);
                            setActiveTool(null);
                          }}
                        >
                          <Image source={{ uri: gif.images.fixed_height.url }} style={{ width: 100, height: 100, margin: 4, borderRadius: 8 }} />
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {activeTool === "photo" && (
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      style={styles.addTextButton}
                      onPress={async () => {
                        const { launchImageLibraryAsync } = await import("expo-image-picker");
                        const result = await launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
                        if (!result.canceled) {
                          const id = Date.now().toString();
                          setItems((prev) => [...prev, { id, type: "sticker", content: "", x: 30, y: 30, sticker: result.assets[0].uri, rotation: seededRotation(id), scale: 1 }]);
                          setActiveTool(null);
                        }
                      }}
                    >
                      <Ionicons name="image-outline" size={20} color="#F8E5CF" />
                      <Text style={styles.buttonText}>Choose Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <View style={styles.toolbarRow}>
              {selectedId ? (
                <View style={[styles.toolbar, styles.toolbarSelected]}>
                  <TouchableOpacity style={styles.toolButton} onPress={() => {
                    const item = items.find((i) => i.id === selectedId);
                    if (item) handleScaleChange(selectedId, Math.max(0.5, (item.scale ?? 1) - 0.1));
                  }}>
                    <Text style={styles.selBtnText}>−</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.toolButton} onPress={() => {
                    const item = items.find((i) => i.id === selectedId);
                    if (item) handleScaleChange(selectedId, Math.min(5, (item.scale ?? 1) + 0.1));
                  }}>
                    <Text style={styles.selBtnText}>+</Text>
                  </TouchableOpacity>

                  <View style={styles.selDivider} />

                  <TouchableOpacity style={styles.toolButton} onPress={() => {
                    const item = items.find((i) => i.id === selectedId);
                    if (item) handleRotationChange(selectedId, (item.rotation ?? 0) - 3);
                  }}>
                    <Text style={styles.selBtnText}>↺</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.toolButton} onPress={() => {
                    const item = items.find((i) => i.id === selectedId);
                    if (item) handleRotationChange(selectedId, (item.rotation ?? 0) + 3);
                  }}>
                    <Text style={styles.selBtnText}>↻</Text>
                  </TouchableOpacity>

                  <View style={styles.selDivider} />

                  <TouchableOpacity style={styles.toolButton} onPress={() => { deleteItem(selectedId); setSelectedId(null); }}>
                    <Ionicons name="trash-outline" size={22} color="#7B1D1D" />
                  </TouchableOpacity>

                  <View style={styles.selDivider} />

                  <TouchableOpacity style={styles.toolButton} onPress={() => setSelectedId(null)}>
                    <Ionicons name="checkmark" size={24} color="#2C5F2E" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.toolbar}>
                  <Pressable style={[styles.toolButton, activeTool === "background" && styles.activeToolBtn]} onPress={() => setActiveTool(activeTool === "background" ? null : "background")}>
                    <Ionicons name="color-palette-outline" size={24} color="#5A390E" />
                  </Pressable>
                  <Pressable style={[styles.toolButton, activeTool === "text" && styles.activeToolBtn]} onPress={() => setActiveTool(activeTool === "text" ? null : "text")}>
                    <Ionicons name="text-outline" size={24} color="#5A390E" />
                  </Pressable>
                  <Pressable style={[styles.toolButton, activeTool === "sticker" && styles.activeToolBtn]} onPress={() => setActiveTool(activeTool === "sticker" ? null : "sticker")}>
                    <Ionicons name="happy-outline" size={24} color="#5A390E" />
                  </Pressable>
                  <Pressable style={[styles.toolButton, activeTool === "gif" && styles.activeToolBtn]} onPress={() => { setActiveTool(activeTool === "gif" ? null : "gif"); searchGifs(""); }}>
                    <Ionicons name="film-outline" size={24} color="#5A390E" />
                  </Pressable>
                  <Pressable style={[styles.toolButton, activeTool === "photo" && styles.activeToolBtn]} onPress={() => setActiveTool(activeTool === "photo" ? null : "photo")}>
                    <Ionicons name="image-outline" size={24} color="#5A390E" />
                  </Pressable>
                </View>
              )}

              <TouchableOpacity style={styles.plusButton} activeOpacity={0.8} onPress={() => setAiModalVisible(true)}>
                <Ionicons name="albums-outline" size={22} color="#f5ede0" />
              </TouchableOpacity>
            </View>

            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendBtn} onPress={() => setSendModalVisible(true)}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#f5ede0" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      <BottomNavbar />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#7a1a1a" },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { flex: 1, marginLeft: -5, fontSize: 28, fontWeight: "700", color: "#f5e8d8", textAlign: "center", fontFamily: "Calistoga" },
  paperArea: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: "hidden" },
  paperImage: { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  bgArea: { flex: 1, paddingTop: 20, paddingHorizontal: 14 },
  cardPreview: {
    width: "105%", height: "75%", alignSelf: "center", borderRadius: 20,
    justifyContent: "center", alignItems: "center", borderWidth: 1,
    borderColor: "rgba(139,26,26,0.15)", marginTop: -10, overflow: "hidden", position: "relative",
  },
  previewText: { fontSize: 18, color: "#5A390E" },
  footerWrapper: { position: "absolute", bottom: 80, left: 0, right: 0, alignItems: "center", gap: 10 },
  toolbarRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20 },
  toolbar: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#ede0cc", height: 50, flex: 1, borderRadius: 30,
    borderWidth: 1, borderColor: "rgba(139,26,26,0.15)",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  toolbarSelected: { borderColor: "#7a1a1a", borderWidth: 1 },
  plusButton: {
    width: 40, height: 40, borderRadius: 25, backgroundColor: "#4A7568",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5,
  },
  toolButton: { padding: 10, borderRadius: 20 },
  activeToolBtn: { backgroundColor: "rgba(90, 57, 14, 0.1)" },
  selBtnText: { fontSize: 22, color: "#5A390E", fontWeight: "700", lineHeight: 26 },
  selDivider: { width: 1, height: 22, backgroundColor: "#d7c3ac", marginHorizontal: 2 },
  panel: { backgroundColor: "#ede0cc", width: "90%", borderRadius: 20, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#d7c3ac" },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  panelTitle: { fontWeight: "bold", fontSize: 12, color: "#5A390E" },
  colorRow: { flexDirection: "row", justifyContent: "center", gap: 15 },
  colorDot: { width: 35, height: 35, borderRadius: 18, borderWidth: 2, borderColor: "white" },
  activeColor: { borderColor: "#5A390E", transform: [{ scale: 1.1 }] },
  addTextButton: {
    backgroundColor: "#6D1B12", flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, marginTop: 10, elevation: 3,
  },
  buttonText: { color: "#F8E5CF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  compactStrip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 6 },
  stickerChip: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#fffaf4", borderWidth: 1, borderColor: "#d7c3ac", alignItems: "center", justifyContent: "center" },
  stickerThumbSmall: { width: 34, height: 34, resizeMode: "contain" },
  headerButtons: { flexDirection: "row", width: "85%", gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: "rgba(139,26,26,0.3)", alignItems: "center", backgroundColor: "#ede0cc" },
  cancelText: { color: "#8b1a1a", fontSize: 14 },
  sendBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: "#7a1a1a", alignItems: "center", justifyContent: "center" },
  gifInput: { backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#c8b89a", borderRadius: 10, padding: 10, fontSize: 14, color: "#3a2010", marginBottom: 8 },
  sendModalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end", paddingBottom: 110, paddingHorizontal: 16 },
  sendModalBox: { backgroundColor: "#fdf6ee", borderRadius: 20, padding: 20 },
  sendModalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sendModalTitle: { fontSize: 15, fontWeight: "700", color: "#6D1B12" },
  sendModalOption: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#f0e4d4", borderRadius: 14, padding: 14, marginBottom: 10 },
  sendModalIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#e9dccd", alignItems: "center", justifyContent: "center" },
  sendModalOptionTitle: { fontSize: 15, fontWeight: "600", color: "#6D1B12" },
  sendModalOptionDesc: { fontSize: 12, color: "#9b6b6b", marginTop: 2 },
});