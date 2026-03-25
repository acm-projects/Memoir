import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';

import { router } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const folders = [
  { id: '1', title: 'Create New Folder', date: '', isAdd: true, image: null },
  { id: '2', title: 'All Memories', date: 'March 18, 2026', isAdd: false, image: require('../../assets/images/bird-stamp.png') },
  { id: '3', title: 'Spring Break', date: 'March 24, 2026', isAdd: false, image: require('../../assets/images/blueFlower-stamp.png') },
  { id: '4', title: 'Prom', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/brasil-stamp.png') },
  { id: '5', title: 'College grad', date: 'April 6, 2026', isAdd: false, image: require('../../assets/images/butterfly-stamp.png') },
  { id: '6', title: 'Bestieee', date: 'March 18, 2026', isAdd: false, image: require('../../assets/images/bird-stamp.png') },
];

const CARD_WIDTH = (SCREEN_WIDTH - 48) / 3;

export default function ViewFolder() {
  const [searchQuery, setSearchQuery] = useState('');


  const filteredFolders = useMemo(
    () =>
      folders.filter((folder) => {
        if (folder.isAdd) return true;
        if (!searchQuery.trim()) return true;
        return folder.title.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    [searchQuery]
  );

  const renderFolder = ({ item }: { item: (typeof folders)[number] }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardWrapper}
        onPress={() => {
          if (item.isAdd) {
            router.push('/create-folder');
          } else {
            router.push({
              pathname: '/bulletin-board',
              params: { id: item.id, title: item.title },
            });
          }
        }}
      >
        <View style={styles.card}>
          {/* Top red stamp area */}
          <View style={styles.cardTop}>
            {item.isAdd ? (
              <View style={styles.addCircle}>
                <MaterialIcons name="add"size={30} color="#EDE8D9"/>
                
              </View>
            ) : (
              item.image && (
                <Image
                  source={item.image}
                  style={styles.stampImage}
                  resizeMode="contain"
                />
              )
            )}
          </View>

          {/* Bottom label */}
          <View style={styles.cardBottom}>
            <Text numberOfLines={1} style={styles.cardTitle}>
              {item.title}
            </Text>
          </View>
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
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={12}
            >
              
              <Ionicons name="arrow-back" size={24} color="#EDE8D9" />
            </Pressable>
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
            <Text style={styles.sectionLabel}>Your Folders</Text>

            <FlatList
              data={filteredFolders}
              keyExtractor={(item) => item.id}
              numColumns={3}
              renderItem={renderFolder}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
            />
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
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  cardWrapper: {
    width: CARD_WIDTH,
  },

  card: {
    width: '100%',
    backgroundColor: '#7B1D1D',
    borderRadius: 14,
    overflow: 'hidden',
  },

  cardTop: {
    height: CARD_WIDTH * 0.8,
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  stampImage: {
    width: '85%',
    height: '90%',
    marginBottom: -4,
  },

  addCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#EDE8D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  

  cardBottom: {
    backgroundColor: '#C8B89A',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B2C1A',
    textAlign: 'center',
  },

  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});