// INTEGRATED
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Dimensions, Image, } from 'react-native';
import { router } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { ScrollView } from 'react-native';
import FolderItem from '../components/folder-item';
import { supabase } from '../lib/supabase';
import { getFolders } from '@/services/folders.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// AFTER — 2 columns with 16px side padding and 12px gap between
const CARD_MARGIN = 12; // gap between columns
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_MARGIN) / 2; // 16px padding each sidez

// const folders = [
//   { id: '1', title: 'Create New Folder', isAdd: true,  image: null,       color: '#8B2500', stripColor: '#7A1800', isWide: false },
//   { id: '2', title: 'All Memories',      isAdd: false, image: require('../../assets/images/bird-stamp.png'),    color: '#6B4E7D', stripColor: '#573D68', isWide: false },
//   { id: '3', title: 'Spring Break',      isAdd: false, image: require('../../assets/images/blueFlower-stamp.png'), color: '#557263', stripColor: '#3D5548', isWide: false },
//   { id: '4', title: 'Prom',              isAdd: false, image: require('../../assets/images/brasil-stamp.png'),     color: '#9B2335', stripColor: '#7D1525', isWide: false },
//   { id: '5', title: 'College grad',      isAdd: false, image: require('../../assets/images/butterfly-stamp.png'),  color: '#4A6B7B', stripColor: '#3A5A6A', isWide: true  },
//   { id: '6', title: 'Bestieee',          isAdd: false, image: require('../../assets/images/cat-stamp.png'),       color: '#7B2D2D', stripColor: '#621818', isWide: true  },
// ];

// ─── Store Flask URL in one place so it can be swapped for production ─────────

const FLASK_URL = 'http://127.0.0.1:5000';

interface Folder {
  id: string;
  name: string;
  cover_image_url: string | null;
  is_default: boolean;
  isAdd?: boolean;
}

interface SearchResult {
  card_id: string;
  title: string;
  caption: string;
  ocr_text: string;
  folder_name: string;
  similarity: number;
}

