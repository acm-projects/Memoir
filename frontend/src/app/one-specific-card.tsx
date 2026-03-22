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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top red banner */}
          <ImageBackground source={redSwirl} style={styles.topBanner} imageStyle={{ resizeMode: 'cover' }}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backArrow}>{'←'}</Text>
            </TouchableOpacity>
            <Text style={styles.bannerTitle} numberOfLines={1}>
              {title}
            </Text>
          </ImageBackground>

          {/* Stamp in top-right of paper area */}
          <Image source={starStamp} style={styles.stampImage} />

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Green image container with tape corners (no texture background) */}
          <View style={styles.imageWrapper}>
            <View style={[styles.tape, styles.tapeTopLeft]} />
            <View style={[styles.tape, styles.tapeTopRight]} />
            <View style={[styles.tape, styles.tapeBottomLeft]} />
            <View style={[styles.tape, styles.tapeBottomRight]} />

            <Image source={cardImage} style={styles.cardImage} />
          </View>

          {/* Caption box - editable */}
          <View style={styles.captionBox}>
            <TextInput
              style={styles.captionText}
              placeholder="Tap to add a caption..."
              placeholderTextColor="#C2A56F"
              value={caption}
              onChangeText={setCaption}
              multiline
            />
          </View>

          {/* OCR Description box - editable */}
          <View style={styles.captionBox}>
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
  scrollContent: {
    paddingBottom: 120,
  },
  topBanner: {
    height: 100,
    width: '100%',
    paddingHorizontal: 0, // remove side padding so the red bar touches the edges
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 24,
    color: '#F6E5CD',
    paddingHorizontal: 16,
  },
  bannerTitle: {
    flex: 1,
    textAlign: 'right',
    color: '#F6E5CD',
    fontSize: 16,
    fontWeight: '600',
  },
  stampImage: {
    position: 'absolute',
    top: 90,
    right: 16,
    width: 80,
    height: 90,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6D1B12',
    marginTop: 16,
    paddingHorizontal: 24, // slightly increase to keep text away from edges
  },
  imageWrapper: {
    backgroundColor: '#4A7568',
    width: '90%', // updated from '80%'
    alignSelf: 'center', // updated from 'stretch'
    marginHorizontal: 0,
    marginTop: 32, // move the wrapper lower
    borderRadius: 10,
    overflow: 'visible',
    height: 240,
    padding: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '50%',
    height: 220,
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
  captionBox: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },
  captionText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#8B6914',
  },
  ocrTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6D1B12',
    marginBottom: 4,
  },
  ocrBody: {
    fontSize: 14,
    color: '#6D1B12',
  },
  saveButton: {
    backgroundColor: '#6D1B12',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 20,
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
