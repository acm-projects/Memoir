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

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  templatePreview?: TemplateMatch | null;
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

// ─── TemplateCard Component ───────────────────────────────────────────────────

function TemplateCard({
  template,
  onApply,
}: {
  template: TemplateMatch;
  onApply: (t: TemplateMatch) => void;
}) {
  const previewTexts = [template.text_1, template.text_2, template.text_3].filter(Boolean);
  const previewStickers = [template.sticker_1, template.sticker_2, template.sticker_3]
    .filter(Boolean)
    .map((raw) => {
      try { return JSON.parse(raw!).image_url; } catch { return null; }
    })
    .filter(Boolean) as string[];

  return (
    <View style={{
      backgroundColor: "#fdf6ed", borderRadius: 16, borderWidth: 1,
      borderColor: "#d7c3ac", overflow: "hidden", marginTop: 8, width: 240,
    }}>
      <View style={[{
        padding: 12, minHeight: 90, justifyContent: "center",
        alignItems: "center", gap: 4,
      }, { backgroundColor: template.card_color || "#fffaf4" }]}>
        {previewTexts.slice(0, 2).map((t, i) => (
          <Text key={i} style={{ fontSize: 11, color: "#5A390E", fontStyle: "italic", textAlign: "center" }} numberOfLines={1}>{t}</Text>
        ))}
        <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
          {previewStickers.slice(0, 3).map((s, i) => (
            <Image key={i} source={{ uri: s }} style={{ width: 28, height: 28 }} resizeMode="contain" />
          ))}
        </View>
      </View>
      <View style={{
        flexDirection: "row", alignItems: "center", paddingHorizontal: 12,
        paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#ede0cc", gap: 8,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#3a2010" }}>{template.name}</Text>
          {template.similarity !== undefined && (
            <Text style={{ fontSize: 10, color: "#9a7a60", marginTop: 1 }}>
              {Math.round(template.similarity * 100)}% match
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => onApply(template)}
          style={{ backgroundColor: "#7a1a1a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}
        >
          <Text style={{ color: "#f5ede0", fontSize: 12, fontWeight: "600" }}>Use this</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── AI Chat Modal ────────────────────────────────────────────────────────────

function AIChatModal({
  visible,
  onClose,
  onApplyTemplate,
  userId,
}: {
  visible: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TemplateMatch) => void;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      text: "Hey! I'm your card assistant ✨ Tell me about the card you want to make — who's it for, what's the occasion?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleApplyTemplate = (template: TemplateMatch) => {
    onApplyTemplate(template);
    onClose();
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(`${FLASK_URL}/recommend-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          prompt: trimmed,
          user_id: session?.user?.id ?? userId,
          match_count: 1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json();
      if (!data.success) throw new Error(data.error ?? "Backend error");

      const suggestions: TemplateMatch[] = data.suggested_templates ?? [];
      const intent = data.design_intent ?? {};

      if (suggestions.length === 0) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "I couldn't find a matching template, but you can still build your card from scratch using the tools below! 🎨",
        }]);
      } else {
        const occasionNote = intent.occasion ? ` for a ${intent.occasion}` : "";
        const recipientNote = intent.recipient ? ` for ${intent.recipient}` : "";
        const topTemplate: TemplateMatch = {
          ...suggestions[0],
          custom_card_id: data.custom_card_id ?? undefined,
        };
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: `Here's a template that fits${occasionNote}${recipientNote} — tap "Use this" to load it onto your card!`,
          templatePreview: topTemplate,
        }]);
      }
    } catch (err: any) {
      const msg = err?.name === "AbortError"
        ? "This is taking too long. Try again!"
        : "Oops, something went wrong. Try again!";
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: msg,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <View style={{ maxWidth: "78%" }}>
          <View style={[styles.bubbleContent, isUser ? styles.userBubbleContent : styles.assistantBubbleContent]}>
            <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.assistantBubbleText]}>
              {item.text}
            </Text>
          </View>
          {!isUser && item.templatePreview && (
            <TemplateCard template={item.templatePreview} onApply={handleApplyTemplate} />
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalSheet}
        >
          <View style={styles.handleBar} />
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.sparkleIcon}>
                <Ionicons name="sparkles" size={16} color="#f5ede0" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Card Assistant</Text>
                <Text style={styles.modalSubtitle}>Powered by AI</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#5A390E" />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />

          {loading && (
            <View style={styles.typingRow}>
              <View style={styles.avatarDot}>
                <Ionicons name="sparkles" size={12} color="#f5ede0" />
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#8B6A3E" />
              </View>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask me anything about your card..."
              placeholderTextColor="#9a7a60"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              style={[styles.sendIconBtn, (!input.trim() || loading) && styles.sendIconBtnDisabled]}
              onPress={sendMessage}
              disabled={!input.trim() || loading}
            >
              <Ionicons name="arrow-up" size={18} color="#f5ede0" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
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

  const [userId, setUserId] = useState<string>("guest");
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.id) setUserId(data.session.user.id);
    });
  }, []);

  const STICKERS = [
    { id: "star", image: require("../../assets/images/star-sticker.png") },
    { id: "heart", image: require("../../assets/images/heart-sticker.png") },
    { id: "flower", image: require("../../assets/images/orange-flower-stamp.png") },
    { id: "strip", image: require("../../assets/images/photo-strip.png") },
    { id: "cake", image: require("../../assets/images/cake-sticker.png") },
    { id: "sun", image: require("../../assets/images/sun-sticker.png") },
    { id: "grass", image: require("../../assets/images/grass-sticker.png") },
    { id: "butterfly", image: require("../../assets/images/butterfly-sticker.png") },
    { id: "balloon", image: require("../../assets/images/balloon-sticker.png") },
    { id: "banner", image: require("../../assets/images/banner-sticker.png") },
    { id: "gradguy", image: require("../../assets/images/gradguy-sticker.png") },
    { id: "snowman", image: require("../../assets/images/snowman-sticker.png") },
    { id: "snowflake", image: require("../../assets/images/snowflake-sticker.png") },
  ];

  const COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];

  const updateItemColor = (id: string, color: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, color } : i)));
  };
  const handlePositionChange = (id: string, newX: number, newY: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, x: newX, y: newY } : i)));
  };
  const handleRotationChange = (id: string, newRotation: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, rotation: newRotation } : i)));
  };
  const handleScaleChange = (id: string, newScale: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, scale: newScale } : i)));
  };
  const handleContentChange = (id: string, newContent: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, content: newContent } : i)));
  };
  const handleFontChange = (id: string, font: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, font } : i)));
  };

  const addText = () => {
    const id = Date.now().toString();
    setItems((prev) => [...prev, {
      id, type: "text", content: "Tap to type...",
      x: 20, y: 20, color: "#5A390E",
      rotation: seededRotation(id), scale: 1,
    }]);
  };

  const addSticker = (stickerId: string) => {
    const id = Date.now().toString();
    setItems((prev) => [...prev, {
      id, type: "sticker", content: stickerId, sticker: stickerId,
      x: 30, y: 30, rotation: seededRotation(id), scale: 1,
    }]);
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
    const text = await res.text();
    const data = JSON.parse(text);
    setGifs(data.data || []);
  }

  const handleApplyTemplate = async (template: TemplateMatch) => {
    if (template.card_color) setCardColor(template.card_color);

    if (template.custom_card_id) {
      const { data: card } = await supabase
        .from("custom_cards")
        .select("*")
        .eq("id", template.custom_card_id)
        .single();

      if (card?.card_items) {
        const cardItems = JSON.parse(card.card_items);
        const newItems: Item[] = [];

        cardItems.texts?.forEach((raw: string, i: number) => {
          try {
            const parsed = JSON.parse(raw);
            const id = `tpl-text-${i}-${Date.now()}`;
            newItems.push({
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

        cardItems.stickers?.forEach((raw: string, i: number) => {
          try {
            const parsed = JSON.parse(raw);
            if (!parsed.image_url && !parsed.sticker) return;
            const id = `tpl-sticker-${i}-${Date.now()}`;
            newItems.push({
              id, type: "sticker",
              content: parsed.sticker ?? "",
              sticker: parsed.image_url || parsed.sticker,
              x: parsed.x ?? 30, y: parsed.y ?? 30,
              rotation: parsed.rotation ?? seededRotation(id),
              scale: parsed.scale ?? 1,
            });
          } catch {}
        });

        cardItems.gifs?.forEach((raw: string, i: number) => {
          try {
            const parsed = JSON.parse(raw);
            if (!parsed.sticker) return;
            const id = `tpl-gif-${i}-${Date.now()}`;
            newItems.push({
              id, type: "sticker",
              content: parsed.sticker ?? "",
              sticker: parsed.sticker,
              x: parsed.x ?? 30, y: parsed.y ?? 30,
              rotation: parsed.rotation ?? seededRotation(id),
              scale: parsed.scale ?? 1,
            });
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
      <AIChatModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onApplyTemplate={handleApplyTemplate}
        userId={userId}
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
                onFontChange={handleFontChange}
                accentColor="#8B6A3E"
                showControls={false}
              />
            ))}
          </View>

          <View style={styles.footerWrapper}>
            {activeTool && (
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
                            setItems((prev) => [...prev, {
                              id, type: "sticker", content: "",
                              x: 30, y: 30,
                              sticker: gif.images.fixed_height.url,
                              rotation: seededRotation(id), scale: 1,
                            }]);
                            setActiveTool(null);
                          }}
                        >
                          <Image
                            source={{ uri: gif.images.fixed_height.url }}
                            style={{ width: 100, height: 100, margin: 4, borderRadius: 8 }}
                          />
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
                        const result = await launchImageLibraryAsync({
                          mediaTypes: ["images"],
                          allowsEditing: true,
                          quality: 1,
                        });
                        if (!result.canceled) {
                          const id = Date.now().toString();
                          setItems((prev) => [...prev, {
                            id, type: "sticker", content: "",
                            x: 30, y: 30,
                            sticker: result.assets[0].uri,
                            rotation: seededRotation(id), scale: 1,
                          }]);
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
                // ── Selection toolbar — burgundy outline ──
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

                  <TouchableOpacity style={styles.toolButton} onPress={() => {
                    deleteItem(selectedId);
                    setSelectedId(null);
                  }}>
                    <Ionicons name="trash-outline" size={22} color="#7B1D1D" />
                  </TouchableOpacity>

                  <View style={styles.selDivider} />

                  <TouchableOpacity style={styles.toolButton} onPress={() => setSelectedId(null)}>
                    <Ionicons name="checkmark" size={24} color="#2C5F2E" />
                  </TouchableOpacity>
                </View>
              ) : (
                // ── Normal toolbar ──
                <View style={styles.toolbar}>
                  <Pressable
                    style={[styles.toolButton, activeTool === "background" && styles.activeToolBtn]}
                    onPress={() => setActiveTool(activeTool === "background" ? null : "background")}
                  >
                    <Ionicons name="color-palette-outline" size={24} color="#5A390E" />
                  </Pressable>

                  <Pressable
                    style={[styles.toolButton, activeTool === "text" && styles.activeToolBtn]}
                    onPress={() => setActiveTool(activeTool === "text" ? null : "text")}
                  >
                    <Ionicons name="text-outline" size={24} color="#5A390E" />
                  </Pressable>

                  <Pressable
                    style={[styles.toolButton, activeTool === "sticker" && styles.activeToolBtn]}
                    onPress={() => setActiveTool(activeTool === "sticker" ? null : "sticker")}
                  >
                    <Ionicons name="happy-outline" size={24} color="#5A390E" />
                  </Pressable>

                  <Pressable
                    style={[styles.toolButton, activeTool === "gif" && styles.activeToolBtn]}
                    onPress={() => { setActiveTool(activeTool === "gif" ? null : "gif"); searchGifs(""); }}
                  >
                    <Ionicons name="film-outline" size={24} color="#5A390E" />
                  </Pressable>

                  <Pressable
                    style={[styles.toolButton, activeTool === "photo" && styles.activeToolBtn]}
                    onPress={() => setActiveTool(activeTool === "photo" ? null : "photo")}
                  >
                    <Ionicons name="image-outline" size={24} color="#5A390E" />
                  </Pressable>
                </View>
              )}

              <TouchableOpacity
                style={styles.plusButton}
                activeOpacity={0.8}
                onPress={() => setAiModalVisible(true)}
              >
                <Image
                  source={require("../../assets/images/sparkle-chat.png")}
                  style={{ marginLeft: 2, width: 45, height: 45, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={() => router.push({
                  pathname: "/send-card",
                  params: { cardId: cardId ?? "" },
                } as any)}
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
  container: { flex: 1, backgroundColor: "#7a1a1a" },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    flex: 1, marginLeft: -5, fontSize: 28, fontWeight: "700",
    color: "#f5e8d8", textAlign: "center", fontFamily: "Calistoga",
  },
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
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  // ← applied on top of toolbar when item is selected
  toolbarSelected: {
    borderColor: "#7a1a1a",
    borderWidth: 1,
  },
  plusButton: {
    width: 40, height: 40, borderRadius: 25, backgroundColor: "#4A7568",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 5,
  },
  toolButton: { padding: 10, borderRadius: 20 },
  activeToolBtn: { backgroundColor: "rgba(90, 57, 14, 0.1)" },
  selBtnText: { fontSize: 22, color: "#5A390E", fontWeight: "700", lineHeight: 26 },
  selDivider: { width: 1, height: 22, backgroundColor: "#d7c3ac", marginHorizontal: 2 },
  panel: {
    backgroundColor: "#ede0cc", width: "90%", borderRadius: 20,
    padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#d7c3ac",
  },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  panelTitle: { fontWeight: "bold", fontSize: 12, color: "#5A390E" },
  colorRow: { flexDirection: "row", justifyContent: "center", gap: 15 },
  colorDot: { width: 35, height: 35, borderRadius: 18, borderWidth: 2, borderColor: "white" },
  activeColor: { borderColor: "#5A390E", transform: [{ scale: 1.1 }] },
  addTextButton: {
    backgroundColor: "#6D1B12", flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 25, marginTop: 10, elevation: 3,
  },
  buttonText: { color: "#F8E5CF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  stickerRow: { flexDirection: "row", gap: 12, paddingVertical: 4, paddingHorizontal: 8, alignItems: "center" },
  stickerThumb: { width: 55, height: 55, resizeMode: "contain" },
  compactStrip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 6 },
  stickerChip: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: "#fffaf4",
    borderWidth: 1, borderColor: "#d7c3ac", alignItems: "center", justifyContent: "center",
  },
  stickerThumbSmall: { width: 34, height: 34, resizeMode: "contain" },
  headerButtons: { flexDirection: "row", width: "85%", gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 20, borderWidth: 1,
    borderColor: "rgba(139,26,26,0.3)", alignItems: "center", backgroundColor: "#ede0cc",
  },
  cancelText: { color: "#8b1a1a", fontSize: 14 },
  sendBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: "#7a1a1a", alignItems: "center" },
  sendText: { color: "#f5ede0", fontSize: 14 },
  gifInput: {
    backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#c8b89a",
    borderRadius: 10, padding: 10, fontSize: 14, color: "#3a2010", marginBottom: 8,
  },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  modalSheet: {
    backgroundColor: "#fdf6ed", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: Platform.OS === "ios" ? 34 : 16, maxHeight: "95%",
  },
  handleBar: {
    width: 40, height: 4, backgroundColor: "#d7c3ac", borderRadius: 2,
    alignSelf: "center", marginTop: 10, marginBottom: 6,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: "#ede0cc", marginBottom: 5,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  sparkleIcon: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: "#4A7568",
    alignItems: "center", justifyContent: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#3a2010", fontFamily: "Calistoga" },
  modalSubtitle: { fontSize: 11, color: "#9a7a60", marginTop: 1 },
  closeBtn: { padding: 6, borderRadius: 20, backgroundColor: "#ede0cc" },
  messageList: { paddingHorizontal: 16, paddingTop: 12, gap: 10, paddingBottom: 20 },
  messageBubble: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 6 },
  userBubble: { justifyContent: "flex-end" },
  assistantBubble: { justifyContent: "flex-start" },
  avatarDot: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: "#4A7568",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  bubbleContent: {
    maxWidth: "78%", borderRadius: 18, paddingVertical: 10,
    paddingHorizontal: 14, marginBottom: 2,
  },
  userBubbleContent: { backgroundColor: "#7a1a1a", borderBottomRightRadius: 4 },
  assistantBubbleContent: { backgroundColor: "#ede0cc", borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userBubbleText: { color: "#f5ede0" },
  assistantBubbleText: { color: "#3a2010" },
  typingRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingBottom: 6 },
  typingBubble: { backgroundColor: "#ede0cc", borderRadius: 18, paddingVertical: 10, paddingHorizontal: 18 },
  inputRow: {
    flexDirection: "row", alignItems: "flex-end", gap: 8, paddingHorizontal: 16,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: "#ede0cc", paddingBottom: 30,
  },
  chatInput: {
    flex: 1, backgroundColor: "#ede0cc", borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: "#3a2010", maxHeight: 100,
  },
  sendIconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#7a1a1a",
    alignItems: "center", justifyContent: "center",
  },
  sendIconBtnDisabled: { backgroundColor: "#c8b89a" },
});
