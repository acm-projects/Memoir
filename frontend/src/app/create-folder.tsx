import React, { useEffect, useState } from "react";
import {View,Text,TextInput,StyleSheet,Pressable,ScrollView,Image,ImageBackground} from "react-native";
import { useRouter } from "expo-router";
import BackButton from "../components/back-Button";
import BottomNavbar from '../components/BottomNavbar';
import { supabase } from '../lib/supabase';
import { createFolder } from '@/services/folders.service';


interface Stamp {
  id: string;
  name: string;
  image_url: string;
}

export default function CreateFolder() {
  const [title, setTitle] = useState("");
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStamps();
  }, []);

  async function fetchStamps() {
    setLoading(true);
    const { data, error } = await supabase.storage.from('stamps').list();

    if (error) {
      console.error('Error fetching stamps:', error);
      setLoading(false);
      return;
    }

    if (data) {
      const stampList = data.map((file) => ({
        id: file.name,
        name: file.name.replace('.png', '').replace('-stamp', '').replace('-', ' '),
        image_url: `https://nlihdtztcytseukfelcc.supabase.co/storage/v1/object/public/stamps/${file.name}`,
      }));
      setStamps(stampList);
    }
    setLoading(false);

  }

  async function handleCreate() {
    if (!title.trim() || !selectedStamp) return;
    
    setCreating(true);

    const { data: { user }} = await supabase.auth.getUser();

    if(!user) {
      setCreating(false);
      return;
    }
    
    const { data: folder, error } = await createFolder(user.id, {
      name: title.trim(),
      cover_image_url: selectedStamp.image_url,
      is_default: false,
    });

    if (error) {
      console.error('Failed to create folder:', error);
      setCreating(false);
      return;
    }

    setCreating(false);
    router.push({
      pathname: '/bulletin-board',
      params: { id: folder.id, title: folder.name },
    });
  }

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
       
          {stamps.map((stamp) => {
            const isSelected = selectedStamp?.id === stamp.id;
            return (
              <Pressable
                key={stamp.id}
                style={[styles.stampBtn, isSelected && styles.stampBtnSelected]}
                onPress={() => setSelectedStamp(stamp)}
              >
                <Image source={{ uri: stamp.image_url }} style={styles.stampImage} />
              </Pressable>
            );
          })}
        
        </ScrollView>

          {/* Divider */}
          <View style={styles.divider} />
          {/* Create button */}
          <Pressable
            style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
            disabled={!canCreate || creating}
            onPress={handleCreate}
          >
            <Text style={styles.createBtnText}>{creating ? 'Creating...' : 'Create folder'}</Text>
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
