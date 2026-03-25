import React from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity,Keyboard, ImageBackground,Alert } from "react-native";
import { useRouter } from "expo-router";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS
} from "react-native-reanimated";

export default function DraggableItem({ item, deleteItem, isEditing, selectedId, setSelectedId, onColorChange, onPositionChange}: any){

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

  const x = useSharedValue(item.x);
  const y = useSharedValue(item.y);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const COLORS = ["#FFF6A3", "#FFD6D6", "#D6F5FF", "#E6D6FF", "#D6FFD6"];
  const STICKERS : { [key: string]: any } = {
    star: require("../../assets/images/star-stamp.png"),
    heart: require("../../assets/images/costa-rica-stamp.png"),
    flower:require("../../assets/images/Australia-Stamp.png")

  };

  const TEXT_COLORS = ["#5A390E", "#6D1B12", "#2C5F2E", "#1A1A2E", "#FF6B6B", "#000000"];
  const isSelected = selectedId === item.id;

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(setSelectedId)(isSelected ? null : item.id);
  });

 
  

  const pan = Gesture.Pan()
  .enabled(isEditing)
  .onBegin(() => {
    startX.value = x.value;
    startY.value = y.value;
  })
  .onUpdate((event) => {
    x.value = startX.value + event.translationX;
    y.value = startY.value + event.translationY;
  })
  .onEnd(() => {
    runOnJS(onPositionChange)(item.id, x.value, y.value); // 👈 save it
  });
    
    const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation;
    });

    const longPress = Gesture.LongPress()
  .enabled(isEditing)
  .onEnd(() => {
    runOnJS(confirmDelete)();
  });

    

    const gesture = Gesture.Simultaneous(
      pan,
      pinch,
      rotate,
      longPress,
      tap
      
    );

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` }
    ]
  }));

  function renderContent() {
     if (item.type === "note") {
  return (
    <ImageBackground
      source={item.noteBackground || null}
      style={[
        styles.note,
        { backgroundColor: item.noteBackground ? "transparent" : (item.color || "#FFF6A3") }
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
          <View style={styles.card}>
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
          onChangeText={(text) => { item.content = text; }}
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
      <Animated.View style={animatedStyle}>
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
});