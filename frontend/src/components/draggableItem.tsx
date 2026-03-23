import React from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity,Keyboard, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS
} from "react-native-reanimated";

export default function DraggableItem({ item, deleteItem, isEditing}: any){
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

  const TRASH_ZONE_Y = 300;
  

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
    if (y.value > TRASH_ZONE_Y) {
      runOnJS(deleteItem)(item.id);
    }
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
    .onEnd(() => {
      deleteItem(item.id);
    });

    

    const gesture = Gesture.Simultaneous(
      pan,
      pinch,
      rotate,
      longPress,
      
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
    item.sticker?.startsWith("file")

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
  }

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
});