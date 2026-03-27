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

// CARD_WIDTH for 2-column layout (slightly smaller cards)
const CARD_WIDTH = (width - 72) / 2; // was (width - 48) / 2

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

  // New renderItem using ViewFolder-style card structure
  const renderItem = ({ item }: { item: (typeof STAMP_DATA)[number] }) => {
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.8}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={styles.card}>
          {/* Top red stamp area */}
          <View style={styles.cardTop}>
            <Image
              source={item.image}
              style={styles.stampImage}
              resizeMode="contain"
            />
          </View>

          {/* Bottom label */}
          <View style={styles.cardBottom}>
            <Text numberOfLines={1} style={styles.cardTitle}>
              {item.label}
            </Text>
          </View>
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
          style={styles.continueButton}
          activeOpacity={0.8}
          onPress={handleContinue}
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
    fontFamily: 'Calistoga',
    textAlign: 'center',
  },
  paperCard: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
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
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  // New card styles matching ViewFolder
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    width: '70%',
    backgroundColor: '#7B1D1D',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardTop: {
    height: CARD_WIDTH * 0.6, 
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stampImage: {
    width: '85%',
    height: '90%',
    marginBottom: -4,
    resizeMode: 'contain',
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
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
