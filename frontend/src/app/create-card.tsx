import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image, FlatList, TextInput,TouchableWithoutFeedback, 
  Keyboard } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../components/BottomNavbar';
import BackButton from "../components/back-Button";
import DraggableItem from '../components/draggableItem'; 


type Item = {
  id: string;
  type: "text" | "sticker" | "photo";
  content: string;
  x: number;
  y: number;
  sticker?: string;
  image?: any;
  color?: string;
};


export default function CreateCard() {
    const [cardColor, setCardColor] = useState("#FFFFFF");
    const [items, setItems] = useState<Item[]>([]);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [gifs, setGifs] = useState<any[]>([]);
    const [gifSearch, setGifSearch] = useState("");

        const TEXT_COLORS = ["#5A390E", "#6D1B12", "#2C5F2E", "#1A1A2E", "#FF6B6B", "#000000"];
        const STICKERS = [
            { id: "star", image: require("../../assets/images/star-stamp.png") },
            { id: "heart", image: require("../../assets/images/costa-rica-stamp.png") },
            { id: "flower", image: require("../../assets/images/Australia-Stamp.png") },
            ];

        const updateItemColor = (id: string, color: string) => {
        setItems(items.map(i => i.id === id ? { ...i, color } : i));
        };
    
        const addText = () => {
        const newItem: Item = {
            id: Date.now().toString(),
            type: "text",
            content: "Tap to type...", // Default text
            x: 0,
            y: 0,
            color: "#5A390E", // Default text color
        };
        setItems([...items, newItem]);
        };
        const addSticker = (stickerId: string) => {
            const newItem: Item = {
                id: Date.now().toString(),
                type: "sticker",
                content: stickerId,
                sticker: stickerId,
                x: 0,
                y: 0,
            };
            setItems([...items, newItem]);
            };
    
      const COLORS = [
        "#FFF6A3",
        "#FFD6D6",
        "#D6F5FF",
        "#E6D6FF",
        "#D6FFD6"
      ];
    

      async function searchGifs(query: string) {
      const apiKey = process.env.EXPO_PUBLIC_GIPHY_KEY;
      const url = query
        ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=50`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=50`;
      
      const res = await fetch(url);
      const json = await res.json();
      setGifs(json.data);
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      {/* Full green swirl background */}
      <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/swirly-subtle.png')}
        style={styles.fullBackground}
        imageStyle={{ width: '100%', height: '100%' }}
      >
        {/* Header card (cream/paper colored) */}
        <View style={styles.headerCard}>
        <BackButton color="#557263" />
         <Text style = {styles.headerText}>Create a Card</Text>
         
          </View>

          <View style={[styles.cardPreview, { backgroundColor: cardColor }]}>
  
  {items.length === 0 && (
    <Text style={styles.previewText}>Card preview</Text>
  )}


  {items.map((item) => (
    <DraggableItem 
      key={item.id} 
      item={item} 
      isEditing={true} 
      deleteItem={(id: string) => setItems(items.filter(i => i.id !== id))}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
      onColorChange={updateItemColor}
    />
  ))}
</View>
         



        {/* ... Inside your return, after the cardPreview ... */}

<View style={styles.footerWrapper}>
  {/* The Panel - Only shows when a tool is active */}
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
  <View style={{ alignItems: 'center' }}> 
    <Text style={styles.panelTitle}>ADD TEXT</Text>
    <TouchableOpacity 
      style={styles.addTextButton} 
      onPress={addText}
    >
      <Ionicons name="add-circle-outline" size={20} color="#F8E5CF" />
      <Text style={styles.buttonText}>New Text Box</Text>
    </TouchableOpacity>
  </View>
)}
      {activeTool === "sticker" && (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stickerRow}>
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
      {gifs.map((item) => (
        <Pressable key={item.id} onPress={() => {
          setItems(prev => [...prev, {
            id: Date.now().toString(),
            type: "sticker",
            content: "",
            x: 0,
            y: 0,
            sticker: item.images.fixed_height.url,
          }]);
          setActiveTool(null);
        }}>
          <Image
            source={{ uri: item.images.fixed_height.url }}
            style={{ width: 100, height: 100, margin: 4, borderRadius: 8 }}
          />
        </Pressable>
      ))}
    </ScrollView>
  </View>
)}
    </View>
  )}

  {/* The Actual Toolbar */}
  <View style={styles.toolbar}>
   <Pressable 
  style={[styles.toolButton, activeTool === "background" && styles.activeToolBtn]} 
  onPress={() => setActiveTool(activeTool === "background" ? null : "background")}
