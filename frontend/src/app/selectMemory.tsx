import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ImageBackground, ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Platform, } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { getFolders } from '@/services/folders.service';
import { createCard } from '@/services/cards.service';
import { addCardImage } from '@/services/card-images.service';

const { width } = Dimensions.get('window');

const swirlyBg = require('../../assets/images/swirly-subtle.png');
const paperTexture = require('../../assets/images/layered-vintage-paper.png');

const FLASK_URL = 'http://127.0.0.1:5000';

const FOLDER_COLORS: Record<string, { color: string; stripColor: string }> = {
  all: { color: '#6B4E7D', stripColor: '#573D68' },
  prom: { color: '#4A6B7B', stripColor: '#3A5A6A' },
  plain: { color: '#9B2335', stripColor: '#7D1525' },
  spring: { color: '#557263', stripColor: '#3D5548' },
};

interface Folder {
  id: string;
  name: string;
  cover_image_url: string | null;
  is_default: boolean;
}

const CARD_WIDTH = (width - 32 - 12) / 2;

export default function SelectMemory() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Parse params from upload-card
  const images: string[] = params.images ? JSON.parse(params.images as string) : [];
  const title = params.title as string || '';
  const caption = params.caption as string || '';
  const date = params.date as string || '';

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
      const sorted = data.sort((a, b) => {
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

//OLD
//OLD

  async function handleContinue() {
     if (!selectedFolderId) {
      alert('Please select a folder');
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // Step 1 — Create the card in Supabase
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

    // Step 2 — Upload each image and save to card_images table
    for (let i = 0; i < images.length; i++) {
      const uri = images[i];
      const fileName = `image-${Date.now()}-${i}.jpg`;

      if (Platform.OS === 'web') {
        // Web: blob URL needs to be converted to actual file
        try {
          const response = await fetch(uri);
          const blob = await response.blob();

          const { error: uploadError } = await supabase.storage
            .from('cards')
            .upload(`${card.id}/${fileName}`, blob, {
              contentType: 'image/jpeg',
            });

          if (uploadError) {
            console.error(`Failed to upload image ${i}:`, uploadError);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('cards')
            .getPublicUrl(`${card.id}/${fileName}`);

          await supabase.from('card_images').insert({
            card_id: card.id,
            image_url: urlData.publicUrl,
            order_index: i,
          });

        } catch (error) {
          console.error(`Failed to process image ${i}:`, error);
        }
      } else {
        // Mobile: use addCardImage service directly with file URI
        const { error: imageError } = await addCardImage(card.id, {
          uri,
          name: fileName,
          type: 'image/jpeg',
        });
        if (imageError) {
          console.error(`Failed to upload image ${i}:`, imageError);
        }
      }
    }

    // Step 3 — Call Flask /process-card to run OCR, tagging and embedding
    try {
      const response = await fetch(`${FLASK_URL}/process-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: card.id,
          user_id: user.id,
          use_mock: true,
        }),
      });
      const result = await response.json();
      console.log('Process card result:', result);
    } catch (error) {
      console.error('Failed to process card:', error);
    }

    setSaving(false);
    router.replace({
      pathname: '/bulletin-board',
      params: { 
        id: selectedFolderId, 
        title: folders.find(f => f.id === selectedFolderId)?.name ?? '' 
      },
    });
  };

  const renderItem = ({ item }: { item: Folder }) => {
    const { color, stripColor } = FOLDER_COLORS[item.id] || FOLDER_COLORS['all'];
    const isSelected = selectedFolderId === item.id;

    return (
      <TouchableOpacity
        style={[styles.stampCard, isSelected && styles.stampCardSelected]}
        activeOpacity={0.8}
        onPress={() => setSelectedFolderId(item.id)}
      >
        <View style={[styles.stampTop, isSelected && styles.stampTopSelected]}>
          {item.cover_image_url ? (
            <Image
              source={{ uri: item.cover_image_url }}
              style={styles.stampImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/star-stamp.png')}
              style={styles.stampImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={[styles.stampBottom, isSelected && styles.stampBottomSelected]}>
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
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
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

          {/* Folder grid */}
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
                {saving ? 'Saving...' : 'Continue'}
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
  screen: {
    flex: 1,
    backgroundColor: '#4A7568',
  },
  swirlyImage: {
    resizeMode: Platform.OS === 'web' ? 'repeat' : 'cover',
  },
  greenHeader: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#EDE8D9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EDE8D9',
    marginLeft: 70,
    marginTop: 7,
    fontFamily: 'Calistoga',
    textAlign: 'center',
  },
  paperCard: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  paperImage: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 96,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  stampGridWrapper: {
    marginTop: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4C9A8',
  },
  dividerFlourish: {
    color: '#C8B89A',
    fontSize: 12,
    marginHorizontal: 8,
  },
  searchContainerOuter: {
    marginBottom: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: '#D4C9A8',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#5A390E',
  },
  gridContent: {
    paddingLeft: 2,
    paddingRight: 32,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: 18,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginBottom: 18,
    marginRight: 12,
  },
  cardOuter: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  perfBorder: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    borderStyle: 'dashed',
    borderRadius: 14,
    zIndex: 2,
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  cardTop: {
    height: CARD_WIDTH * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  stampImage: {
    width: '90%',
    height: '85%',
    marginBottom: -4,
    resizeMode: 'contain',
  },
  cardBottom: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Calistoga',
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    //alignItems: 'center',
    //justifyContent: 'center',
    zIndex: 3,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    top:10,
    left:10,
  },
  footerRowFloating: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
  },
  continueButton: {
    backgroundColor: '#7B1D1D',
    paddingVertical: 14,
    borderRadius: 999,
    width: '100%',
  },
  continueButtonDisabled: {
    backgroundColor: '#7B1D1D',
    opacity: 0.45,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: 22, 
    fontWeight: '700', 
    color: '#5A390E',
    marginLeft: 16, 
    fontFamily: 'Calistoga',
  },
  stampCard: {
    width: CARD_WIDTH, borderRadius: 14, overflow: 'hidden',
    opacity: 0.75,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },  
  stampCardSelected: { 
    opacity: 1, 
    borderWidth: 3, 
    borderColor: '#7B1D1D' 
  },
  stampTop: {
    height: CARD_WIDTH * 0.75, 
    backgroundColor: '#557263',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  stampTopSelected: { 
    backgroundColor: '#4A6355' 
  },
  stampBottom: {
    backgroundColor: '#3D5248', 
    paddingVertical: 8, 
    paddingHorizontal: 6,
  },
  stampBottomSelected: { 
    backgroundColor: '#7B1D1D' 
  },
  stampLabel: {
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '700',
    textAlign: 'center', 
    fontFamily: 'Calistoga',
  },
  stampLabelSelected: { 
    color: '#F6E5CD' 
  },
  footerRow: { 
    marginTop: 16, 
    paddingHorizontal: 4 
  },
});