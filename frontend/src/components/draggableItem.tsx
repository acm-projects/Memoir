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
} from "react-native";

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
  accentColor,
}: any) {
  const [position, setPosition] = useState({
    x: item.x ?? 0,
    y: item.y ?? 0,
  });

  const isSelected = selectedId === item.id;

  const STICKERS: { [key: string]: any } = {
    star: require("../../assets/images/cat-stamp.png"),
    heart: require("../../assets/images/brasil-stamp.png"),
    flower: require("../../assets/images/orange-flower-stamp.png"),
    strip: require("../../assets/images/photo-strip.png"),
  };

  const TEXT_COLORS = [
    "#5A390E",
    "#6D1B12",
    "#2C5F2E",
    "#1A1A2E",
    "#FF6B6B",
    "#000000",
  ];

  const currentScale = item.scale ?? 1;
  const currentRotation = item.rotation ?? 0;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => !!isEditing && item.type !== "text",
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

    return (
      <View style={styles.controlsWrapper}>
        {item.type === "text" && (
          <View style={styles.colorPicker}>
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

        <View style={styles.transformRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() =>
              onScaleChange?.(item.id, Math.max(0.5, currentScale - 0.1))
            }
          >
            <Text style={styles.controlButtonText}>−</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() =>
              onScaleChange?.(item.id, Math.min(5, currentScale + 0.1))
            }
          >
            <Text style={styles.controlButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onRotationChange?.(item.id, currentRotation - 1)}
          >
            <Text style={styles.controlButtonText}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onRotationChange?.(item.id, currentRotation + 1)}
          >
            <Text style={styles.controlButtonText}>↻</Text>
          </TouchableOpacity>
        </View>
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
      return (
        <View style={styles.textContainer}>
          <TextInput
            value={item.content}
            multiline
            style={[styles.draggableText, { color: item.color || "#5A390E" }]}
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

    return null;
  }

  return (
  <View style={{ position: "absolute", left: position.x, top: position.y }}>
    
    {/* Delete button — outside scale so stays same size */}
    {isEditing && (
  <TouchableOpacity
    style={[
      styles.deleteBtnStyle,
      {
        top: -8,
        right: -8,
        transform: [{ translateX: (currentScale - 1) * 40 }, { translateY: -(currentScale - 1) * 40 }],
      },
    ]}
    onPress={() => deleteItem(item.id)}
  >
    <Text style={styles.deleteText}>✕</Text>
  </TouchableOpacity>
)}

    {/* Scaled/rotated content */}
    <View
      style={{
        transform: [
          { scale: currentScale },
          { rotate: `${currentRotation}deg` },
        ],
      }}
      {...(item.type !== "text" ? panResponder.panHandlers : {})}
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
  wrapper: {
    position: "absolute",
  },
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
  colorPicker: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F8E5CF",
    borderRadius: 20,
    padding: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  activeColor: {
    borderColor: "#5A390E",
    transform: [{ scale: 1.2 }],
  },
  controlsWrapper: {
    marginTop: 6,
    alignItems: "center",
  },
  transformRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    backgroundColor: "#F8E5CF",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },
  controlButton: {
    backgroundColor: "#fffaf4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },
  controlButtonText: {
    fontSize: 18,
    color: "#5A390E",
    fontWeight: "600",
  },
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