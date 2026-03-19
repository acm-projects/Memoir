import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,Pressable,ScrollView,Image,ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import BackButton from "../components/back-Button";
import BottomNavbar from '../components/BottomNavbar';


const STAMPS = [
  { key: "star", source: require("../../assets/images/star-stamp.png"), label: "Star" },
  { key: "costa-rica", source: require("../../assets/images/costa-rica-stamp.png"), label: "Costa Rica" },
  { key: "australia", source: require("../../assets/images/Australia-Stamp.png"), label: "Australia" },
  { key: "bird", source: require("../../assets/images/bird-stamp.png"), label: "bird" },
  { key: "brazil", source: require("../../assets/images/brasil-stamp.png"), label: "brazil" },


];

export default function CreateFolder() {
  const [title, setTitle] = useState("");
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const router = useRouter();

  function handleCreate() {
    if (!title.trim() || !selectedStamp) return;
    
    router.back();
  }

  const selected = STAMPS.find((s) => s.key === selectedStamp);
  const canCreate = title.trim().length > 0 && selectedStamp !== null;

  return (
    <ImageBackground
      source={require("../../assets/images/swirly-subtle.png")}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <ImageBackground
         source={require("../../assets/images/layered-vintage-paper.png")}
          style={styles.paperBack}>

        {/* Header */}
          <BackButton />
          <Text style={styles.headerTitle}>New Memory Folder</Text>
        <View style={styles.body}>

          {/* Title input */}
          <Text style={styles.label}>Folder title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            maxLength={40}
          />

          {/* Stamp picker */}
          <Text style={styles.sectionTitle}>Choose a stamp cover</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stampsRow}
            >
       
          {STAMPS.map((stamp) => {
            const isSelected = selectedStamp === stamp.key;
            return (
              <Pressable
                key={stamp.key}
                style={[styles.stampBtn, isSelected && styles.stampBtnSelected]}
                onPress={() => setSelectedStamp(stamp.key)}
              >
                <Image source={stamp.source} style={styles.stampImage} />
              </Pressable>
            );
          })}
        
        </ScrollView>

          {/* Divider */}
          <View style={styles.divider} />

          

          {/* Create button */}
          <Pressable
            style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
            disabled={!canCreate}
            onPress={() => {
                             
                        router.push({
                        pathname: "/bulletin-board",
                        params: {
                            id: Date.now().toString(),
                            title: title.trim(),
                            stamp: selectedStamp,
          },
        });
                              }}
                            
          >
            <Text style={styles.createBtnText}>Create folder</Text>
          </Pressable>



        </View>
       
        </ImageBackground>
      </ScrollView>
      <BottomNavbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#F5F0E8",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Header
  
  backBtn: {
    padding: 4,
  },
  backArrow: {
    color: "#f5e6c8",
    fontSize: 22,
  },
  headerTitle: {
    color: "#5A390E",
    fontSize: 32,
    fontFamily: "Calistoga",
    textAlign: 'center',
  },

  paperBack:{
    height:'98%',
    width: '100%',
    marginTop:100,
    borderRadius:10,
    overflow: 'hidden',
  },

  // Body
  body: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: "#5A390E",
    marginBottom: 6,
    fontFamily: "Inter",
  },
  input: {
    backgroundColor: "#F5EEE1",
    borderWidth: 1,
    borderColor: "#c8b89a",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#3a2010",
    fontFamily: "Calistoga",
  },
  sectionTitle: {
    fontSize: 14,
    color: "#5a3020",
    fontFamily: "Inter",
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 12,
  },

  // Stamps grid
  stampsRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},
stampBtn: {
  opacity: 0.6,
  borderRadius: 8,
  overflow: "hidden",
},
stampBtnSelected: {
  opacity: 1,
  borderWidth: 2,
  borderColor: "#6D1B12",
  borderRadius: 8,
},

stampImage: {
  width: 70,
  height: 70,
  resizeMode: "contain",
},

  stampsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
 
  stampCardSelected: {
    borderColor: "#6D1B12",
    borderWidth: 2,
    backgroundColor: "#fdf4ee",
  },
  
  
  checkBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    backgroundColor: "#6D1B12",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#fff",
    fontSize: 10,
    lineHeight: 14,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#d8cfc0",
    marginTop: 20,
  },

  

  // Create button
  createBtn: {
    backgroundColor: "#6D1B12",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  createBtnDisabled: {
    backgroundColor: "#c8a898",
  },
  createBtnText: {
    color: "#f5e6c8",
    fontSize: 16,
    fontFamily: "Calistoga",
    letterSpacing: 0.3,
  },
  hint: {
    textAlign: "center",
    color: "#9a7a60",
    fontSize: 12,
    fontFamily: "Inter",
    marginTop: 8,
  },
});
