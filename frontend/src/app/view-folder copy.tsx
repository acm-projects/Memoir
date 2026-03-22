import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import FolderItem from '../components/folder-item';
import BottomNavbar from '../components/BottomNavbar';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getFolders } from '@/services/folders.service';

// const folders = [
//   { id: '1', title: 'Create New Folder', date: '', isAdd: true, image: null },
//   { id: '2', title: 'All Memories', date: 'March 18, 2026', isAdd: false, image: require('../../assets/images/Australia-Stamp.png') },
//   { id: '3', title: 'Spring Break', date: 'March 24, 2026', isAdd: false, image: require('../../assets/images/star-stamp.png') },
//   { id: '4', title: 'Prom', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
//   { id: '5', title: 'College grad', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
//   { id: '6', title: 'Bestieee', date: 'March 18, 2026', isAdd: false, image: require('../../assets/images/costa-rica-stamp.png') },
// ];

const FLASK_URL = 'http://127.0.0.1:5000';

interface Folder {
  id: string;
  name: string;
  event_date: string | null;
  cover_image_url: string | null;
  is_default: boolean;
  isAdd?: boolean
}

interface SearchResult {
  card_id: string;
  title: string;
  caption: string;
  ocr_text: string;
  folder_name: string;
  similarity: number
}

export default function viewFolder() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  // Debounce search — wait 500ms after user stops typing
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

  async function fetchFolders() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await getFolders(user.id);
    if (error) {
      console.error('Error fetching folders:', error);
    } else if (data) {
      // Sort: All Memories (is_default) first, then rest alphabetically
      const sorted = data.sort((a, b) => {
        if (a.is_default) return -1;
        if (b.is_default) return 1;
        return a.name.localeCompare(b.name);
      });
      setFolders(sorted);
    }
    setLoading(false);
  }

  async function handleSearch(query: string) {
    setSearching(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSearching(false);
      return;
    }

    // Call Flask API to perform search
    try {
      const response = await fetch(`${FLASK_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, user_id: user.id, match_count: 10, match_threshold: 0.3}), // Adjust match_count and match_threshold as needed
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

  // Add "Create New Folder" card to the beginning of the folders list
  const folderData = [ { id: 'add', name: 'Create New Folder', isAdd: true, cover_image_url: null, event_date: null, is_default: false }, ...folders, ];

  const isSearching = searchQuery.trim().length > 0;

  
  return (
  <View style={styles.container}>
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/swirly-subtle.png')}
        style={styles.fullBackground}
        imageStyle={{ width: '100%', height: '100%' }}
      >
        <View style={styles.headerCard} />

        {/* Search bar — now connected to state so typing actually works */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#999" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search memories..."
            placeholderTextColor="#aaa"
            value={searchQuery}             /* CHANGED: was empty, now shows what user typed */
            onChangeText={setSearchQuery}   /* CHANGED: was missing, now updates state as user types */
          />
          {/* ADDED: clear button — only shows when user has typed something */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <ImageBackground
          source={require('../../assets/images/paperstrip.png')}
          style={styles.gridBackground}
        >
          {/* CHANGED: was always showing folder grid, now switches between two views */}
          {isSearching ? (
            /* SEARCH RESULTS VIEW — shown when user has typed something in the search bar */
            /* Calls Flask /search endpoint and shows matching cards */
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.card_id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={{ padding: 30, alignItems: 'center', marginTop: 275 }}>
                  <Text style={{ color: '#5A390E', fontFamily: 'Inter' }}>
                    {searching ? 'Searching...' : 'No results found'}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                /* CHANGED: tapping a search result goes to the specific card, not a folder */
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.searchResultItem}
                  onPress={() => router.push({
                    pathname: '/one-specific-card',
                    params: { id: item.card_id, title: item.title },
                  })}
                >
                  <Text style={styles.searchResultTitle}>{item.title}</Text>
                  <Text style={styles.searchResultFolder}>{item.folder_name}</Text>
                  <Text style={styles.searchResultCaption} numberOfLines={1}>{item.caption}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <FlatList
              data={folderData}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.folderWrapper}
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
                  <FolderItem
                    title={item.name}
                    imageSource={item.cover_image_url ? { uri: item.cover_image_url } : undefined}
                    isAddButton={item.isAdd}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </ImageBackground>
      </ImageBackground>
    </View>
    <BottomNavbar />
  </View>
);
}

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

 

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  headerText: {
    fontFamily: 'Calistoga',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5A390E',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8E5CF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width:'70%',
    marginLeft:60,
    marginTop:20,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  // Paper-textured grid area
  gridBackground: {
    flex: 1,
    marginTop:-200,
    //marginBottom:100,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width:'100%',
    height:'80%',

  },

  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 275,
    paddingBottom: 40,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  folderWrapper: {
    alignItems: 'center',   // remove position:relative and fixed width
  },

  searchResultItem: {
  backgroundColor: '#F5EEE1',
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  marginHorizontal: 12,
  borderWidth: 1,
  borderColor: '#d8cfc0',
},
searchResultTitle: {
  fontFamily: 'Calistoga',
  fontSize: 16,
  color: '#5A390E',
  marginBottom: 4,
},
searchResultFolder: {
  fontFamily: 'Inter',
  fontSize: 12,
  color: '#9a7a60',
  marginBottom: 4,
},
searchResultCaption: {
  fontFamily: 'Inter',
  fontSize: 13,
  color: '#3a2010',
},

  
});