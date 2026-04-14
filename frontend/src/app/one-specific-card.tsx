import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { supabase } from '../lib/supabase';                         // ─ ADDED: Supabase client
import { getCardById, updateCard } from '@/services/cards.service'; // ─ ADDED: card service
import { getCardTags } from '@/services/tags.service';              // ─ ADDED: tags service — fetches card_tags joined with tags table

const paperTexture = require('../../assets/images/layered-vintage-paper.png');
const redSwirl = require('../../assets/images/RED swirl subtle.png');
const starStamp = require('../../assets/images/star-stamp.png');
const swirlySubtle = require('../../assets/images/swirly-subtle.png');

//Tag colors to cycle through for pills
const TAG_COLORS = [
  { bg: 'rgba(85,114,99,0.15)',   border: 'rgba(85,114,99,0.4)',   text: '#557263' },
  { bg: 'rgba(107,79,107,0.12)',  border: 'rgba(107,79,107,0.35)', text: '#6B4F6B' },
  { bg: 'rgba(139,106,62,0.12)',  border: 'rgba(139,106,62,0.35)', text: '#8B6A3E' },
  { bg: 'rgba(123,29,29,0.12)',   border: 'rgba(123,29,29,0.35)',  text: '#7B1D1D' },
  { bg: 'rgba(74,103,65,0.12)',   border: 'rgba(74,103,65,0.35)',  text: '#4A6741' },
];
 
// Card interface matching Supabase schema
interface Card {
  id: string;
  title: string;
  caption: string | null;
  ocr_text: string | null;
  event_date: string | null;
  card_images: { image_url: string; order_index: number }[];
}


// How often to poll Supabase for OCR results (ms)
const OCR_POLL_INTERVAL = 3000;
// Max number of poll attempts before giving up (~1.5 min)
const OCR_MAX_POLLS = 30;

// OCR status messages that mirror what Flask logs in the terminal.
// These cycle through in order while polling so the user sees real progress instead of a generic "Extracting text..." spinner.
const OCR_STATUS_MESSAGES = [
  'Downloading image...',
  'Image downloaded — running OCR...',
  'Analysing handwriting...',
  'Checking confidence score...',
  'Finalising text extraction...',
];

