import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';

const paperTexture = require('../../assets/images/layered-vintage-paper.png');
const redSwirl = require('../../assets/images/RED swirl subtle.png');
const starStamp = require('../../assets/images/star-stamp.png');
const swirlySubtle = require('../../assets/images/swirly-subtle.png');

const imageMap: Record<string, any> = {
  card1: require('../../assets/images/cards.jpg'),
  card2: require('../../assets/images/card2.jpg'),
  card3: require('../../assets/images/card3.jpg'),
};

export default function OneSpecificCard() {
  const router = useRouter();
  const params = useLocalSearchParams<{ image?: string; title?: string; caption?: string }>();

  const imageKey = params.image || 'card1';
  const title = params.title || 'Memory Card';
  const initialCaption = params.caption || '';

  const [caption, setCaption] = useState(initialCaption);
  const [ocrText, setOcrText] = useState('');

  const cardImage = imageMap[imageKey] || imageMap['card1'];

  return (
    <View style={styles.container}>
      <ImageBackground source={paperTexture} style={styles.paperBackground}>
        {/* Top red banner */}
        <ImageBackground source={redSwirl} style={styles.topBanner} imageStyle={{ resizeMode: 'cover' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>

          <Image source={starStamp} style={styles.bannerStamp} />
        </ImageBackground>

        {/* Scrollable content below banner */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.flourish}>✦</Text>
          </View>

          {/* Green image container with swirly texture and tape corners */}
          <View style={styles.imageContainerOuter}>
            <ImageBackground
              source={swirlySubtle}
              style={styles.imageContainerInner}
              imageStyle={{ resizeMode: 'cover', borderRadius: 16 }}
            >
              <View style={[styles.tape, styles.tapeTopLeft]} />
              <View style={[styles.tape, styles.tapeTopRight]} />
              <View style={[styles.tape, styles.tapeBottomLeft]} />
              <View style={[styles.tape, styles.tapeBottomRight]} />

              <Image source={cardImage} style={styles.cardImage} />
            </ImageBackground>
          </View>

          {/* Memory notes label */}
          <Text style={styles.sectionLabel}>Memory Notes</Text>

          {/* Caption box */}
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Caption</Text>
            <TextInput
              style={styles.captionText}
              placeholder="Tap to add a caption..."
              placeholderTextColor="#C2A56F"
              value={caption}
              onChangeText={setCaption}
              multiline
            />
          </View>

          {/* OCR box */}
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>OCR Text</Text>
            <Text style={styles.ocrTitle}>OCR Description:</Text>
            <TextInput
              style={styles.ocrBody}
              placeholder="No OCR text available"
              placeholderTextColor="#C2A56F"
              value={ocrText}
              onChangeText={setOcrText}
              multiline
            />
          </View>

          {/* Save button */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>

      <View style={styles.navbarWrapper}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDE0',
  },
  paperBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBanner: {
    height: 130,
    width: '105%',
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 24,
    color: '#F6E5CD',
  },
  bannerStamp: {
    width: 70,
    height: 80,
    resizeMode: 'contain',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6D1B12',
    flex: 1,
  },
  flourish: {
    color: '#C8B89A',
    fontSize: 18,
    marginLeft: 8,
  },
  imageContainerOuter: {
    backgroundColor: '#4A7568',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  imageContainerInner: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  tape: {
    width: 24,
    height: 12,
    backgroundColor: '#C8A96E',
    opacity: 0.8,
    borderRadius: 2,
    position: 'absolute',
  },
  tapeTopLeft: {
    top: 8,
    left: 8,
    transform: [{ rotate: '-10deg' }],
  },
  tapeTopRight: {
    top: 8,
    right: 8,
    transform: [{ rotate: '10deg' }],
  },
  tapeBottomLeft: {
    bottom: 8,
    left: 8,
    transform: [{ rotate: '8deg' }],
  },
  tapeBottomRight: {
    bottom: 8,
    right: 8,
    transform: [{ rotate: '-8deg' }],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  noteBox: {
    backgroundColor: '#EDE8D9',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4C9A8',
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  captionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#5A390E',
    minHeight: 60,
  },
  ocrTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6D1B12',
    marginBottom: 4,
  },
  ocrBody: {
    fontSize: 13,
    color: '#6D1B12',
    minHeight: 50,
  },
  saveButton: {
    backgroundColor: '#6D1B12',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#F6E5CD',
    fontSize: 16,
    fontWeight: '600',
  },
  navbarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});