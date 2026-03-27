import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, ImageBackground, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";


export default function DraggableItem({ item, deleteItem, isEditing, selectedId, setSelectedId, onColorChange, onPositionChange, onRotationChange, accentColor, caption, onCaptionChange, onContentChange, boardWidth = 0, boardHeight = 0 }: any) {

  const confirmDelete = () => {
  Alert.alert(
    "Delete Item",
    "Are you sure you want to delete this?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteItem(item.id) },
    ]
  );
};


  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);

  // Washi tape logic
  const showTape = parseInt(item.id) % 3 !== 0;
  const tapeColors = ["#557263", "#8B6A3E", "#6B4F6B", "#4A6741"];
  const tapeColor = tapeColors[parseInt(item.id) % tapeColors.length];
  const tapeRotation = ((parseInt(item.id) % 17) - 8) + 'deg';

  // Pin style logic
  const isThumbtack = parseInt(item.id) % 2 === 0;
  const pinSize = 14;
  const pinColor = accentColor;

  // Defensive: Ensure item.x, item.y, item.id are valid
  const safeX = typeof item.x === 'number' && !isNaN(item.x) ? item.x : 0;
  const safeY = typeof item.y === 'number' && !isNaN(item.y) ? item.y : 0;
  const safeId = item.id != null ? item.id : '0';
  if (typeof item.x !== 'number' || typeof item.y !== 'number' || item.id == null) {
    console.warn('DraggableItem: Invalid item data', item);
  }

  const x = useSharedValue(safeX);
  const y = useSharedValue(safeY);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(item.rotation || 0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startRotation = useSharedValue(item.rotation || 0);

  const COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];
  const STICKERS : { [key: string]: any } = {
    star: require("../../assets/images/star-stamp.png"),
    heart: require("../../assets/images/costa-rica-stamp.png"),
    flower:require("../../assets/images/Australia-Stamp.png")

  };

  const TEXT_COLORS = ["#5A390E", "#6D1B12", "#2C5F2E", "#1A1A2E", "#FF6B6B", "#000000"];
  const isSelected = selectedId === item.id;

  const ITEM_WIDTH = 160; // max width of card/note
  const ITEM_HEIGHT = 160; // max height of card/note

  const pan = Gesture.Pan()
    .enabled(!!isEditing)
    .onBegin(() => {
      if (!isEditing) return;
      try {
        runOnJS(setIsDragging)(true);
        startX.value = x.value;
        startY.value = y.value;
      } catch (e) {
        console.warn('Pan begin error', e);
      }
    })
    .onUpdate((event) => {
      if (!isEditing) return;
      try {
        let newX = startX.value + event.translationX;
        let newY = startY.value + event.translationY;
        // Clamp to board bounds if provided
        if (boardWidth && boardHeight) {
          newX = Math.max(0, Math.min(newX, boardWidth - ITEM_WIDTH));
          newY = Math.max(0, Math.min(newY, boardHeight - ITEM_HEIGHT));
        }
        x.value = newX;
        y.value = newY;
        if (onPositionChange) {
          runOnJS(onPositionChange)(safeId, newX, newY);
          }
      } catch (e) {
        // Fix lint error: always stringify error
        console.warn('Pan update error', String(e));
      }
    })
    .onEnd(() => {
      if (!isEditing) return;
      try {
        runOnJS(setIsDragging)(false);
      } catch (e) {
        console.warn('Pan end error', e);
      }
    });

  const rotationGesture = Gesture.Rotation()
    .enabled(!!isEditing)
    .onBegin(() => {
      if (!isEditing) return;
      startRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      if (!isEditing) return;
      const newDeg = startRotation.value + (event.rotation * 180 / Math.PI);
      rotation.value = newDeg;
      runOnJS(onRotationChange)(item.id, newDeg);
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(setSelectedId)(selectedId === item.id ? null : item.id);
  });

  const gesture = Gesture.Simultaneous(pan, rotationGesture, tap);

  // Layered depth shadow/zIndex
  let zIndex = 1, shadowOpacity = 0.35, shadowRadius = 8, elevation = 8, scaleVal = 1;
  if (isDragging) {
    zIndex = 100; shadowOpacity = 0.55; shadowRadius = 16; elevation = 16; scaleVal = 1.04;
  } else if (selectedId === item.id) {
    zIndex = 50; shadowOpacity = 0.4; shadowRadius = 10; elevation = 10;
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scaleVal },
      { rotate: `${rotation.value}deg` },
    ]
  }));

  function renderPin() {
    if (!isThumbtack) {
      // Round pin
      return (
        <View style={{ position: 'absolute', top: -10, alignSelf: 'center', zIndex: 12 }}>
          <View style={{ width: pinSize, height: pinSize, borderRadius: pinSize / 2, backgroundColor: pinColor, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.7)' }} />
          </View>
        </View>
      );
    } else {
      // Thumbtack
      return (
        <View style={{ position: 'absolute', top: -10, alignSelf: 'center', zIndex: 12, alignItems: 'center' }}>
          <View style={{ width: pinSize, height: pinSize, borderRadius: pinSize / 2, backgroundColor: pinColor }} />
          <View style={{ width: 3, height: 8, borderRadius: 2, backgroundColor: pinColor, marginTop: -2 }} />
        </View>
      );
    }
  }

  function renderWashiTape() {
    if (!showTape) return null;
    return (
      <View style={{ position: 'absolute', top: -14, alignSelf: 'center', width: 48, height: 14, opacity: 0.65, borderRadius: 2, flexDirection: 'row', transform: [{ rotate: tapeRotation }], zIndex: 20 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={{ width: 8, height: '100%', backgroundColor: i % 2 === 0 ? tapeColor : tapeColor, opacity: i % 2 === 0 ? 1 : 0.4, borderRadius: 1 }} />
        ))}
      </View>
    );
  }

  function renderContent() {
    // Restore original card/photo rendering
    if (item.type === "card") {
      if (item.image) {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push({
                pathname: "/one-specific-card" as any,
                params: {
                  image: item.content, // 'card1', 'card2', 'card3'
                  title: item.content,
                  caption: "",
                },
              });
            }}
          >
            <Image
              source={item.image}
              style={{ width: 120, height: 160, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={styles.card}>
            <Text>{item.content}</Text>
          </View>
        );
      }
    }
    if (item.type === "sticker") {
      const isPhoto = item.sticker?.startsWith("file") || item.sticker?.startsWith("http");
      if (isPhoto) {
        return (
          <Image
            source={{ uri: item.sticker }}
            style={{ width: 120, height: 120, borderRadius: 8 }}
            resizeMode="cover"
          />
        );
      }
      return (
        <Image
          source={STICKERS[item.sticker]}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      );
    }
    if (item.type === "note") {
  return (
    <ImageBackground
      source={item.noteBackground || null}
      style={[
        styles.note,
        { backgroundColor: item.noteBackground ? "transparent" : (item.color || "#FFF6A3") },
        { borderColor: accentColor, borderWidth: 1.5 },
      ]}
      imageStyle={{ borderRadius: 10 }}
    >
      <TextInput
        defaultValue={item.content}
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


    if (item.type === "card") {
      if (item.image) {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push({
                pathname: "/one-specific-card" as any,
                params: {
                  image: item.content, // 'card1', 'card2', 'card3'
                  title: item.content,
                  caption: "",
                },
              });
            }}
          >
            <Image
              source={item.image}
              style={{ width: 120, height: 160, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={[styles.card]}>
            <Text>{item.content}</Text>
          </View>
        );
      }
    }
    if (item.type === "sticker") {
 const isPhoto = 
    item.sticker?.startsWith("file") || item.sticker?.startsWith("http")

  if (isPhoto) {
    return (
      <Image
        source={{ uri: item.sticker }}
        style={{ width: 120, height: 120, borderRadius: 8 }}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      source={STICKERS[item.sticker]}
      style={{ width: 80, height: 80 }}
      resizeMode="contain"
    />
  );
}

 if (item.type === "text") {
  return (
    <View>
      <View style={styles.textContainer}>
        <TextInput
          defaultValue={item.content}
          multiline
          style={[styles.draggableText, { color: item.color || "#5A390E" }]}
          placeholder="Type here..."
          onChangeText={(text) => onContentChange(item.id, text)}
        />
      </View>
      {/* Color picker appears above the text box when selected */}
      {isSelected && (
        <View style={styles.colorPicker}>
          {TEXT_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => onColorChange(item.id, color)}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                item.color === color && styles.activeColor
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}}

  

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, { zIndex, shadowColor: '#000', shadowOpacity, shadowRadius, elevation }]}> 
        {renderWashiTape()}
        {renderPin()}
        {/* Delete button (edit mode) */}
        {isEditing && (
          <TouchableOpacity style={styles.deleteBtnStyle} onPress={() => deleteItem(item.id)}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>✕</Text>
          </TouchableOpacity>
        )}
        {renderContent()}
      </Animated.View>
    </GestureDetector>
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
  fontFamily: "Inter",
  minHeight: 100,
},

  sticker: {
    fontSize: 40,
  },

  card: {
    width: 160,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  textContainer: {
    padding: 10,
    minWidth: 100,
    maxWidth: 250, // Prevent it from going off-screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  draggableText: {
    fontSize: 24,
    fontFamily: "Calistoga", // Or your preferred font
    textAlign: 'center',
    minHeight: 40,
    padding: 5,
    // Add a slight border only when editing so the user knows where the box is
    borderWidth: 1,
    borderColor: 'rgba(90, 57, 14, 0.2)', 
    borderStyle: 'dashed',
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
deleteBtnStyle: {
  position: 'absolute' as const,
  top: -8,
  right: -8,
  width: 22,
  height: 22,
  borderRadius: 22 / 2,
  backgroundColor: '#7B1D1D',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  zIndex: 20,
  borderWidth: 2,
  borderColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.18,
  shadowRadius: 2,
  elevation: 2,
},
});