export default function OneSpecificCard() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; title?: string; isProcessing?: string; fromUpload?: string; }>();
  const cardId = params.id;
  const isProcessing = params.isProcessing === 'true'; // tells us OCR is in flight
  const fromUpload   = params.fromUpload === 'true';

  // State for real card data from Supabase
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(fromUpload);

  // OCR polling state
  // ocrText: the actual OCR result from Supabase once it arrives
  // ocrLoading: true while Flask is still processing
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(isProcessing);
  const [ocrStatusIndex, setOcrStatusIndex] = useState(0);

  // Refs to manage the polling interval lifecycle
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    if (cardId) fetchCard();
    return () => stopPolling(); // cleanup interval on unmount
    stopStatusCycle(); // clean up status interval on unmount
  }, [cardId]);

  // Polling checks Supabase every 3s for ocr_text to appear
  useEffect(() => {
    if (isProcessing) {
      startOcrPolling();
      startStatusCycle(); // start cycling status messages
    }
    return () => stopPolling(); stopStatusCycle();
  }, [isProcessing]);

  // Flask /process-card sets tags AFTER OCR, so we refetch tags once OCR is done
  useEffect(() => {
    if (!ocrLoading && isProcessing) {
      fetchTags(); // ─ refetch tags once OCR + tagging pipeline finishes
      stopStatusCycle(); // stop cycling once OCR finishes
    }
  }, [ocrLoading]);

  async function fetchCard() {
    setLoading(true);

    // Fetch card data from Supabase (title, caption, ocr_text, card_images)
    const { data, error } = await getCardById(cardId);
    if (error) {
      console.error('Failed to fetch card:', error);
    } else if (data) {
      setCard(data as Card);
      setCaption(data.caption || ''); // ─ ADDED: pre-fill caption from Supabase

      // If card already has OCR text (re-visiting), show it immediately
      // No need to poll if ocr_text already exists
      if (data.ocr_text) {
        setOcrText(data.ocr_text);
        setOcrLoading(false);
        stopPolling();
         stopStatusCycle(); // no need to cycle if OCR already done
      }
    }
    // Fetch initial tags — may be empty if Flask hasn't finished yet
    await fetchTags();

    setLoading(false);
  }

  
  // Fetch tags using getCardTags service
  // Returns card_tags joined with tags table
  // Called on mount AND again after OCR completes (tags set by Flask pipeline)
  async function fetchTags() {
    const { data: cardTagsData, error: tagsError } = await getCardTags(cardId);
    if (tagsError) {
      console.error('Failed to fetch tags:', tagsError);
    } else if (cardTagsData) {
      const tagNames = cardTagsData
        .map((ct: any) => ct.tags?.name)
        .filter(Boolean);
      setTags(tagNames);
    }
  }

  // Start polling Supabase for ocr_text every 3 seconds
  // Flask writes ocr_text to cards table after /process-card completes
  // Once we see it, we stop polling and show the result
  function startOcrPolling() {
    stopPolling(); // clear any existing interval first
    pollCountRef.current = 0;

    pollIntervalRef.current = setInterval(async () => {
      pollCountRef.current += 1;

      // Give up after OCR_MAX_POLLS attempts
      if (pollCountRef.current >= OCR_MAX_POLLS) {
        console.warn('OCR polling timed out — Flask may still be processing');
        setOcrLoading(false);
        stopPolling();
        stopStatusCycle()
        return;
      }

      // Poll Supabase directly for ocr_text on this card
      const { data, error } = await supabase
        .from('cards')
        .select('ocr_text')
        .eq('id', cardId)
        .single();

      if (error) {
        console.error('OCR poll error:', error);
        return;
      }

      // OCR text arrived — stop polling and display it
      if (data?.ocr_text) {
        setOcrText(data.ocr_text);
        setOcrLoading(false);
        stopPolling();
        stopStatusCycle();
      }
    }, OCR_POLL_INTERVAL);
  }

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  // Cycles ocrStatusIndex through OCR_STATUS_MESSAGES every 4 seconds.
  // This gives the user a sense of what Flask is doing (download → OCR → confidence)
  // without needing a websocket — purely cosmetic but much more informative than
  // a static "Extracting text..." message.
  function startStatusCycle() {
    stopStatusCycle();
    statusIntervalRef.current = setInterval(() => {
      setOcrStatusIndex(prev => (prev + 1) % OCR_STATUS_MESSAGES.length);
    }, 4000);
  }
 
  function stopStatusCycle() {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
  }

  // Save edited caption back to Supabase
  // Previously "Save Card" just called router.back() without saving
  async function handleSave() {
    if (!card) return;
    setSaving(true);
    const { error } = await updateCard(card.id, { caption });
    if (error) {
      console.error('Failed to save card:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } else {
       setIsEditMode(false);
    }
    setSaving(false);
  }

   // handleBack decides where to go based on how the user arrived.
  // If fromUpload is true (just created the card) → go to timeline.
  // Otherwise → go back to the previous screen (folder page).
  function handleBack() {
    if (fromUpload) {
      router.replace('/timelineScreen'); 
    } else {
      router.back();
    }
  }

  // Sort card images by order_index for correct display order
  const sortedImages = card?.card_images
    ?.slice()
    .sort((a, b) => a.order_index - b.order_index) ?? [];

  // Loading spinner while initial card fetch is in progress
  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#7B1D1D" />
      </View>
    );
  }

  // Error state if card not found in Supabase
  if (!card) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#7B1D1D', fontFamily: 'Calistoga', fontSize: 18 }}>
          Card not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#557263' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <ImageBackground source={paperTexture} style={styles.paperBackground}>

        {/* Top red banner */}
        <ImageBackground source={redSwirl} style={styles.topBanner} imageStyle={{ resizeMode: 'cover' }}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>

          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {card.title}
            </Text>
          </View>
          
          {/* Edit / Done button in the banner top-right.
              Replaces the star stamp when in edit mode so the user always
              knows which mode they're in. */}
          {isEditMode ? (
            <TouchableOpacity
              onPress={() => setIsEditMode(false)}
              style={styles.editToggleButton}
            >
              <Text style={styles.editToggleText}>Done</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditMode(true)}
              style={styles.editToggleButton}
            >
              <Text style={styles.editToggleText}>Edit</Text>
            </TouchableOpacity>
          )}

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
          {/* Images from Supabase Storage via card_images table */}
          {/* Previously used hardcoded imageMap with local require() assets */}
          {sortedImages.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: 20, marginTop: 16 }}
              contentContainerStyle={{ gap: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', flexGrow: 1,}}
            >
              {sortedImages.map((img, index) => (
                <View key={index} style={styles.imageContainerOuter}>
                  <View style={styles.dashedLine}>
                    <ImageBackground
                      source={swirlySubtle}
                      style={styles.imageContainerInner}
                      imageStyle={{ resizeMode: 'cover', borderRadius: 16 }}
                    >
                      {/* uri from Supabase Storage public URL */}
                      <Image source={{ uri: img.image_url }} style={styles.cardImage} />
                    </ImageBackground>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            // Fallback if no images uploaded for this card
            <View style={[styles.imageContainerOuter, {
              alignItems: 'center', justifyContent: 'center',
              height: 180, marginHorizontal: 20, marginTop: 16,
            }]}>
              <Text style={{ color: '#C2A56F', fontFamily: 'Inter' }}>No images uploaded</Text>
            </View>
          )}

          {/*Tags from getCardTags service — real Supabase data */}
          {/* Re-fetched after OCR completes since Flask sets tags in same pipeline */}
          {/* Previously hardcoded Tag1, Tag2, Tag3 */}
          {tags.length > 0 && (
            <View style={styles.pillRow}>
              {tags.map((tag, index) => {
                const colorSet = TAG_COLORS[index % TAG_COLORS.length];
                return (
                  <View
                    key={index}
                    style={[styles.pill, { backgroundColor: colorSet.bg, borderColor: colorSet.border }]}
                  >
                    <Text style={[styles.pillText, { color: colorSet.text }]}>{tag}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Caption box */}
          {/* Caption editable immediately — user doesn't have to wait for OCR */}
          {/* Saves to Supabase on "Save Card" press via updateCard */}
          <View style={styles.noteBox}>
            <View style={styles.noteHeader}>
              <View style={[styles.noteDot, { backgroundColor: '#557263' }]} />
              <Text style={styles.ocrTitle}>Caption</Text>
              {/* "editing" badge so the user knows the field is live */}
              {isEditMode && (
                <Text style={styles.editingBadge}>editing</Text>
              )}
            </View>
            <View style={styles.noteDivider} />
            {isEditMode ? (
              <TextInput
                style={styles.captionText}
                placeholder="Tap to add a caption..."
                placeholderTextColor="#C2A56F"
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            ) : (
              <Text style={[styles.captionText, { color: caption ? '#5A390E' : '#C2A56F' }]}>
                {caption || 'No caption yet — tap Edit to add one'}
              </Text>
            )}
          </View>

          {/* OCR box */}
          {/* OCR box now shows loading state while Flask is processing */}
          {/* Previously was always empty — never connected to Flask or Supabase */}
          <View style={styles.noteBox}>
            <View style={styles.noteHeader}>
              <View style={[styles.noteDot, { backgroundColor: '#6B4F6B' }]} />
              <Text style={styles.ocrTitle}>OCR Text</Text>
              {/* Spinner in header while OCR is loading */}
              {ocrLoading && (
                <ActivityIndicator
                  size="small"
                  color="#6B4F6B"
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
            <View style={styles.noteDivider} />

            {ocrLoading ? (
              // OCR loading state — shown while Flask /process-card runs
              // Now shows a cycling status message from OCR_STATUS_MESSAGES
              // that mirrors the real Flask pipeline stages so the user
              // knows exactly what's happenin
              <View style={styles.ocrLoadingContainer}>
                <ActivityIndicator size="small" color="#6B4F6B" />
                <Text style={styles.ocrLoadingText}>
                  {OCR_STATUS_MESSAGES[ocrStatusIndex]}
                </Text>
              </View>
            ) : (
              // OCR text from Supabase — appears once Flask finishes
              // Read-only — set by Flask /process-card, not editable by user
              <Text style={styles.ocrBody}>
                {ocrText || 'No OCR text available'}
              </Text>
            )}
          </View>

          {/* Save button only shown in edit mode. 
              It saves to Supabase then returns to view mode (no navigation).
              The old button always navigated away via router.back(). */}
          {isEditMode && (
            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Card'}
              </Text>
            </TouchableOpacity>
          )}

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
  editToggleButton: {
    backgroundColor: 'rgba(246,229,205,0.2)',
    borderWidth: 1, 
    borderColor: 'rgba(246,229,205,0.5)',
    borderRadius: 20, 
    paddingHorizontal: 14, paddingVertical: 5,
  },
  editToggleText: {
    color: '#F6E5CD', 
    fontSize: 13, 
    fontWeight: '700', 
    letterSpacing: 0.5,
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
    width: 280,
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
    justifyContent: 'center',
  },
  dashedLine: {
    borderWidth: 2,
    borderColor: 'rgba(237,232,217,0.55)',
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 8,
  },
  imageContainerInner: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  editingBadge: {
    fontSize: 10, 
    color: '#557263', 
    fontWeight: '600',
    letterSpacing: 0.8, 
    textTransform: 'uppercase',
    backgroundColor: 'rgba(85,114,99,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2, 
    borderRadius: 10,
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
    padding: 14 
  },
  ocrLoadingContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10, 
    padding: 14, 
    minHeight: 50,
  },
  ocrLoadingText: {
    fontSize: 13, color: '#9a7a60',
    fontFamily: 'Inter', fontStyle: 'italic',
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
