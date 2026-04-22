import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, Image, ScrollView,
  TextInput, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { supabase } from '../lib/supabase';
import { getCardById, updateCard } from '@/services/cards.service';
import { getCardTags } from '@/services/tags.service';

const paperTexture = require('../../assets/images/layered-vintage-paper.png');
const redSwirl    = require('../../assets/images/RED swirl subtle.png');
const starStamp   = require('../../assets/images/star-stamp.png');
const swirlySubtle = require('../../assets/images/swirly-subtle.png');

const TAG_COLORS = [
  { bg: 'rgba(85,114,99,0.15)',  border: 'rgba(85,114,99,0.4)',  text: '#557263' },
  { bg: 'rgba(107,79,107,0.12)', border: 'rgba(107,79,107,0.35)',text: '#6B4F6B' },
  { bg: 'rgba(139,106,62,0.12)', border: 'rgba(139,106,62,0.35)',text: '#8B6A3E' },
  { bg: 'rgba(123,29,29,0.12)',  border: 'rgba(123,29,29,0.35)', text: '#7B1D1D' },
  { bg: 'rgba(74,103,65,0.12)',  border: 'rgba(74,103,65,0.35)', text: '#4A6741' },
];

interface Card {
  id: string;
  title: string;
  caption: string | null;
  ocr_text: string | null;
  event_date: string | null;
  folder_id: string | null; // needed to route back to the correct bulletin board
  card_images: { image_url: string; order_index: number }[];
}

const OCR_POLL_INTERVAL = 3000;
const OCR_MAX_POLLS = 30;

// ─ ADDED: OCR status messages that mirror what Flask logs in the terminal.
// These cycle through in order while polling so the user sees real progress
// instead of a generic "Extracting text..." spinner.
const OCR_STATUS_MESSAGES = [
  'Downloading image...',
  'Image downloaded — running OCR...',
  'Analysing handwriting...',
  'Checking confidence score...',
  'Finalising text extraction...',
];

