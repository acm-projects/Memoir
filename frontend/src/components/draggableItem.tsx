import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

export default function DraggableItem({
  item,
  deleteItem,
  isEditing,
  selectedId,
  setSelectedId,
  onColorChange,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  accentColor,
  onContentChange,
  boardWidth = 0,
  boardHeight = 1500,
  showControls = true,
}: any) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const safeX        = typeof item.x        === "number" && !isNaN(item.x)        ? item.x        : 0;
  const safeY        = typeof item.y        === "number" && !isNaN(item.y)        ? item.y        : 0;
  const safeId       = item.id != null      ? item.id       : "0";
  const safeRotation = typeof item.rotation === "number" && !isNaN(item.rotation) ? item.rotation : 0;
  const safeScale    = typeof item.scale    === "number" && !isNaN(item.scale)    ? item.scale    : 1;

  const x             = useSharedValue(safeX);
  const y             = useSharedValue(safeY);
  const scale         = useSharedValue(safeScale);
  const rotation      = useSharedValue(safeRotation);
  const startX        = useSharedValue(0);
  const startY        = useSharedValue(0);
  const startRotation = useSharedValue(safeRotation);
  const startScale    = useSharedValue(safeScale);

  useEffect(() => { scale.value = safeScale; }, [item.scale]);
  useEffect(() => { rotation.value = safeRotation; }, [item.rotation]);

  const isSelected    = selectedId === item.id;
  const isTextEditing = isSelected && item.type === "text";

  const ITEM_WIDTH  = 160;
  const ITEM_HEIGHT = 160;
  const MIN_SCALE   = 0.5;
  const MAX_SCALE   = 2.5;

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

  // ── zIndex: text always layers above stickers ──
  let zIndex: number;
  if (isDragging) {
    zIndex = 200;
  } else if (isSelected) {
    zIndex = item.type === "text" ? 150 : 100;
  } else if (item.type === "text") {
    zIndex = 20;
  } else {
    zIndex = 1;
  }

  const scaleBoost = isDragging ? 1.04 : 1;

  // ── All gestures disabled while a text item is being edited ──

  const pan = Gesture.Pan()
    .enabled(!!isEditing && !isTextEditing)
    .onBegin(() => {
      if (!isEditing) return;
      runOnJS(setIsDragging)(true);
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((event) => {
      if (!isEditing) return;
      let newX = startX.value + event.translationX;
      let newY = startY.value + event.translationY;
      if (boardWidth && boardHeight) {
        const scaledW = ITEM_WIDTH  * scale.value;
        const scaledH = ITEM_HEIGHT * scale.value;
        newX = Math.max(0, Math.min(newX, boardWidth  - scaledW));
        newY = Math.max(0, Math.min(newY, boardHeight - scaledH));
      }
      x.value = newX;
      y.value = newY;
      if (onPositionChange) runOnJS(onPositionChange)(safeId, newX, newY);
    })
    .onEnd(() => {
      if (!isEditing) return;
      runOnJS(setIsDragging)(false);
      if (onPositionChange) runOnJS(onPositionChange)(safeId, x.value, y.value);
    });

  const rotationGesture = Gesture.Rotation()
    .enabled(!!isEditing && !isTextEditing)
    .onBegin(() => { if (!isEditing) return; startRotation.value = rotation.value; })
    .onUpdate((event) => {
      if (!isEditing) return;
      const newDeg = startRotation.value + (event.rotation * 180) / Math.PI;
      rotation.value = newDeg;
      if (onRotationChange) runOnJS(onRotationChange)(safeId, newDeg);
      if (onPositionChange) runOnJS(onPositionChange)(safeId, x.value, y.value);
    })
    .onEnd(() => {
      if (!isEditing) return;
      if (onRotationChange) runOnJS(onRotationChange)(safeId, rotation.value);
      if (onPositionChange) runOnJS(onPositionChange)(safeId, x.value, y.value);
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(!!isEditing && !isTextEditing)
    .onBegin(() => { if (!isEditing) return; startScale.value = scale.value; })
    .onUpdate((event) => {
      if (!isEditing) return;
      const nextScale = clamp(startScale.value * event.scale, MIN_SCALE, MAX_SCALE);
      scale.value = nextScale;
      const scaledWidth  = ITEM_WIDTH  * nextScale;
      const scaledHeight = ITEM_HEIGHT * nextScale;
      let newX = x.value;
      let newY = y.value;
      if (boardWidth && boardHeight) {
        newX = clamp(newX, 0, Math.max(0, boardWidth  - scaledWidth));
        newY = clamp(newY, 0, Math.max(0, boardHeight - scaledHeight));
      }
      x.value = newX;
      y.value = newY;
      if (onScaleChange)    runOnJS(onScaleChange)(safeId, nextScale);
      if (onPositionChange) runOnJS(onPositionChange)(safeId, newX, newY);
    })
    .onEnd(() => {
      if (!isEditing) return;
      if (onScaleChange)    runOnJS(onScaleChange)(safeId, scale.value);
      if (onPositionChange) runOnJS(onPositionChange)(safeId, x.value, y.value);
    });

  const tap = Gesture.Tap()
    .enabled(!isTextEditing)
    .onEnd(() => {
      runOnJS(setSelectedId)(selectedId === item.id ? null : item.id);
    });

  const gesture = Gesture.Simultaneous(pan, rotationGesture, pinchGesture, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value * scaleBoost },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  // ─── Content renderers ────────────────────────────────────────────────────

  function renderContent() {
    if (item.type === "card") {
      if (item.image) {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: "/one-specific-card" as any,
              params: { id: item.cardId || item.id, title: item.content, caption: "" },
            })}
          >
            <Image source={item.image} style={{ width: 120, height: 160, borderRadius: 8 }} resizeMode="cover" />
          </TouchableOpacity>
        );
      }
      return <View style={styles.card}><Text>{item.content ?? ""}</Text></View>;
    }

    if (item.type === "gif") {
      return <Image source={{ uri: item.sticker }} style={{ width: 120, height: 120, borderRadius: 8 }} resizeMode="contain" />;
    }

    if (item.type === "sticker") {
      const isUrl = item.sticker?.startsWith("file") || item.sticker?.startsWith("http") || item.sticker?.startsWith("https");
      if (isUrl) {
        return <Image source={{ uri: item.sticker }} style={{ width: 120, height: 120, borderRadius: 8 }} resizeMode="contain" />;
      }
      return null;
    }

    if (item.type === "music") {
      return (
        <View style={{ width: 120, alignItems: "center" }}>
          {item.sticker ? (
            <Image source={{ uri: item.sticker }} style={{ width: 80, height: 80, borderRadius: 10 }} resizeMode="cover" />
          ) : (
            <View style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: "#d7c3ac" }} />
          )}
          <Text style={{ fontSize: 10, fontWeight: "600", color: "#3D2B1F", textAlign: "center", marginTop: 5, lineHeight: 13 }} numberOfLines={2}>
            {item.content ?? ""}
          </Text>
          <Text style={{ fontSize: 9, color: "#7A5C3E", textAlign: "center", marginTop: 2 }} numberOfLines={1}>
            {item.artistName ?? ""}
          </Text>
        </View>
      );
    }

    if (item.type === "note") {
      return (
        <ImageBackground
          source={item.noteBackground || null}
          style={[styles.note, { backgroundColor: item.noteBackground ? "transparent" : item.color || "#FFF6A3" }, { borderColor: accentColor, borderWidth: 1.5 }]}
          imageStyle={{ borderRadius: 10 }}
        >
          <TextInput
            value={item.content}
            onChangeText={(text) => onContentChange(item.id, text)}
            multiline
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            style={styles.noteInput}
            placeholder="Write here..."
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </ImageBackground>
      );
    }

    if (item.type === "text") {
      return (
        <View style={styles.textContainer}>
          <TextInput
            value={item.content}
            multiline
            editable={isSelected}
            style={[
                styles.draggableText,
                { color: item.color || "#5A390E" },
                item.font ? { fontFamily: item.font } : {},  // ← add this
                !isSelected && { borderColor: "transparent" },
              ]}
            placeholder="Type here..."
            onChangeText={(text) => onContentChange(item.id, text)}
          />
        </View>
      );
    }

    return null;
  }

  function renderPin() {
    const isThumbtack = item.id.charCodeAt(0) % 2 === 0;
    const pinSize = 14;
    const pinColor = accentColor;

    if (!isThumbtack) {
      return (
        <View style={{ position: "absolute", top: -10, alignSelf: "center", zIndex: 12 }}>
          <View style={{ width: pinSize, height: pinSize, borderRadius: pinSize / 2, backgroundColor: pinColor, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.7)" }} />
          </View>
        </View>
      );
    }

    return (
      <View style={{ position: "absolute", top: -10, alignSelf: "center", zIndex: 12, alignItems: "center" }}>
        <View style={{ width: pinSize, height: pinSize, borderRadius: pinSize / 2, backgroundColor: pinColor }} />
        <View style={{ width: 3, height: 8, borderRadius: 2, backgroundColor: pinColor, marginTop: -2 }} />
      </View>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, { zIndex }]}>
        <View>
          {showControls && renderPin()}
          {showControls && isEditing && (
            <TouchableOpacity style={styles.deleteBtnStyle} onPress={() => deleteItem(item.id)}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          )}
          {renderContent()}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  note: { width: 140, minHeight: 100, borderRadius: 10, overflow: "hidden" },
  noteInput: { flex: 1, padding: 10, fontSize: 13, color: "#3a2010", fontFamily: "Inter", minHeight: 100 },
  card: { width: 160, height: 120, backgroundColor: "#fff", borderRadius: 14, padding: 12 },
  textContainer: { padding: 10, minWidth: 100, maxWidth: 250, justifyContent: "center", alignItems: "center" },
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
  deleteBtnStyle: {
    position: "absolute", top: -8, right: -8, width: 22, height: 22,
    borderRadius: 11, backgroundColor: "#7B1D1D", alignItems: "center",
    justifyContent: "center", zIndex: 20, borderWidth: 2, borderColor: "#fff",
  },
});