export default function ViewFolder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Fetch profile name and folders on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Debounded search - wait 500ms after user stops typing to send search request
  // When search is cleared, clears results and shows folder grid again
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
 
    // Fetch profile name for header
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    if (profile?.full_name) setProfileName(profile.full_name);
 
    // Fetch real folders from Supabase
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

  // Flask semantic search call
  async function handleSearch(query: string) {
    setSearching(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSearching(false); return; }

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
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    
    setSearching(false);
  }

  // Prepend "Create New Folder" card to the top of the list, then filter based on search query
  const filteredFolders = useMemo( () => {
    const createCard: Folder = {
      id: 'add',
      name: 'Create New Folder',
      cover_image_url: null,
      is_default: false,
      isAdd: true,
    };

    const realFolders = folders.filter((folder) => {
      if(!searchQuery.trim()) return true;
      return folder.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    return [createCard, ...realFolders];
  }, [folders, searchQuery]);

  const backgroundDots = useMemo(() => {
    const dots: React.ReactElement[] = [];
    const step = 18;
    const width = SCREEN_WIDTH - 32;
    const height = 520;

    for (let y = 0; y <= height; y += step) {
      for (let x = 0; x <= width; x += step) {
        dots.push(
          <Circle
            key={`dot-${x}-${y}`}
            cx={x}
            cy={y}
            r={1.2}
            fill="#8B6A3E"
            opacity={0.08}
          />
        );
      }
    }
    return dots;
  }, []);

// builds rows manually 
  const renderGrid = (data: Folder[]) => 
  {
    const rows: React.ReactElement[] = [];

    for (let i = 0; i < data.length; i+=2) {
      const item1 = data[i];
      const item2 = data[i + 1];
      rows.push(
        <View key={item1.id} style={styles.columnWrapper}>
          {renderFolder({ item: item1 })}
          {item2 ? renderFolder({ item: item2 }) : <View style={{ width: CARD_WIDTH }} />}
        </View>
      );
    }
    return rows; 
  };

  const renderFolder = ({ item }: { item: (typeof folders)[number] }) => {
    // const cardW = item.isWide ? SCREEN_WIDTH - 32 : CARD_WIDTH;

    const COLORS = [
      { color: '#6B4E7D', stripColor: '#573D68' },
      { color: '#557263', stripColor: '#3D5548' },
      { color: '#9B2335', stripColor: '#7D1525' },
      { color: '#4A6B7B', stripColor: '#3A5A6A' },
      { color: '#7B2D2D', stripColor: '#621818' },
      { color: '#8B6A3E', stripColor: '#6B4E28' },
    ];

    const colorIndex = folders.findIndex(f => f.id === item.id) % COLORS.length;
    const { color, stripColor } = item.isAdd
      ? { color: '#8B2500', stripColor: '#7A1800' }
      : COLORS[colorIndex >= 0 ? colorIndex : 0];


    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.cardWrapper, {width: CARD_WIDTH }]}
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
          {/* Top red stamp area */}
          <View style={[
          styles.cardTop,
          {
            backgroundColor: stripColor,
            // Wide cards are shorter height ratio; normal cards are square-ish
            height: CARD_WIDTH,
          }
        ]}>
            {item.isAdd ? (
              <View style={styles.addCircle}>
                <MaterialIcons name="add" size={30} color="#EDE8D9" />
              </View>
            ) : item.cover_image_url ? (
              // ─── Real cover image from Supabase Storage
              <Image
                source={{ uri: item.cover_image_url }}
                style={[styles.stampImage, { width: '60%', height: '90%' }]}
                resizeMode="contain"
              />
            ) : (
              // ─── Fallback image if no cover set
              <Image
                source={require('../../assets/images/star-stamp.png')}
                style={[styles.stampImage, { width: '60%', height: '90%' }]}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Bottom label */}
          <View style={[
          styles.cardBottom,
          // Keep tan (#C8B89A) for brown cards, use slightly darker for maroon
          { backgroundColor: stripColor}
        ]}>
            <Text numberOfLines={1} style={styles.cardTitle}>
              {item.name}
            </Text>
          </View>
          <View style={styles.perfBorder} pointerEvents="none" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {/* Sage green background with subtle swirl overlay */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.greenBase} />
        <ImageBackground
          source={require('../../assets/images/swirly-subtle.png')}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.swirlImage}
        />
      </View>

      {/* Screen content */}
      <View style={styles.screenContent}>
        {/* Header on green */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* Removed back button */}
            <Text style={styles.headerTitle}>Name&apos;s Memories</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            {/* No extra props on Search */}
            <Ionicons name="search" size={16} color="#EDE8D9" />
            <TextInput
              style={styles.searchInput}
              placeholder="   Search folders"
              placeholderTextColor="rgba(237,232,217,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Paper content area */}
        <ImageBackground
          source={require('../../assets/images/layered-vintage-paper.png')}
          style={styles.paperArea}
          imageStyle={styles.paperImage}
        >
          <View style={styles.paperInner}>
            <Svg style={styles.backgroundOverlay} pointerEvents="none" preserveAspectRatio="none" viewBox={`0 0 ${SCREEN_WIDTH} 520`}>
              {backgroundDots}
            </Svg>
            <Text style={styles.sectionLabel}>Your Folders</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
              {renderGrid(filteredFolders)}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom navbar pinned */}
      <View style={styles.navWrapper}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#4A7568',
  },

  greenBase: {
    flex: 1,
    backgroundColor: '#4A7568',
  },

  swirlImage: {
    resizeMode: 'cover',
    opacity: 0.15,
  },

  screenContent: {
    flex: 1,
  },

  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    padding: 4,
    color:'#5A390E'
  },
  backArrow: {
    fontSize: 22,
    color: '#EDE8D9',
  },

  headerTitle: {
    flex: 1,
    marginLeft: -5,
    fontSize: 28,
    fontWeight: '700',
    color: '#EDE8D9',
    textAlign:'center',
    fontFamily:'Calistoga'
  },

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
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
    color: '#EDE8D9',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#EDE8D9',
  },

  paperArea: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },

  paperImage: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  paperInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
    position: 'relative',
  },

  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
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
    pointerEvents: 'none',
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },

  listContent: {
    flexGrow: 1,
  },

  columnWrapper: {
    flexDirection: 'row',  // was already there in columnWrapperStyle
    justifyContent: 'space-between',
    marginBottom: 14, // tighter
  },

  cardWrapper: {
    // dynamic width
  },

  card: {
    width: '100%',
    // backgroundColor set dynamically via item.color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },

  // CHANGED: cardTop height now set dynamically, remove fixed height here
  cardTop: {
    // height is set inline in renderFolder
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'center', // center looks better
  },

  // CHANGED: stampImage fills more of the card
  stampImage: {
    width: '90%',
    height: '85%',
  },

  addCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: 'rgba(237,232,217,0.55)', // gray ish
    borderStyle: 'dashed', // dashed border 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  

  cardBottom: {
    // update background color dyamically
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  wideRow: {
    marginBottom: 14 // full width wrapper when isWide = true

  }, 

  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Calistoga'
  },
  

  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});