export default function OneSpecificCard() {
  const router = useRouter();

  // ─ ADDED: fromUpload param — upload-card passes this so we know where to
  // navigate back to. If true → go to timeline. If absent → go back to folder.
  const params = useLocalSearchParams<{
    id: string;
    title?: string;
    isProcessing?: string;
    fromUpload?: string;
  }>();
  const cardId     = params.id;
  const isProcessing = params.isProcessing === 'true';
  const fromUpload   = params.fromUpload === 'true'; // ─ ADDED

  const [card, setCard]       = useState<Card | null>(null);
  const [folderName, setFolderName] = useState(''); // fetched after card loads for bulletin board routing
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags]       = useState<string[]>([]);

  // ─ ADDED: isEditMode controls whether fields are editable or read-only.
  // Default is false (view mode). User taps "Edit" to enter edit mode.
  // Starts in edit mode automatically if coming straight from upload.
  const [isEditMode, setIsEditMode] = useState(fromUpload);

  const [ocrText, setOcrText]       = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(isProcessing);

  // ─ ADDED: ocrStatusIndex cycles through OCR_STATUS_MESSAGES while polling
  // so the status line updates every few seconds to reflect real Flask progress.
  const [ocrStatusIndex, setOcrStatusIndex] = useState(0);

  const pollIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef     = useRef(0);
  // ─ ADDED: separate interval ref for cycling the status message text
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cardId) fetchCard();
    return () => {
      stopPolling();
      stopStatusCycle(); // ─ ADDED: clean up status interval on unmount
    };
  }, [cardId]);

  useEffect(() => {
    if (isProcessing) {
      startOcrPolling();
      startStatusCycle(); // ─ ADDED: start cycling status messages
    }
    return () => {
      stopPolling();
      stopStatusCycle(); // ─ ADDED
    };
  }, [isProcessing]);

  useEffect(() => {
    if (!ocrLoading && isProcessing) {
      fetchTags();
      stopStatusCycle(); // ─ ADDED: stop cycling once OCR finishes
    }
  }, [ocrLoading]);

  async function fetchCard() {
    setLoading(true);
    const { data, error } = await getCardById(cardId);
    if (error) {
      console.error('Failed to fetch card:', error);
    } else if (data) {
      setCard(data as Card);
      setCaption(data.caption || '');
      if (data.ocr_text) {
        setOcrText(data.ocr_text);
        setOcrLoading(false);
        stopPolling();
        stopStatusCycle(); // ─ ADDED: no need to cycle if OCR already done
      }
      // ─ ADDED: fetch folder name so we can pass it to bulletin-board route on save
      if (data.folder_id) {
        const { data: folderData } = await supabase
          .from('folders')
          .select('name')
          .eq('id', data.folder_id)
          .single();
        if (folderData?.name) setFolderName(folderData.name);
      }
    }
    await fetchTags();
    setLoading(false);
  }

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

  function startOcrPolling() {
    stopPolling();
    pollCountRef.current = 0;

    pollIntervalRef.current = setInterval(async () => {
      pollCountRef.current += 1;

      if (pollCountRef.current >= OCR_MAX_POLLS) {
        console.warn('OCR polling timed out — Flask may still be processing');
        setOcrLoading(false);
        stopPolling();
        stopStatusCycle(); // ─ ADDED: stop status cycle on timeout
        return;
      }

      const { data, error } = await supabase
        .from('cards')
        .select('ocr_text')
        .eq('id', cardId)
        .single();

      if (error) { console.error('OCR poll error:', error); return; }

      if (data?.ocr_text) {
        setOcrText(data.ocr_text);
        setOcrLoading(false);
        stopPolling();
        stopStatusCycle(); // ─ ADDED
      }
    }, OCR_POLL_INTERVAL);
  }

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  // ─ ADDED: Cycles ocrStatusIndex through OCR_STATUS_MESSAGES every 4 seconds.
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

  // ─ CHANGED: handleSave saves to Supabase then routes to the bulletin board
  // of the folder this card belongs to, so the user lands back in context.
  // Falls back to router.back() if folder_id is missing for any reason.
  async function handleSave() {
    if (!card) return;
    setSaving(true);
    const { error } = await updateCard(card.id, { caption });
    if (error) {
      console.error('Failed to save card:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
      setSaving(false);
      return;
    }
    setSaving(false);
    setIsEditMode(false);
    // ─ ADDED: route to the bulletin board for this card's folder after saving
    // card.folder_id is fetched from Supabase via getCardById which selects folder_id
    if (card.folder_id) {
      router.replace({
        pathname: '/bulletin-board',
        params: { id: card.folder_id, title: folderName },
      });
    } else {
      router.back();
    }
  }

  // ─ ADDED: handleBack decides where to go based on how the user arrived.
  // If fromUpload is true (just created the card) → go to timeline.
  // Otherwise → go back to the previous screen (folder page).
  function handleBack() {
    if (fromUpload) {
      router.replace('/timelineScreen'); // ─ adjust pathname to match your timeline route
    } else {
      router.back();
    }
  }

  const sortedImages = card?.card_images
    ?.slice()
    .sort((a, b) => a.order_index - b.order_index) ?? [];

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#7B1D1D" />
      </View>
    );
  }

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
          {/* ─ CHANGED: back arrow now calls handleBack() instead of router.back()
              so it routes to timeline vs folder depending on fromUpload param */}
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>{'←'}</Text>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {card.title}
            </Text>
          </View>

          {/* ─ ADDED: Edit / Done button in the banner top-right.
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
        </ImageBackground>

        {/* Color accent strip */}
        <View style={styles.colorStrip}>
          <View style={[styles.stripSegment, { backgroundColor: '#6B4F6B' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#7B1D1D' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#8B6A3E' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#557263' }]} />
          <View style={[styles.stripSegment, { backgroundColor: '#4A6741' }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Images */}
          {sortedImages.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // ─ FIXED: was marginHorizontal:20 which clipped the cards — now
              // using paddingHorizontal on contentContainerStyle instead so
              // cards have breathing room but aren't cut off
              style={{ marginTop: 16 }}
              contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
            >
              {sortedImages.map((img, index) => (
                <View key={index} style={styles.imageContainerOuter}>
                  <View style={styles.dashedLine}>
                    <ImageBackground
                      source={swirlySubtle}
                      style={styles.imageContainerInner}
                      imageStyle={{ resizeMode: 'cover', borderRadius: 16 }}
                    >
                      <Image source={{ uri: img.image_url }} style={styles.cardImage} />
                    </ImageBackground>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.imageContainerOuter, {
              alignItems: 'center', justifyContent: 'center',
              height: 180, marginHorizontal: 20, marginTop: 16,
            }]}>
              <Text style={{ color: '#C2A56F', fontFamily: 'Inter' }}>No images uploaded</Text>
            </View>
          )}

          {/* Tags */}
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
          <View style={styles.noteBox}>
            <View style={styles.noteHeader}>
              <View style={[styles.noteDot, { backgroundColor: '#557263' }]} />
              <Text style={styles.ocrTitle}>Caption</Text>
              {/* ─ ADDED: "editing" badge so the user knows the field is live */}
              {isEditMode && (
                <Text style={styles.editingBadge}>editing</Text>
              )}
            </View>
            <View style={styles.noteDivider} />
            {/* ─ CHANGED: TextInput is only editable when isEditMode is true.
                In view mode it renders as a read-only styled text block. */}
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
          <View style={styles.noteBox}>
            <View style={styles.noteHeader}>
              <View style={[styles.noteDot, { backgroundColor: '#6B4F6B' }]} />
              <Text style={styles.ocrTitle}>OCR Text</Text>
              {ocrLoading && (
                <ActivityIndicator size="small" color="#6B4F6B" style={{ marginLeft: 8 }} />
              )}
            </View>
            <View style={styles.noteDivider} />

            {ocrLoading ? (
              // ─ CHANGED: was static "Extracting text from your card..."
              // Now shows a cycling status message from OCR_STATUS_MESSAGES
              // that mirrors the real Flask pipeline stages so the user
              // knows exactly what's happening.
              <View style={styles.ocrLoadingContainer}>
                <ActivityIndicator size="small" color="#6B4F6B" />
                <Text style={styles.ocrLoadingText}>
                  {OCR_STATUS_MESSAGES[ocrStatusIndex]}
                </Text>
              </View>
            ) : (
              <Text style={styles.ocrBody}>
                {ocrText || 'No OCR text available'}
              </Text>
            )}
          </View>

          {/* ─ CHANGED: Save button only shown in edit mode.
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
  container: { flex: 1, backgroundColor: '#F5EDE0' },
  paperBackground: { flex: 1, width: '100%', height: '100%' },
  topBanner: {
    height: 130, width: '105%',
    paddingTop: 40, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backArrow: { fontSize: 24, color: '#F6E5CD' },
  // ─ ADDED: edit/done toggle button styles in the banner
  editToggleButton: {
    backgroundColor: 'rgba(246,229,205,0.2)',
    borderWidth: 1, borderColor: 'rgba(246,229,205,0.5)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
  },
  editToggleText: {
    color: '#F6E5CD', fontSize: 13, fontWeight: '700', letterSpacing: 0.5,
  },
  colorStrip: { flexDirection: 'row', height: 4, width: '100%' },
  stripSegment: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  titleRow: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: {
    fontSize: 26, fontWeight: 'bold', color: '#F6E5CD',
    flex: 1, textAlign: 'center', marginRight: 60,
  },
  imageContainerOuter: {
    // ─ FIXED: added explicit width so the container isn't collapsed inside
    // the horizontal ScrollView. Without a fixed width, width:'100%' on the
    // Image resolves to ~0 because horizontal ScrollViews have no bounded width.
    width: 280,
    backgroundColor: '#4A7568', borderRadius: 18,
    padding: 12, marginTop: 16, borderWidth: 2, borderColor: '#557263',
    shadowColor: '#2C1A0E', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  dashedLine: {
    borderWidth: 2, borderColor: 'rgba(237,232,217,0.55)',
    borderStyle: 'dashed', borderRadius: 18, padding: 8,
  },
  imageContainerInner: {
    borderRadius: 12, overflow: 'hidden', padding: 10,
    alignItems: 'center', justifyContent: 'center',
    // ─ FIXED: explicit width so ImageBackground fills the container
    width: '100%',
  },
  // ─ FIXED: explicit width instead of '100%' — resolves correctly now that
  // the parent has a fixed width
  cardImage: { width: 236, height: 260, borderRadius: 8, resizeMode: 'cover' },
  pillRow: {
    flexDirection: 'row', paddingHorizontal: 20,
    marginTop: 12, gap: 8, flexWrap: 'wrap',
  },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  noteBox: {
    backgroundColor: '#EDE8D9', borderRadius: 16, overflow: 'hidden',
    marginHorizontal: 20, marginTop: 12, borderWidth: 1.5, borderColor: '#D4C9A8',
    shadowColor: '#8B6A3E', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: 'rgba(85, 114, 99, 0.08)',
  },
  noteDot: { width: 8, height: 8, borderRadius: 4 },
  noteDivider: { height: 1, backgroundColor: '#D4C9A8' },
  ocrTitle: { fontSize: 14, fontWeight: '700', color: '#6D1B12', letterSpacing: 0.3 },
  // ─ ADDED: small "editing" badge shown next to Caption label in edit mode
  editingBadge: {
    fontSize: 10, color: '#557263', fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase',
    backgroundColor: 'rgba(85,114,99,0.12)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  captionText: {
    fontSize: 14, fontStyle: 'italic', color: '#5A390E',
    minHeight: 60, padding: 14,
  },
  ocrBody: { fontSize: 13, color: '#6D1B12', minHeight: 50, padding: 14 },
  ocrLoadingContainer: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 14, minHeight: 50,
  },
  ocrLoadingText: { fontSize: 13, color: '#9a7a60', fontStyle: 'italic' },
  saveButton: {
    backgroundColor: '#7B1D1D', borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', marginTop: 16, marginHorizontal: 20,
  },
  saveButtonText: { color: '#F6E5CD', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  navbarWrapper: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 100 },
});