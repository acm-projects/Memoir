import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground,Image } from "react-native";
import DraggableItem from "../components/draggableItem";
import BottomNavbar from '../components/BottomNavbar';
import { useLocalSearchParams } from "expo-router";
import BackButton from "../components/back-Button";


type Item = {
  id: string;
  type: "note" | "sticker" | "card";
  content: string;
  x: number;
  y: number;
  color?: string;
  sticker?: string;
};

export default function BulletinBoard() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      type: "card",
      content: "My Memory Card",
      x: 120,
      y: 120,
    },
  ]);

  const NOTE_COLORS = [
    "#FFF6A3",
    "#FFD6D6",
    "#D6F5FF",
    "#E6D6FF",
    "#D6FFD6"
  ];

  const STICKERS = [
    { key: "star", source: require("../../assets/images/star-stamp.png") },
  { key: "heart", source: require("../../assets/images/costa-rica-stamp.png"), },
  { key: "flower", source: require("../../assets/images/Australia-Stamp.png") },
    ];

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

  return (
    <View style={styles.container}>
      <ImageBackground 

        source = {require('../../assets/images/vintage-paper-background.png')} 

style={styles.paperBackground}> 

<ImageBackground 

source = {require('../../assets/images/RED swirl subtle.png')} 

imageStyle={styles.redSwirl}> 
</ImageBackground> 
    <BackButton />
    <View style = {{ flexDirection: 'row' , padding:5, alignItems: "flex-end",marginTop:50, justifyContent: "space-between"}}>
      <Text style = {styles.folderName}>{title}</Text>
      <Image source = {require('../../assets/images/star-stamp.png')} 
      style = {styles.folderImage}
      />
      


      </View>
      
      {/* TOOLBAR */}
      <View style={styles.toolbar}>
      <Pressable style={styles.button} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.buttonText}>{isEditing ? "Done" : "Edit"}</Text>
      </Pressable>
      <Pressable style={styles.plusButton} onPress={() => setShowMenu(!showMenu)}>
        <Text style={styles.plusText}>+</Text>
        </Pressable>
      </View>



      {showMenu && (
        <View style={styles.addMenu}>
          <Pressable style={styles.menuItem} onPress={() => { setShowColorPicker(true); setShowMenu(false); }}>
            <Text style={styles.menuText}>Add Note</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={() => { setShowStickerPicker(true); setShowMenu(false); }}>
            <Text style={styles.menuText}>Add Sticker</Text>
          </Pressable>
          {/*<Pressable style={styles.menuItem} onPress={() => { pickImage(); setShowMenu(false); }}>
            <Text style={styles.menuText}>Upload Photo</Text>
          </Pressable>*/}
        </View>
      )}

      

      {/* BOARD */}
      <View style={styles.board}>
        {items.map((item) => (
          <DraggableItem key={item.id} item={item}  deleteItem={deleteItem} isEditing={isEditing} />
        ))}

      </View>

          {isEditing && (
            <View style={styles.trashZone}>
              <Text style={styles.trashText}>🗑 Drop to delete</Text>
            </View>
          )}

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
              {STICKERS.map((sticker) => (
                <Pressable
                  key={sticker.key}
                  onPress={() => addSticker(sticker.key)}
                >
                  <Image source={sticker.source} style={{ width: 50, height: 50 }} />
                </Pressable>
              ))}
            </View>
          )}
      


      

 

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

  toolbar: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    
  },

  button: {
    backgroundColor: "#6D1B12",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  buttonText:{
    color:"#FFFFFF",
    fontFamily: 'Inter',
    fontSize: 14,

  },

  board: {
    flex: 1,
  },

  redSwirl:{ 

    height: 60, 
    }, 
    
    paperBackground:{ 
    flex: 1,  
    width: '100%', 
    height: '100%', 
    }, 

    folderName:{
      fontFamily:'Calistoga',
      fontSize:32,
      color:'#6D1B12',
      textAlign:'left',

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

    trashZone: {
      position: "absolute",
      bottom: 70,
      width: "100%",
      height: 70,
      backgroundColor: "rgba(255,80,80,0.3)",
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "red",
      borderStyle: "dashed",
    },
    trashText: {
      fontSize: 16,
      color: "red",
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
});


 