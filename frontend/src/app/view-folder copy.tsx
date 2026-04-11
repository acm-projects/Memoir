import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import { getFolders } from '@/services/folders.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = SCREEN_WIDTH - 32;

// ─── Interfaces ─────────
interface Folder {
  id: string;
  name: string;
  cover_image_url: string | null;
  is_default: boolean;
  description?: string; // Matching your Supabase table
}

// Separate UI-only properties from the DB model
type FolderListItem = Folder & { isAdd?: boolean };

interface SearchResult {
  card_id: string;
  title: string;
  caption: string;
  ocr_text: string;
  folder_name: string;
  similarity: number;
}

const FLASK_URL = 'http://127.0.0.1:5000';

export default function ViewFolder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    if (profile?.full_name) setProfileName(profile.full_name);

    const { data, error } = await getFolders(user.id);
    if (error) {
      console.error('Failed to fetch folders:', error);
    } else if (data) {
      const sorted = [...data].sort((a, b) => {
        if (a.is_default) return -1;
        if (b.is_default) return 1;
        return a.name.localeCompare(b.name);
      });
      setFolders(sorted);
    }
    setLoading(false);
  }

  async function handleSearch(query: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const response = await fetch(`${FLASK_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          user_id: user.id,
          match_count: 10,
          match_threshold: 0.3,
        }),
      });
      const data = await response.json();
      if (data.success) setSearchResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  const filteredFolders = useMemo((): FolderListItem[] => {
    const createCard: FolderListItem = {
      id: 'add',
      name: 'Create New Folder',
      cover_image_url: null,
      is_default: false,
      isAdd: true,
    };

    const realFolders = folders.filter((folder) => {
      if (!searchQuery.trim()) return true;
      return folder.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return [createCard, ...realFolders];
  }, [folders, searchQuery]);

  const backgroundDots = useMemo(() => {
    const dots: React.ReactElement[] = [];
    const step = 18;
    const height = 600;
    for (let y = 0; y <= height; y += step) {
      for (let x = 0; x <= SCREEN_WIDTH; x += step) {
        dots.push(
          <Circle key={`dot-${x}-${y}`} cx={x} cy={y} r={1.2} fill="#8B6A3E" opacity={0.08} />
        );
      }
    }
    return dots;
  }, []);
//we
  const renderFolder = (item: FolderListItem, index: number) => {
    const COLORS = [
      { color: '#6B4E7D', stripColor: '#573D68' },
      { color: '#557263', stripColor: '#3D5548' },
      { color: '#9B2335', stripColor: '#7D1525' },
      { color: '#4A6B7B', stripColor: '#3A5A6A' },
      { color: '#7B2D2D', stripColor: '#621818' },
      { color: '#8B6A3E', stripColor: '#6B4E28' },
    ];

    // logic to pick color based on index, except for the "Add" card
    const { color, stripColor } = item.isAdd
      ? { color: '#8B2500', stripColor: '#7A1800' }
      : COLORS[(index - 1) % COLORS.length] || COLORS[0];

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        style={styles.cardWrapper}
        onPress={() => {
          if (item.isAdd) {
            router.push('/create-folder');
          } else {
            router.push({
              pathname: '/bulletin-board',
              params: { id: item.id, title: item.name },
            });
          }
        }}
      >
        <View style={[styles.card, { backgroundColor: color }]}>
          <View style={[styles.cardTop, { backgroundColor: stripColor }]}>
            {item.isAdd ? (
              <View style={styles.addCircle}>
                <MaterialIcons name="add" size={30} color="#EDE8D9" />
              </View>
            ) : (
              <Image
                source={item.cover_image_url ? { uri: item.cover_image_url } : require('../../assets/images/star-stamp.png')}
                style={styles.stampImage}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={[styles.cardBottom, { backgroundColor: stripColor }]}>
            <Text numberOfLines={1} style={styles.cardTitle}>{item.name}</Text>
          </View>
          <View style={styles.perfBorder} pointerEvents="none" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.greenBase} />
        <ImageBackground
          source={require('../../assets/images/swirly-subtle.png')}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.swirlImage}
        />
      </View>

      <View style={styles.screenContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{profileName ? `${profileName.split(' ')[0]}'s` : "Name's"} Memories</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#EDE8D9" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search folders"
              placeholderTextColor="rgba(237,232,217,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        <ImageBackground
          source={require('../../assets/images/layered-vintage-paper.png')}
          style={styles.paperArea}
          imageStyle={styles.paperImage}
        >
          <View style={styles.paperInner}>
            <Svg style={styles.backgroundOverlay} pointerEvents="none">
              {backgroundDots}
            </Svg>
            <Text style={styles.sectionLabel}>Your Folders</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
              {filteredFolders.map((item, index) => renderFolder(item, index))}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.navWrapper}><BottomNavbar /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#4A7568' },
  greenBase: { flex: 1, backgroundColor: '#4A7568' },
  swirlImage: { resizeMode: 'cover', opacity: 0.15 },
  screenContent: { flex: 1 },
  header: { paddingTop: 70, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#EDE8D9', textAlign: 'center', fontFamily: 'Calistoga' },
  searchBar: {
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#EDE8D9', marginLeft: 8 },
  paperArea: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  paperImage: { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  paperInner: { flex: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  backgroundOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#8B7355', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  listContent: { flexGrow: 1, paddingBottom: 40 },
  cardWrapper: { width: '100%', marginBottom: 16 },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTop: { height: 120, alignItems: 'center', justifyContent: 'center' },
  stampImage: { width: '60%', height: '80%' },
  addCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  cardBottom: { paddingVertical: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center', fontFamily: 'Calistoga' },
  perfBorder: { ...StyleSheet.absoluteFillObject, margin: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderStyle: 'dashed', borderRadius: 14 },
  navWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 }
});