import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
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
  const caption = params.caption || '';

  const cardImage = imageMap[imageKey] || imageMap['card1'];

  return (
    <View style={styles.container}>
      <ImageBackground source={paperTexture} style={styles.paperBackground}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top red banner */}
          <ImageBackground source={redSwirl} style={styles.topBanner} imageStyle={{ resizeMode: 'cover' }}>
            <Text style={styles.backArrow} onPress={() => router.back()}>
              
            </Text>
            <Text style={styles.bannerTitle} numberOfLines={1}>
              {title}
            </Text>
          </ImageBackground>

          {/* Stamp in top-right of paper area */}
          <Image source={starStamp} style={styles.stampImage} />

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Single swirly image container with tape corners */}
          <ImageBackground
            source={swirlySubtle}
            style={styles.imageWrapper}
            imageStyle={styles.imageWrapperImage}
          >
            <View style={[styles.tape, styles.tapeTopLeft]} />
            <View style={[styles.tape, styles.tapeTopRight]} />
            <View style={[styles.tape, styles.tapeBottomLeft]} />
            <View style={[styles.tape, styles.tapeBottomRight]} />

            <Image source={cardImage} style={styles.cardImage} />
          </ImageBackground>

          {/* Caption box */}
          <View style={styles.captionBox}>
            <Text style={styles.captionText}>
              {caption || 'Tap to add a caption...'}
            </Text>
          </View>

          {/* OCR Description box */}
          <View style={styles.captionBox}>
            <Text style={styles.ocrTitle}>OCR Description:</Text>
            <Text style={styles.ocrBody}>No OCR text available</Text>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 24,
    color: '#F6E5CD',
    paddingRight: 12,
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
    paddingHorizontal: 20,
  },
  imageWrapper: {
    backgroundColor: '#4A7568',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 10,
    marginTop: 12,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // adjust wrapper width here
    height: 260,   // adjust wrapper height here
  },
  imageWrapperImage: {
    resizeMode: 'cover',
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
    top: 6,
    left: 6,
    transform: [{ rotate: '-10deg' }],
  },
  tapeTopRight: {
    top: 6,
    right: 6,
    transform: [{ rotate: '10deg' }],
  },
  tapeBottomLeft: {
    bottom: 6,
    left: 6,
    transform: [{ rotate: '8deg' }],
  },
  tapeBottomRight: {
    bottom: 6,
    right: 6,
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
  navbarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});
