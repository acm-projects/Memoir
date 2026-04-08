import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  PanResponder,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DraggableItem({
  item,
  deleteItem,
  isEditing,
  selectedId,
  setSelectedId,
  onColorChange,
  onPositionChange,
  onContentChange,
  onScaleChange,
  onRotationChange,
  onFontChange,
  accentColor,
}: any) {
  const [position, setPosition] = useState({
    x: item.x ?? 0,
    y: item.y ?? 0,
  });
  const [activeTab, setActiveTab] = useState<"color" | "font">("color");

  const isSelected = selectedId === item.id;

  const STICKERS: { [key: string]: any } = {
    strip: require("../../assets/images/photo-strip.png"),
    cake: require("../../assets/images/cake-sticker.png"),
    sun: require("../../assets/images/sun-sticker.png"),
    grass: require("../../assets/images/grass-sticker.png"),
    butterfly: require("../../assets/images/butterfly-sticker.png"),
    balloon: require("../../assets/images/balloon-sticker.png"),
    banner: require("../../assets/images/banner-sticker.png"),
    gradguy: require("../../assets/images/gradguy-sticker.png"),
    heart: require("../../assets/images/heart-sticker.png"),
    star: require("../../assets/images/star-sticker.png"),
    snowman: require("../../assets/images/snowman-sticker.png"),
    snowflake: require("../../assets/images/snowflake-sticker.png"),

  };

  const TEXT_COLORS = [
    "#5A390E",
    "#6D1B12",
    "#2C5F2E",
    "#1A1A2E",
    "#FF6B6B",
    "#000000",
  ];

  const FONTS = [
    { label: "Aa", value: "System" },
    { label: "Dc", value: "DancingScript_400Regular" },
    { label: "Pac", value: "Pacifico_400Regular" },
    { label: "Cav", value: "Caveat_400Regular" },
    { label: "Plf", value: "PlayfairDisplay_400Regular" },
  ];

  const currentScale = item.scale ?? 1;
  const currentRotation = item.rotation ?? 0;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_ , g) => !!isEditing && (Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4),
    onPanResponderMove: (_, gestureState) => {
      const newX = (item.x ?? 0) + gestureState.dx;
      const newY = (item.y ?? 0) + gestureState.dy;
      setPosition({ x: newX, y: newY });
    },
    onPanResponderRelease: (_, gestureState) => {
      const newX = (item.x ?? 0) + gestureState.dx;
      const newY = (item.y ?? 0) + gestureState.dy;
      setPosition({ x: newX, y: newY });
      onPositionChange?.(item.id, newX, newY);
    },
  });

  function renderControls() {
    if (!isSelected || !isEditing) return null;
    if (item.type !== "text") return null;

    return (
      <View style={styles.controlsCard}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "color" && styles.activeTab]}
            onPress={() => setActiveTab("color")}
          >
            <Ionicons
              name="color-palette-outline"
              size={14}
              color={activeTab === "color" ? "#fff" : "#5A390E"}
            />
            <Text style={[styles.tabLabel, activeTab === "color" && styles.activeTabLabel]}>
              Color
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "font" && styles.activeTab]}
            onPress={() => setActiveTab("font")}
          >
            <Ionicons
              name="text-outline"
              size={14}
              color={activeTab === "font" ? "#fff" : "#5A390E"}
            />
            <Text style={[styles.tabLabel, activeTab === "font" && styles.activeTabLabel]}>
              Font
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "color" && (
          <View style={styles.tabContent}>
            {TEXT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => onColorChange?.(item.id, color)}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  item.color === color && styles.activeColor,
                ]}
              />
            ))}
          </View>
        )}

        {activeTab === "font" && (
          <View style={styles.tabContent}>
            {FONTS.map((f) => (
              <TouchableOpacity
                key={f.value}
                onPress={() => onFontChange?.(item.id, f.value)}
                style={[
                  styles.fontChip,
                  (item.font === f.value || (!item.font && f.value === "System")) &&
                    styles.activeFontChip,
                ]}
              >
                <Text
                  style={[
                    styles.fontChipText,
                    f.value !== "System" && { fontFamily: f.value },
                    (item.font === f.value || (!item.font && f.value === "System")) &&
                      styles.activeFontChipText,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  function renderContent() {
    if (item.type === "sticker") {
      const isPhoto =
        typeof item.sticker === "string" &&
        (item.sticker.startsWith("file") || item.sticker.startsWith("http"));

      if (isPhoto) {
        return (
          <Image
            source={{ uri: item.sticker }}
            style={{ width: 120, height: 120, borderRadius: 8 }}
            resizeMode="cover"
          />
        );
      }

      const stickerSource = STICKERS[item.sticker];
      if (!stickerSource) return null;

      return (
        <Image
          source={stickerSource}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      );
    }

    if (item.type === "text") {
      const fontFamily =
        item.font && item.font !== "System" ? item.font : undefined;

      return (
        <View style={styles.textContainer}>
          <TextInput
            value={item.content}
            multiline
            editable={true}
            style={[
              styles.draggableText,
              { color: item.color || "#5A390E" },
              fontFamily && { fontFamily },
              !isSelected && { borderColor: "transparent" },
            ]}
            placeholder="Type here..."
            onFocus={() => setSelectedId(item.id)}
            onChangeText={(text) => onContentChange(item.id, text)}
          />
        </View>
      );
    }

    if (item.type === "note") {
      return (
        <ImageBackground
          source={item.noteBackground || null}
          style={[
            styles.note,
            {
              backgroundColor: item.noteBackground
                ? "transparent"
                : item.color || "#FFF6A3",
              borderColor: accentColor,
              borderWidth: 1.5,
            },
          ]}
          imageStyle={{ borderRadius: 10 }}
        >
          <TextInput
            value={item.content}
            onChangeText={(text) => onContentChange(item.id, text)}
            multiline
            style={styles.noteInput}
            placeholder="Write here..."
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </ImageBackground>
      );
    }

    if (item.type === "music") {
      return (
        <TouchableOpacity
          onPress={() => Linking.openURL(item.sticker!)}
          style={{
            backgroundColor: "#1DB954",
            borderRadius: 12,
            padding: 10,
            width: 140,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Image
            source={item.image}
            style={{ width: 40, height: 40, borderRadius: 6 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}
              numberOfLines={1}
            >
              {item.content}
            </Text>
            <Ionicons name="musical-notes" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  }

  return (
    <View style={{ position: "absolute", left: position.x, top: position.y }}>


      {/* Scaled/rotated content */}
      <View
        style={{
          transform: [
            { scale: currentScale },
            { rotate: `${currentRotation}deg` },
          ],
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedId(isSelected ? null : item.id)}
        >
          {renderContent()}
        </TouchableOpacity>
      </View>

      {/* Controls */}
      {renderControls()}
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    width: 140,
    minHeight: 100,
    borderRadius: 10,
    overflow: "hidden",
  },
  noteInput: {
    flex: 1,
    padding: 10,
    fontSize: 13,
    color: "#3a2010",
    minHeight: 100,
  },
  textContainer: {
    padding: 10,
    minWidth: 100,
    maxWidth: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  draggableText: {
    fontSize: 24,
    textAlign: "center",
    minHeight: 40,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(90, 57, 14, 0.2)",
    borderStyle: "dashed",
    borderRadius: 5,
  },

  // ── Tabbed controls card ──────────────────────────────────────────────────
  controlsCard: {
    marginTop: 8,
    backgroundColor: "#F8E5CF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d7c3ac",
    overflow: "hidden",
    minWidth: 220,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ede0cc",
    borderBottomWidth: 1,
    borderBottomColor: "#d7c3ac",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
  },
  activeTab: {
    backgroundColor: "#5A390E",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5A390E",
  },
  activeTabLabel: {
    color: "#fff",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  // ── Color dots ────────────────────────────────────────────────────────────
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "white",
  },
  activeColor: {
    borderColor: "#5A390E",
    transform: [{ scale: 1.2 }],
  },

  // ── Font chips ────────────────────────────────────────────────────────────
  fontChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fffaf4",
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },
  activeFontChip: {
    backgroundColor: "#5A390E",
    borderColor: "#5A390E",
  },
  fontChipText: {
    fontSize: 13,
    color: "#5A390E",
    fontWeight: "600",
  },
  activeFontChipText: {
    color: "#fff",
  },

  // ── Inline transform buttons (live in the tab bar row) ───────────────────
  inlineTransform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
  },
  inlineBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineBtnText: {
    fontSize: 16,
    color: "#5A390E",
    fontWeight: "700",
    lineHeight: 20,
  },
  barDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#d7c3ac",
    marginHorizontal: 4,
  },

  // ── Delete button ─────────────────────────────────────────────────────────
  deleteBtnStyle: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7B1D1D",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
