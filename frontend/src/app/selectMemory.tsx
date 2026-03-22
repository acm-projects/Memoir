import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ImageBackground, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { supabase } from '../lib/supabase';
import { getFolders } from '@/services/folders.service';
import { createCard } from '@/services/cards.service';
import { addCardImage } from '@/services/card-images.service';

const swirlyBg = require('../../assets/images/swirly-subtle.png');
const paperTexture = require('../../assets/images/layered-vintage-paper.png');

const FLASK_URL = 'http://127.0.0.1:5000';

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
    router.replace('/timelineScreen');
  }

  const renderItem = ({ item }: { item: Folder }) => {
    const isSelected = selectedFolderId === item.id;
    return (
      <TouchableOpacity
        style={[styles.stampCard, isSelected && styles.stampCardSelected]}
        activeOpacity={0.8}
        onPress={() => setSelectedFolderId(item.id)}
      >
        <View style={[styles.stampTop, isSelected && styles.stampTopSelected]}>
          {item.cover_image_url ? (
            <Image source={{ uri: item.cover_image_url }} style={styles.stampImage} resizeMode="contain" />
          ) : (
            <Image source={require('../../assets/images/star-stamp.png')} style={styles.stampImage} resizeMode="contain" />
          )}
        </View>
        <View style={[styles.stampBottom, isSelected && styles.stampBottomSelected]}>
          <Text style={[styles.stampLabel, isSelected && styles.stampLabelSelected]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={swirlyBg} style={styles.screen} imageStyle={styles.swirlyImage}>
      <ImageBackground source={paperTexture} style={styles.paperCard} imageStyle={styles.paperImage}>
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Select a Memory</Text>

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#A07C5A"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

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

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.continueButton, saving && { backgroundColor: '#c8a898' }]}
              activeOpacity={0.8}
              onPress={handleContinue}
              disabled={saving}
            >
              <Text style={styles.continueText}>{saving ? 'Saving...' : 'Continue'}</Text>
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
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  swirlyImage: {
    resizeMode: Platform.OS === 'web' ? 'repeat' : 'cover',
  },
  paperCard: {
    flex: 1,
    borderRadius: 34,
    overflow: 'hidden',
  },
  paperImage: {
    borderRadius: 34,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#7B1D1D',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7B1D1D',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    color: '#7B1D1D',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#5A390E',
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stampCard: {
    borderRadius: 16,
    width: 120,
    aspectRatio: 1.05,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  stampCardSelected: {
    borderWidth: 2,
    borderColor: '#FFE9C7',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  stampTop: {
    flex: 2,
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampTopSelected: {
    backgroundColor: '#8F2626',
  },
  stampBottom: {
    flex: 1,
    backgroundColor: '#D9C29A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampBottomSelected: {
    backgroundColor: '#E2CFA7',
  },
  stampImage: {
    width: '80%',
    height: '85%',
  },
  stampLabel: {
    color: '#5A390E',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stampLabelSelected: {
    color: '#5A390E',
  },
  footerRow: {
    marginTop: 0,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#7B1D1D',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 999,
    marginTop: 0,
    marginBottom: 80,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
