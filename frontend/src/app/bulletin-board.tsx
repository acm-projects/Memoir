import React, { useState, useRef  } from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground, Image, TouchableOpacity,ScrollView,Platform,Keyboard, TouchableWithoutFeedback,TextInput,FlatList } from "react-native";
import { Modal } from "react-native";
import DraggableItem from "../components/draggableItem";
import BottomNavbar from '../components/BottomNavbar';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";



type Item = {
  id: string;
  type: "note" | "sticker" | "card";
  content: string;
  x: number;
  y: number;
  color?: string;
  sticker?: string;
  image?: any;
  noteBackground?: any;
};

export default function BulletinBoard() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gifs, setGifs] = useState<any[]>([]);
  const [gifSearch, setGifSearch] = useState("");
  const [items, setItems] = useState<Item[]>([
    {
      id: '2',
      type: 'card',
      content: 'card1',
      x: 30,
      y: 260,
      image: require('../../assets/images/cards.jpg'),
    },
    {
      id: '3',
      type: 'card',
      content: 'card2',
      x: 200,
      y: 400,
      image: require('../../assets/images/card2.jpg'),
    },
    {
      id: '4',
      type: 'card',
      content: 'card3',
      x: 60,
      y: 550,
      image: require('../../assets/images/card3.jpg'),
    },
  ]);

  const router = useRouter();
  const NOTE_COLORS = [
    "#FFF6A3",
    "#FFD6D6",
    "#D6F5FF",
    "#E6D6FF",
    "#D6FFD6"
  ];

  const NOTE_BACKGROUNDS = [
     { key: "GreenStickyNote", source: require("../../assets/images/sticker-greennote.png") },
  ];

  const STICKERS = [
    { key: "star", source: require("../../assets/images/star-stamp.png") },
    { key: "heart", source: require("../../assets/images/costa-rica-stamp.png") },
    { key: "flower", source: require("../../assets/images/Australia-Stamp.png") },
  ];

  

const onColorChange = (id: string, color: string) => {
  setItems(prev =>
    prev.map(item =>
      item.id === id ? { ...item, color } : item
    )
  );
};
const handlePositionChange = (id: string, newX: number, newY: number) => {
  setItems(prev =>
    prev.map(item =>
      item.id === id ? { ...item, x: newX, y: newY } : item
    )
  );
};

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [activeTab, setActiveTab] = useState<"note" | "sticker" | "photo" | "gif">("note");

  function addNote(color: string) {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        type: "note",
        content: "New note",
        x: 80,
        y: 100,
        color
      }
    ]);
    setShowColorPicker(false);
  }

  function addSticker(sticker: string) {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        type: "sticker",
        content: "",
        x: 150,
        y: 200,
        sticker
      }
    ]);
    setShowStickerPicker(false);
  }

  function deleteItem(id: string) {
    setItems(items.filter((item) => item.id !== id));
  }
  
  function changeColor(id: string) {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)] }
          : item
      )
    );
  }

  const { id, title } = useLocalSearchParams();
  async function pickImage() {
  if (Platform.OS === 'web') {
    fileInputRef.current && fileInputRef.current.click();
    return;
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission required.');
    return;
  }

  const res = await ImagePicker.launchImageLibraryAsync({
    quality: 0.8,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!res.canceled && res.assets && res.assets[0]?.uri) {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        type: "sticker",
        content: "",
        x: 100,
        y: 150,
        sticker: res.assets[0].uri,
      }
    ]);
    setShowAddSheet(false);
  }
}

