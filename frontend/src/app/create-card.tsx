import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import FolderItem from '../components/folder-item';
import BottomNavbar from '../components/BottomNavbar';
import BackButton from "../components/back-Button";

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


export default function createCard() {
    const [cardColor, setCardColor] = useState("#FFFFFF");
    const [items, setItems] = useState<Item[]>([]);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    
      const COLORS = [
        "#FFF6A3",
        "#FFD6D6",
        "#D6F5FF",
        "#E6D6FF",
        "#D6FFD6"
      ];
  return (
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
          <Text style={styles.previewText}> card preview</Text>
        </View>
         



          <View style={styles.wrapper}>
      <View style={styles.toolbar}>
        <Pressable style={styles.toolButton} onPress={() => setActiveTool("background")}>
          <Ionicons name="color-palette-outline" size={22} color="#5A390E" />
         
        </Pressable>

        <Pressable style={styles.toolButton} onPress={() => setActiveTool("text")}>
          <Ionicons name="text-outline" size={22} color="#5A390E" />
          
        </Pressable>

        <Pressable style={styles.toolButton} onPress={() => setActiveTool("sticker")}>
          <Ionicons name="document-outline" size={22} color="#5A390E" />
          
        </Pressable>
      </View>

      {activeTool === "background" && (
        <View style={styles.panel}>
          <Text>Background options here</Text>
        </View>
      )}

      {activeTool === "text" && (
        <View style={styles.panel}>
          <Text>Text options here</Text>
        </View>
      )}

      {activeTool === "sticker" && (
        <View style={styles.panel}>
          <Text>Sticker options here</Text>
        </View>
      )}
    </View>
          
          </ImageBackground>
          <BottomNavbar />
          </View>
          </View> 
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

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },

  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#bbb",
  },

  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  panel: {
    backgroundColor: "#F8E5CF",
    padding: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#e9dccd",
    height: 40,
    width: "80%",
    borderRadius: 20,
    marginBottom:150,
    borderTopWidth: 1,
    borderColor: "#d7c3ac",
    alignSelf: "center",
  },
  toolButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  toolText: {
    fontSize: 11,
    marginTop: 4,
    color: "#5A390E",
  },

});

