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

const { width } = Dimensions.get('window');

const swirlyBg = require('../../assets/images/swirly-subtle.png');
const paperTexture = require('../../assets/images/layered-vintage-paper.png');

const STAMP_DATA = [
  {
    id: 'all',
    label: 'All memories',
    image: require('../../assets/images/Australia-Stamp.png'),
  },
  {
    id: 'prom',
    label: '16th Birthday',
    image: require('../../assets/images/star-stamp.png'),
  },
  {
    id: 'plain',
    label: 'Prom',
    image: require('../../assets/images/costa-rica-stamp.png'),
  },
  {
    id: 'spring',
    label: 'Spring Break +',
    image: require('../../assets/images/star-stamp.png'),
  },
];

export default function SelectMemory() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = STAMP_DATA.filter((item) => {
    if (!search.trim()) return true;
    return item.label.toLowerCase().includes(search.trim().toLowerCase());
  });

  const handleContinue = () => {
    router.push('/timelineScreen');
  };

  const renderItem = ({ item }: { item: (typeof STAMP_DATA)[number] }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.stampCard, isSelected && styles.stampCardSelected]}
        activeOpacity={0.8}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={[styles.stampTop, isSelected && styles.stampTopSelected]}>
          <Image source={item.image} style={styles.stampImage} resizeMode="contain" />
        </View>
        <View style={[styles.stampBottom, isSelected && styles.stampBottomSelected]}>
          {item.label ? <Text style={[styles.stampLabel, isSelected && styles.stampLabelSelected]}>{item.label}</Text> : null}
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
      <ImageBackground
        source={paperTexture}
        style={styles.paperCard}
        imageStyle={styles.paperImage}
      >
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backArrow}>{'\u2190'}</Text>
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

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.gridContent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.continueButton} activeOpacity={0.8} onPress={handleContinue}>
              <Text style={styles.continueText}>Continue</Text>
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