function onPickFileWeb(e: any) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const uri = URL.createObjectURL(file);
  setItems([
    ...items,
    {
      id: Date.now().toString(),
      type: "sticker",
      content: "",
      x: 100,
      y: 150,
      sticker: uri,
    }
  ]);
  setShowAddSheet(false);
}

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
    <View style={styles.container}>
      {/* Top red banner */}
      <ImageBackground
        source={require('../../assets/images/RED swirl subtle.png')}
        style={styles.topBanner}
        imageStyle={{ resizeMode: 'cover' }}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.bannerBack}>
          <Text style={styles.bannerBackText}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.bannerTitle} numberOfLines={1}>
          {title}
        </Text>

        {/* Stamp top right */}
        <Image
          source={require('../../assets/images/star-stamp.png')}
          style={styles.bannerStamp}
        />
      </ImageBackground>

      <ImageBackground 
        source={require('../../assets/images/layered-vintage-paper.png')} 
        style={styles.paperBackground}
      > 
        {/* TOOLBAR */}
        <View style={styles.toolbar}>
          <Pressable style={styles.button} onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.buttonText}>{isEditing ? "Done" : "Edit"}</Text>
          </Pressable>
          {isEditing && (
            <Pressable style={[styles.plusButton, { marginLeft: 'auto' }]} onPress={() => setShowAddSheet(true)}>
              <Text style={styles.plusText}>+</Text>
            </Pressable>
          )}
        </View>

        {/* BOARD */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.board}
            contentContainerStyle={styles.boardContent}
            scrollEnabled={!isEditing}>
            {items.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                deleteItem={deleteItem}
                isEditing={isEditing}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onColorChange={onColorChange}
                onPositionChange={handlePositionChange}  
              />  
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* FLOATING COLOR PICKER */}
        {showColorPicker && (
          <View style={styles.floatingPicker}>
            {NOTE_COLORS.map((color) => (
              <Pressable
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }]}
                onPress={() => addNote(color)}
              />
            ))}
          </View>
        )}
        {showStickerPicker && (
              <View style={styles.StickerPicker}>
                {STICKERS.map((sticker: { key: string; source: any }) => (
                  <Pressable
                    key={sticker.key}
                    onPress={() => addSticker(sticker.key)}
                  >
                    <Image source={sticker.source} style={{ width: 50, height: 50 }} />
                  </Pressable>
                ))}
              </View>
            )}



        <Modal visible={showAddSheet} transparent animationType="slide">
          <View style={styles.modalContainer}>
  <Pressable style={styles.overlay} onPress={() => setShowAddSheet(false)} />
  <View style={styles.sheet}>
    
    
    {/* Tabs */}
    
    <View style={styles.tabs}>
      
      {["note", "sticker", "photo", "gif"].map((t) => (
  <Pressable key={t} style={styles.tab} onPress={() => {
    setActiveTab(t as any);
    if (t === "gif") searchGifs(""); // load trending immediately
  }}>
    <Text style={[styles.tabText, activeTab === t && styles.tabActive]}>
      {t.charAt(0).toUpperCase() + t.slice(1)}
    </Text>
  </Pressable>
))}
   
    </View>
    

    {/* Note tab */}
  {activeTab === "note" && (
  <ScrollView style={styles.tabContent}>
    <Text style={styles.hint}>Pick a style</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {NOTE_BACKGROUNDS.map((bg) => (
          <Pressable
            key={bg.key}
            onPress={() => {
              setItems([...items, {
                id: Date.now().toString(),
                type: "note",
                content: "",
                x: 80,
                y: 100,
                noteBackground: bg.source,
              }]);
              setShowAddSheet(false);
            }}
          >
            <Image source={bg.source} style={{ width: 70, height: 90, borderRadius: 8 }} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
       <Text style={styles.hint}>Or pick a color</Text>
    <View style={styles.colorsRow}>
      {NOTE_COLORS.map((color) => (
        <Pressable
          key={color}
          style={[styles.colorDot, { backgroundColor: color }]}
          onPress={() => { addNote(color); setShowAddSheet(false); }}
        />
      ))}
    </View>
  </ScrollView>
)}

    {/* Sticker tab */}
    {activeTab === "sticker" && (
     <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>Choose a stamp</Text>
        <View style={styles.stickersRow}>
          {STICKERS.map((s) => (
            <Pressable key={s.key} onPress={() => { addSticker(s.key); setShowAddSheet(false); }}>
              <Image source={s.source} style={{ width: 56, height: 56 }} />
            </Pressable>
          ))}
        </View>
       </ScrollView>
    )}

      

    {activeTab === "photo" && (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>

      <Text style={styles.uploadText}>Upload from Camera Roll</Text>
    </TouchableOpacity>

    {Platform.OS === 'web' && (
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onPickFileWeb}
      />
    )}
  </ScrollView>

)}

{activeTab === "gif" && (
  <View style={styles.tabContent}>
    <TextInput
      style={styles.input}
      placeholder="Search GIFs..."
      placeholderTextColor="#9a7a60"
      value={gifSearch}
      onChangeText={(text) => {
        setGifSearch(text);
        searchGifs(text);
      }}
      autoFocus
    />
    <FlatList
      data={gifs}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => {
          setItems(prev => [...prev, {
            id: Date.now().toString(),
            type: "sticker",
            content: "",
            x: 100,
            y: 150,
            sticker: item.images.fixed_height.url,
          }]);
          setShowAddSheet(false);
        }}>
          <Image
            source={{ uri: item.images.fixed_height.url }}
            style={{ width: 150, height: 150, margin: 15, borderRadius: 8 }}
          />
        </Pressable>
      )}
      showsVerticalScrollIndicator={false}/>
  </View>
)}

    </View>

  </View>
