import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image, ImageBackground,
  ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { getFolders } from '@/services/folders.service';
import { createCard } from '@/services/cards.service';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32 - 12) / 2;

const swirlyBg = require('../../assets/images/swirly-subtle.png');
const paperTexture = require('../../assets/images/layered-vintage-paper.png');

// ─ Store Flask URL in one place — swap to production URL when deploying
const FLASK_URL = 'http://127.0.0.1:8000'; 

const FOLDER_COLORS = [
  { color: '#6B4E7D', stripColor: '#573D68' },
  { color: '#557263', stripColor: '#3D5548' },
  { color: '#9B2335', stripColor: '#7D1525' },
  { color: '#4A6B7B', stripColor: '#3A5A6A' },
  { color: '#7B2D2D', stripColor: '#621818' },
  { color: '#8B6A3E', stripColor: '#6B4E28' },
];

interface Folder {
  id: string;
  name: string;
  cover_image_url: string | null;
  is_default: boolean;
}

export default function SelectMemory() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─ Parse params passed from upload-card
  const images: string[] = params.images ? JSON.parse(params.images as string) : [];
  const title = (params.title as string) || '';
  const caption = (params.caption as string) || '';
  const date = (params.date as string) || '';

  useEffect(() => {
    fetchFolders();
  }, []);

  async function fetchFolders() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await getFolders(user.id);
    if (error) {
      console.error('Failed to fetch folders:', error);
    } else if (data) {
      // Sort: default folder first, then alphabetical
      const sorted = [...data].sort((a, b) => {
        if (a.is_default) return -1;
        if (b.is_default) return 1;
        return a.name.localeCompare(b.name);
      });
      setFolders(sorted);
    }
    setLoading(false);
  }

  const filteredFolders = folders.filter((folder) => {
    if (!search.trim()) return true;
    return folder.name.toLowerCase().includes(search.trim().toLowerCase());
  });

  async function handleContinue() {
    if (!selectedFolderId) {
      alert('Please select a folder');
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // ── Step 1: Create the card row in Supabase ───────────────────────────
    const { data: card, error: cardError } = await createCard(user.id, {
      title,
      caption,
      folder_id: selectedFolderId,
      event_date: date || undefined,
    });

    if (cardError || !card) {
      console.error('Failed to create card:', cardError);
      setSaving(false);
      return;
    }

    // ── Step 2: Upload all images in parallel and create card_images rows ─
    // CRITICAL: Path MUST be {user_id}/{card_id}/{filename}
    // Flask backend locates images by this exact path for OCR
    const uploadPromises = images.map(async (uri, i) => {
      const fileName = `image-${Date.now()}-${i}.jpg`;
      const storagePath = `${user.id}/${card.id}/${fileName}`; 

      try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('cards')
          .upload(storagePath, blob, { contentType: 'image/jpeg' });

        if (uploadError) {
          console.error(`Failed to upload image ${i}:`, uploadError);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('cards')
          .getPublicUrl(storagePath);

        await supabase.from('card_images').insert({
          card_id: card.id,
          image_url: urlData.publicUrl,
          order_index: i, // ─ correct column name (not "order")
        });

      } catch (error) {
        console.error(`Failed to process image ${i}:`, error);
      }
    });

    // was sequential for loop — now waits for ALL images to finish
    // before navigating, so Flask has card_images rows to read for OCR
    await Promise.all(uploadPromises);

    // ── Step 3: Navigate IMMEDIATELY to one-specific-card ────────────────
    // Pass isProcessing: true so the card screen shows OCR loading state
    // Flask /process-card runs in the BACKGROUND after navigation
    // User can edit caption, title etc while OCR is processing
    setSaving(false);
    router.replace({
      pathname: '/one-specific-card',
      params: {
        id: card.id,
        title: card.title,
        isProcessing: 'true', // ─ ADDED: tells one-specific-card OCR is running
        fromUpload: 'true'
      },
    });

    // ── Step 4: Call Flask /process-card in background AFTER navigation ───
    // Fire and forget — one-specific-card polls Supabase for ocr_text
    // Non-blocking: if Flask fails, card is still saved and usable
    fetch(`${FLASK_URL}/process-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_id: card.id,
        user_id: user.id,
        use_mock: false,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          console.log('Process card success:', result.results);
        } else {
          console.warn('Process card partial failure:', result.results?.errors);
        }
      })
      .catch(error => {
        // Flask being down does NOT block the user — card is already saved
        console.error('Flask /process-card failed (non-blocking):', error);
      });
  }

  const renderItem = ({ item, index }: { item: Folder; index: number }) => {
    const isSelected = selectedFolderId === item.id;

    const { color, stripColor } = FOLDER_COLORS[index % FOLDER_COLORS.length];

    const selectedTopColor = isSelected ? stripColor + 'CC' : stripColor;   // stripColor at ~80% = darker
    const selectedBottomColor = isSelected ? color + 'CC' : color;
    const selectedBorderColor = isSelected ? stripColor : 'transparent';


    return (
      <TouchableOpacity
        style={[ styles.stampCard, isSelected && { opacity: 1, borderWidth: 3, borderColor: selectedBorderColor }, ]}
        activeOpacity={0.8}
        onPress={() => setSelectedFolderId(item.id)}
      >
        <View style={[styles.stampTop, { backgroundColor: selectedTopColor }]}>
          {item.cover_image_url ? (
            // ─ Real cover image from Supabase Storage
            <Image source={{ uri: item.cover_image_url }} style={styles.stampImage} resizeMode="contain" />
          ) : (
            // ─ Fallback if no cover image set
            <Image source={require('../../assets/images/star-stamp.png')} style={styles.stampImage} resizeMode="contain" />
          )}
        </View>
        <View style={[styles.stampBottom, { backgroundColor: selectedBottomColor }]}>
          <Text style={[styles.stampLabel, isSelected && styles.stampLabelSelected]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={swirlyBg} style={styles.screen} imageStyle={styles.swirlyImage}>
      <ImageBackground source={paperTexture} style={styles.paperCard} imageStyle={styles.paperImage}>
        <View style={styles.cardContent}>

          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Select a Memory</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color="#8B7355" />
            <TextInput
              placeholder=" Search folders"
              placeholderTextColor="#A07C5A"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.sectionLabel}>Your Folders</Text>

          {/* Folder grid — real Supabase folders */}
          {loading ? (
            <ActivityIndicator size="large" color="#7B1D1D" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={filteredFolders}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.gridContent}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Continue button */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!selectedFolderId || saving) && styles.continueButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleContinue}
              disabled={!selectedFolderId || saving}
            >
              <Text style={styles.continueText}>
                {saving ? 'Creating card...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
      <BottomNavbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#4A7568' },
  swirlyImage: { resizeMode: Platform.OS === 'web' ? 'repeat' : 'cover' },
  paperCard: {
    flex: 1, marginTop: 8,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  paperImage: { borderTopLeftRadius: 32, borderTopRightRadius: 32, resizeMode: 'cover' },
  cardContent: { flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backArrow: { fontSize: 22, color: '#5A390E' },
  pageTitle: {
    fontSize: 22, fontWeight: '700', color: '#5A390E',
    marginLeft: 16, fontFamily: 'Calistoga',
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1, borderColor: '#D4C9A8',
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#5A390E' },
  sectionLabel: {
    fontSize: 12, fontWeight: '600', color: '#8B7355',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 8, marginTop: 10, paddingHorizontal: 4,
  },
  gridContent: { paddingBottom: 16 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 12 },
  stampCard: {
    width: CARD_WIDTH, borderRadius: 14, overflow: 'hidden',
    opacity: 0.75,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
    marginBottom: 6,
  },
  stampCardSelected: { opacity: 1, borderWidth: 3, borderColor: '#7B1D1D' },
  stampTop: {
    height: CARD_WIDTH * 0.75, backgroundColor: '#557263',
    alignItems: 'center', justifyContent: 'center',
  },
  stampTopSelected: { backgroundColor: '#4A6355' },
  stampImage: { width: '85%', height: '85%', resizeMode: 'contain' },
  stampBottom: { backgroundColor: '#3D5248', paddingVertical: 8, paddingHorizontal: 6 },
  stampBottomSelected: { backgroundColor: '#7B1D1D' },
  stampLabel: {
    color: '#fff', fontSize: 12, fontWeight: '700',
    textAlign: 'center', fontFamily: 'Calistoga',
  },
  stampLabelSelected: { color: '#F6E5CD' },
  footerRow: { marginTop: 16, paddingHorizontal: 4 },
  continueButton: {
    backgroundColor: '#7B1D1D', paddingVertical: 14,
    borderRadius: 999, width: '100%',
  },
  continueButtonDisabled: { opacity: 0.45 },
  continueText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});