>
  <Ionicons name="color-palette-outline" size={24} color="#5A390E" />
</Pressable>

<Pressable 
  style={styles.toolButton}
  onPress={addText}
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
  onPress={() => {
    setActiveTool(activeTool === "gif" ? null : "gif");
    searchGifs("");
  }}
>
  <Ionicons name="film-outline" size={24} color="#5A390E" />
</Pressable>

  </View>
 
   <View style={styles.headerButtons}>
  <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
    <Text style={styles.cancelText}>Cancel</Text>
  </TouchableOpacity>
 <TouchableOpacity style={styles.sendBtn} onPress={() => router.push("/send-card" as any)}>
    <Text style={styles.sendText}>Send</Text>
  </TouchableOpacity>
  </View>
  
  
</View>
          
          </ImageBackground>
          <BottomNavbar />
          </View>
          </View> 
          </TouchableWithoutFeedback>
          ); }


  const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fullBackground: {
    flex: 1,
    width: '100%',
  },

  // Cream header card at the top
  headerCard: {
    backgroundColor: '#F8E5CF',
    borderRadius: 18,
    marginHorizontal: 12,
    marginTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    zIndex: 10,
  },

  headerText: {
    paddingTop:5,
    fontFamily: 'Calistoga',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5A390E',
    textAlign:'center',
  },
  cardPreview: {
    width: "85%",
    height: 450,
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  previewText: {
    fontSize: 18,
    color: "#5A390E",
  },

  

  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  
  
  toolText: {
    fontSize: 11,
    marginTop: 4,
    color: "#5A390E",
  },

  footerWrapper: {
  position: "absolute",
  bottom: 80,
  left: 0,
  right: 0,
  alignItems: 'center',
  gap: 10, 
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F8E5CF", // Match your header theme
    height: 50,
    width: "85%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#d7c3ac",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,

  },
  toolButton: {
    padding: 10,
    borderRadius: 20,
  },
  activeToolBtn: {
    backgroundColor: 'rgba(90, 57, 14, 0.1)', // Subtle highlight
  },
  panel: {
    backgroundColor: "#F8E5CF",
    width: "90%",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10, // Space between panel and toolbar
    borderWidth: 1,
    borderColor: "#d7c3ac",
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  panelTitle: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#5A390E',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  colorDot: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'white',
  },
  activeColor: {
    borderColor: '#5A390E',
    transform: [{ scale: 1.1 }],
  },
  placeholderText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },

  addTextButton: {
    backgroundColor: "#6D1B12", // That deep red/brown you're using
    flexDirection: "row",       // Puts the icon and text side-by-side
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,           // Rounded "pill" shape
    marginTop: 10,
    // Add a shadow so it looks clickable
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  buttonText: {
    color: "#F8E5CF",           // Cream color to contrast the dark button
    fontSize: 16,
    fontFamily: "Calistoga",    // Using your header font for consistency
    fontWeight: "600",
    marginLeft: 8,              // Space between the icon and the text
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
  borderColor: "#5A390E",
  alignItems: "center",
  backgroundColor: "#F8E5CF",
},
cancelText: {
  color: "#5A390E",
  fontFamily: "Calistoga",
  fontSize: 14,
},
sendBtn: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 20,
  backgroundColor: "#6D1B12",
  alignItems: "center",
},
sendText: {
  color: "#F8E5CF",
  fontFamily: "Calistoga",
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
  fontFamily: "Inter",
  marginBottom: 8,
},
});

