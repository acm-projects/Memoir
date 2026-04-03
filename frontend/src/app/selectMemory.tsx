import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const swirlyBg = require('../../assets/images/swirly-subtle.png');
const paperTexture = require('../../assets/images/layered-vintage-paper.png');

//BACKEND: replace with actual data from backend API
const STAMP_DATA = [
  {
    id: 'all',
    label: 'All Memories',
    image: require('../../assets/images/bird-stamp.png'),
  },
  {
    id: 'prom',
    label: '16th Birthday',
    image: require('../../assets/images/blueFlower-stamp.png'),
  },
  {
    id: 'plain',
    label: 'Prom',
    image: require('../../assets/images/brasil-stamp.png'),
  },
  {
    id: 'spring',
    label: 'Spring Break',
    image: require('../../assets/images/butterfly-stamp.png'),
  },
];

//BACKEND: replace with actual data from backend API

const FOLDER_COLORS: Record<string, { color: string; stripColor: string }> = {
  all: { color: '#6B4E7D', stripColor: '#573D68' },
  prom: { color: '#4A6B7B', stripColor: '#3A5A6A' },
  plain: { color: '#9B2335', stripColor: '#7D1525' },
  spring: { color: '#557263', stripColor: '#3D5548' },
};

const CARD_WIDTH = (width - 32 - 12) / 2;

export default function SelectMemory() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = STAMP_DATA.filter((item) => {
    if (!search.trim()) return true;
    return item.label.toLowerCase().includes(search.trim().toLowerCase());
  });

  const handleContinue = () => {
    router.push('/view-folder copy');
  };
  //Backend: connect to the actual view folder screen for the selected memory
  const renderItem = ({ item }: { item: (typeof STAMP_DATA)[number] }) => {
    const { color, stripColor } = FOLDER_COLORS[item.id] || FOLDER_COLORS['all'];
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.8}
        onPress={() => setSelectedId(isSelected ? null : item.id)}
      >
        <View style={styles.cardOuter}>
          {/* Perf dashed border overlay */}
          <View style={styles.perfBorder} pointerEvents="none" />
          <View style={[styles.card, { borderRadius: 18 }]}>
            {/* Top stamp area */}
            <View style={[styles.cardTop, { backgroundColor: color }]}>
               {/*BACKEND: replace with actual image from backend */}
              <Image
                source={item.image}
                style={styles.stampImage}
                resizeMode="contain"
              />
            </View>
            {/* Bottom label */}
            <View style={[styles.cardBottom, { backgroundColor: stripColor }]}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.label}
              </Text>
            </View>
          </View>

          {/* Checkmark overlay — shown when selected */}
          {isSelected && (
            <View style={styles.checkOverlay} pointerEvents="none">
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={swirlyBg}
      style={styles.screen}
      imageStyle={styles.swirlyImage}
    >
      {/* Green header area matching Upload Card */}
      <View style={styles.greenHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select a Memory</Text>
        </View>
      </View>

      {/* Floating paper card */}
      <ImageBackground
        source={paperTexture}
        style={styles.paperCard}
        imageStyle={styles.paperImage}
      >
        <View style={styles.cardContent}>
          {/* Search bar inside paper card, above section label */}
          <View style={styles.searchContainerOuter}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={16} color="#8B7355" />
              <TextInput
                placeholder=" Search"
                placeholderTextColor="#A07C5A"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>
            {/* Divider row inside paper card, above search */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerFlourish}>✦</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>

          {/* Section label inside paper */}
          <Text style={styles.sectionLabel}>Your Folders</Text>

          <View style={styles.stampGridWrapper}>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.gridContent}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ImageBackground>

      <View style={styles.footerRowFloating}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedId && styles.continueButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={!selectedId}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

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
});