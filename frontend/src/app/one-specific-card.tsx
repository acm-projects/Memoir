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
import { router } from "expo-router";
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

          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <Image source={starStamp} style={styles.bannerStamp} />
        </ImageBackground>

        {/* Color accent strip under header */}
        <View style={styles.colorStrip}>
          <View style={[styles.stripSegment, { backgroundColor: '#6B4F6B' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#7B1D1D' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#8B6A3E' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#557263' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#4A6741' }]} />
        </View>

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Green image container */}
          <View style={styles.imageContainerOuter}>
            <ImageBackground
              source={swirlySubtle}
              style={styles.imageContainerInner}
              imageStyle={{ resizeMode: 'cover', borderRadius: 16 }}
            >
              <Image source={cardImage} style={styles.cardImage} />
            </ImageBackground>
          </View>

          {/* Meta pills */}
          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: 'rgba(85,114,99,0.15)', borderColor: 'rgba(85,114,99,0.4)' }]}>
              <Text style={[styles.pillText, { color: '#557263' }]}>Floral</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: 'rgba(107,79,107,0.12)', borderColor: 'rgba(107,79,107,0.35)' }]}>
              <Text style={[styles.pillText, { color: '#6B4F6B' }]}>Romantic</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: 'rgba(139,106,62,0.12)', borderColor: 'rgba(139,106,62,0.35)' }]}>
              <Text style={[styles.pillText, { color: '#8B6A3E' }]}>Hand-drawn</Text>
            </View>
          </View>

          {/* Caption box */}
          <View style={styles.noteBox}>
            <View style={styles.noteHeader}>
              <View style={[styles.noteDot, { backgroundColor: '#557263' }]} />
              <Text style={styles.ocrTitle}>Caption</Text>
            </View>
            <View style={styles.noteDivider} />
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
            <View style={styles.noteHeader}>
              <View style={[styles.noteDot, { backgroundColor: '#6B4F6B' }]} />
              <Text style={styles.ocrTitle}>OCR Description</Text>
            </View>
            <View style={styles.noteDivider} />
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
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>Save Card</Text>
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

  // ── Color accent strip ──────────────────────────────────────
  colorStrip: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  stripSegment: {
    flex: 1,
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
    color: '#F6E5CD',
    flex: 1,
    textAlign: 'center',
    marginRight: 60,
  },

  // ── Image section ───────────────────────────────────────────
  imageContainerOuter: {
    backgroundColor: '#4A7568',
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#557263',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainerInner: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: 260,
    borderRadius: 8,
    resizeMode: 'cover',
  },

  // ── Meta pills ──────────────────────────────────────────────
  pillRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // ── Note boxes ──────────────────────────────────────────────
  noteBox: {
    backgroundColor: '#EDE8D9',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#D4C9A8',
    shadowColor: '#8B6A3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(85, 114, 99, 0.08)',
  },
  noteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noteDivider: {
    height: 1,
    backgroundColor: '#D4C9A8',
  },
  ocrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6D1B12',
    letterSpacing: 0.3,
  },
  captionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#5A390E',
    minHeight: 60,
    padding: 14,
  },
  ocrBody: {
    fontSize: 13,
    color: '#6D1B12',
    minHeight: 50,
    padding: 14,
  },

  // ── Save button ─────────────────────────────────────────────
  saveButton: {
    backgroundColor: '#7B1D1D',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 20,
  
  },
  saveButtonText: {
    color: '#F6E5CD',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  navbarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});
