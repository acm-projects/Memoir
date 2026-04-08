// INTEGRATED
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Image, ImageBackground, Platform, } from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();     // <-- INTEGRATION: Router for navigation

  useEffect(() => { 
    fetchStamps(); 
    return () => {
      setTitle('');
      setSelectedStamp(null);
      setDate(new Date());
      setShowDatePicker(false);
    };
  }, []);

  async function fetchStamps() {
    setLoading(true);
    // <-- INTEGRATION: Supabase storage call to fetch stamps
    const { data, error } = await supabase.storage.from('stamps').list();

    if (error) {
      console.error("Error fetching stamps:", error);
      setLoading(false);
      return;
    }

    if(data) {
      const stampList = data.map((file) => ({
        id: file.name,
        name: file.name.replace('.png', '').replace('-stamp', '').replace('-', ' '),
        image_url: `https://nlihdtztcytseukfelcc.supabase.co/storage/v1/object/public/stamps/${file.name}`,   // <-- INTEGRATION: Public Supabase URL
      }));
      setStamps(stampList);
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!title.trim() || !selectedStamp) return;
    
    setCreating(true);

    // <-- INTEGRATION: Get current user from Supabase Auth
    const { data: { user }} = await supabase.auth.getUser();

    if(!user) {
      setCreating(false);
      return;
    }

    // <-- INTEGRATION: Check if folder with same name exists
    const { data: existingFolders, error: checkError } = await supabase
      .from('folders')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', title.trim())
      .single();

    if (existingFolders) {
      alert('You already have a folder with this name!');
      setCreating(false);
      return;
    }
    
    // <-- INTEGRATION: Create folder using the service
    const { data: folder, error } = await createFolder(user.id, {
      name: title.trim(),
      cover_image_url: selectedStamp.image_url,
      is_default: false,
    });

    if (error) {
      if (error.code === '23505') { // unique constraint violation
        alert("You already have a folder with this name!");
      } else {
        console.error('Failed to create folder:', error);
      }
      setCreating(false);
      return;
    }

    setCreating(false);

    // <-- INTEGRATION: Routing to bulletin-board after folder creation
    router.replace({
      pathname: '/bulletin-board',
      params: { id: folder.id, title: folder.name },
    });
  }

  const canCreate = title.trim().length > 0 && selectedStamp !== null;
  const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <ImageBackground
      source={require("../../assets/images/swirly-subtle.png")}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Manual back button above the paperBack */}
        <Pressable
          onPress={() => router.replace('/timelineScreen')}   // <-- INTEGRATION: Routing back
          style={{
            alignSelf: 'flex-start',
            marginTop: 65,
            marginLeft: 16,
            marginBottom: 8,
            zIndex: 100,
            backgroundColor: '#6D1B12', borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 6,
            flexDirection: 'row', alignItems: 'center', gap: 4
          }}
        >
          <Text style={{ color: '#f5e6c8', fontSize: 14, fontFamily: 'Calistoga' }}>← Back</Text>
        </Pressable>
        <ImageBackground
          source={require("../../assets/images/layered-vintage-paper.png")}
          style={styles.paperBack}
        >
          {/* Remove paddingTop to move title higher */}
          <View>
            <Text style={styles.headerTitle}>New Memory Folder</Text>
            {/* Decorative divider */}
            <View style={styles.decorativeDivider} />
            <View style={styles.body}>
              {/* Title input */}
              <Text style={styles.label}>Folder title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                maxLength={40}
              />
              {/* Hint text */}
              <Text style={styles.inputHint}>e.g. Summer in Japan, Weekend Road Trip</Text>
              {/* Date picker section */}
              <View style={styles.dateCardRow}>
                <View style={styles.dateAccentBar} />
                <Pressable style={styles.dateCardPressable} onPress={() => setShowDatePicker(!showDatePicker)}>
                  <Text style={styles.dateCardEmoji}>📅</Text>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                  </View>
                </Pressable>
              </View>
              {showDatePicker && (
                Platform.OS === 'ios' ? (
                  <View style={{ maxHeight: 120, overflow: 'hidden' }}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display='spinner'
                      onChange={(_: any, selectedDate: React.SetStateAction<Date>) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) setDate(selectedDate);
                      }}
                      themeVariant="light"
                      style={{ height: 120 }}
                      scalesPageToFit={false}
                    />
                  </View>
                ) : (
                  <View style={{ height: 120, overflow: 'hidden' }}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display='spinner'
                      onChange={(_: any, selectedDate: React.SetStateAction<Date>) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) setDate(selectedDate);
                      }}
                      themeVariant="light"
                      style={{ height: 120 }}
                      scalesPageToFit={false}
                    />
                  </View>
                )
              )}
              {/* Stamp picker section */}
              <Text style={styles.stampSectionTitle}>Choose a stamp cover</Text>
              <Text style={styles.stampSubtitle}>This will appear on your folder cover</Text>
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
                      onPress={() => setSelectedStamp(stamp)}   // <-- INTEGRATION: Select stamp
                    >
                      <Image source={{ uri: stamp.image_url }} style={styles.stampImage} />
                      {isSelected && (
                        <View style={styles.stampCheckBadge}>
                          <Text style={styles.stampCheckText}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View style={styles.divider} />
              {/* Create button */}
              <Pressable
                style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
                disabled={!canCreate || creating}
                onPress={handleCreate}    // <-- INTEGRATION: Create folder
              >
                <Text style={styles.createBtnText}>{creating ? 'Creating...' : 'Create folder'}</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      <BottomNavbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#F5F0E8", borderRadius:32, overflow:'hidden' },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: { padding: 4 },
  backArrow: { color: "#f5e6c8", fontSize: 22 },
  headerTitle: { color: "#5A390E", fontSize: 32, fontFamily: "Calistoga", textAlign: "center", marginTop: 35 },
  paperBack: { height: "98%", width: "100%", marginTop: 8, borderRadius: 10, overflow: "hidden" },
  headerRow: {
    position: 'absolute',
    top: 18,
    left: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeDivider: {
    height: 2,
    backgroundColor: '#c8b89a',
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 2,
  },
  body: { padding: 20, paddingTop: 24 },
  label: { fontSize: 14, color: "#5A390E", marginBottom: 6, fontFamily: "Inter", marginTop:10, },
  input: {
    backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#c8b89a",
    borderRadius: 10, padding: 12, fontSize: 16, color: "#3a2010", fontFamily: "Calistoga",
    minHeight: 48,
  },
  inputHint: {
    fontStyle: 'italic',
    color: '#9a8470',
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 10,
    marginTop: 2,
    marginLeft: 2,
  },
  // Date card row
  dateCardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
    marginTop: 10,
  },
  dateAccentBar: {
    width: 4,
    backgroundColor: '#6D1B12',
    borderRadius: 2,
    marginRight: 8,
  },
  dateCardPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#c8b89a',
  },
  dateCardEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#3a2010',
    fontFamily: 'Calistoga',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14, color: "#5a3020", fontFamily: "Inter",
    fontWeight: "500", marginTop: 20, marginBottom: 12,
  },
  stampSectionTitle: {
    fontSize: 16,
    color: '#5A390E',
    fontFamily: 'Inter',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 2,
  },
  stampSubtitle: {
    color: '#9a8470',
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 10,
    marginLeft: 2,
  },
  stampsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  stampBtn: { opacity: 0.6, borderRadius: 8, overflow: "hidden", marginRight: 8 },
  stampBtnSelected: { opacity: 1, borderWidth: 3, borderColor: "#6D1B12", borderRadius: 8 },
  stampImage: { width: 150, height: 150, resizeMode: "contain" },
  stampCheckBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: '#6D1B12',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  stampCheckText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  divider: { height: 1, backgroundColor: "#d8cfc0", marginTop: 20 },
  createBtn: { backgroundColor: "#6D1B12", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 14, alignItems: "center", marginTop: 20, flexDirection: 'row', justifyContent: 'center' },
  createBtnDisabled: { backgroundColor: "#c8a898" },
  createBtnText: { color: "#f5e6c8", fontSize: 16, fontFamily: "Calistoga", letterSpacing: 0.3, flexDirection: 'row', alignItems: 'center' },
});