</Modal>
        


 



</ImageBackground> 
<BottomNavbar />

</View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3EE",
  },
  topBanner: {
    height: 150,
    width: '105%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  bannerBack: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(246,229,205,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bannerBackText: {
    fontSize: 20,
    color: '#F6E5CD',
  },
  bannerTitle: {
    flex: 1,
    fontSize: 24, // increased from 22
    fontWeight: '700',
    color: '#F6E5CD',
    fontFamily: 'Calistoga',
  },
  bannerStamp: {
    width: 110,
    height: 80,
    resizeMode: 'contain',
    marginLeft: 8,
    marginBottom: -10, // lower the stamp slightly
  },
  paperBackground:{ 
    flex: 1,  
    width: '100%', 
    height: '100%', 
    borderRadius:10,
  }, 
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  button: {
    backgroundColor: "#6D1B12",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 0,
  },
  buttonText:{
    color:"#FFFFFF",
    fontFamily: 'Inter',
    fontSize: 14,
  },
  board: {
    flex: 1,
  },
  boardContent: {
    height: 1500,
    paddingHorizontal: 8,
  },
  redSwirl:{ 
    height: 60, 
  }, 
    
    folderName:{
      fontFamily:'Calistoga',
      fontSize:32,
      color:'#6D1B12',
      textAlign:'left',
      paddingTop:20,

    },

    folderImage:{
      height:140,
      width:120,
      resizeMode:'cover'
      

    },
    colorPicker: {
      flexDirection: "row",
      justifyContent: 'flex-start',
      gap: 12,
      paddingVertical: 10
    },
    
    colorCircle: {
        width: 20,
        height: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc"
    },


    floatingPicker: {
      position: "absolute",
      top: 270,
      //alignSelf: "center",
      flexDirection: "row",
      gap: 12,
      backgroundColor: "white",
      padding: 10,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 6
    },

    StickerPicker: {
      position: "absolute",
      bottom: 100,
      alignSelf: "center",
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: 20,
      padding: 12,
      gap: 12,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },

   
    plusButton: {
      backgroundColor: "#6D1B12",
      width: 30,
      height: 30,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop:5,
    },
    plusText: {
      color: "#fff",
      fontSize: 24,
      lineHeight: 24,
  
    },
    addMenu: {
      position: "absolute",
      top: 110,
      right: 150,
      backgroundColor: "white",
      borderRadius: 14,
      padding: 8,
      gap: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      zIndex: 100,
    },
    menuItem: {
      padding: 10,
      borderRadius: 10,
    },
    menuText: {
      fontSize: 14,
      fontFamily: "Inter",
      color: "#333",
    },
  
    modalContainer: {
  flex: 1,
  justifyContent: "flex-end",  // pushes sheet to bottom
},

tabContent: {
  flex: 1,
  paddingVertical: 8,
},


overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
},
sheet: {
  backgroundColor: '#EDE8D9',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 16,
  paddingBottom: 40,
  height: '70%',
},

tabs: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderColor: '#D4C9A8',
  marginBottom: 16,
},
tab: { flex: 1, paddingVertical: 8, alignItems: "center" },
tabText: { fontSize: 13, color: '#8B7355', fontFamily: 'Inter' },
tabActive: { color: '#7B1D1D', fontWeight: '600' },

hint: {
  fontSize: 12,
  color: '#8B7355',
  fontFamily: 'Inter',
  marginBottom: 10,
},
colorsRow: { flexDirection: "row", gap: 10 },
colorDot: {
  width: 36,
  height: 36,
  borderRadius: 18,
  borderWidth: 1.5,
  borderColor: '#C8B89A',
},
stickersRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },


uploadArea: {
  borderWidth: 1.5,
  borderColor: '#C8B89A',
  borderStyle: 'dashed',
  borderRadius: 12,
  padding: 32,
  alignItems: 'center',
  gap: 10,
},

uploadText: {
  fontSize: 13,
  color: '#8B7355',
  fontFamily: 'Inter',
  textAlign: 'center',
},
input: {
  backgroundColor: '#EDE8D9',
  borderWidth: 1,
  borderColor: '#C8B89A',
  borderRadius: 10,
  padding: 12,
  fontSize: 14,
  color: '#3B2C1A',
  fontFamily: 'Inter',
  marginBottom: 12,
},
});

