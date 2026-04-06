import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';
import { supabase } from '@/lib/supabase';     
import { getMostFrequentTags, TagFrequency, getBoardContents, BoardContents } from '@/services/analytics.services'; 

const { width } = Dimensions.get('window');

type SettingsIconProps = React.ComponentProps<typeof Settings>;

const cardsByMonth = [
  { created: 3, sent: 1 }, { created: 0, sent: 0 },
  { created: 5, sent: 3 }, { created: 2, sent: 2 },
  { created: 8, sent: 4 }, { created: 1, sent: 0 },
  { created: 6, sent: 5 }, { created: 4, sent: 2 },
  { created: 9, sent: 6 }, { created: 3, sent: 1 },
  { created: 7, sent: 3 }, { created: 2, sent: 1 },
];

export default function ProfilePage({ name = 'Tejasvi Annamaraju', entriesCount = 67, friendsCount = 45, foldersCount = 12 }) {

  const [topTags, setTopTags] = useState<TagFrequency[]>([]);
  const [boardContents, setBoardContents] = useState<BoardContents>({
    stickers: 0,
    photos: 0,
    notes: 0,
    templates: 0,
  });

  const router = useRouter();
  const iconColor = '#7B1D1D';
  const tagColors = [
    '#557263',
    '#7B1D1D',
    '#8B6A3E',
    '#4A6741',
    '#6B4F6B',
  ];

  const barAnimPhotos = useRef(new Animated.Value(0)).current;
  const barAnimStickers = useRef(new Animated.Value(0)).current;
  const barAnimNotes = useRef(new Animated.Value(0)).current;
  const barAnimTemplates = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTags();
    fetchBoardContents();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('card-tags-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'card_tags' },
        () => { fetchTags(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    Animated.stagger(80, [
      Animated.timing(barAnimPhotos, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(barAnimStickers, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(barAnimNotes, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(barAnimTemplates, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [barAnimPhotos, barAnimStickers, barAnimNotes, barAnimTemplates]);

  async function fetchTags() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await getMostFrequentTags(user.id, 5);
    if (error) console.error('Error fetching tags:', error);
    else if (data) setTopTags(data);
  }

  async function fetchBoardContents() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await getBoardContents(user.id);
    if (error) console.error('Error fetching board contents:', error);
    else if (data) setBoardContents(data);
  }

  const BOARD_TOTAL = boardContents.photos + boardContents.stickers + boardContents.notes + boardContents.templates || 1;
  const trackWidth = width - 40 - 72 - 36 - 16;

  const photoPercent = Math.round((boardContents.photos / BOARD_TOTAL) * 100);
  const stickerPercent = Math.round((boardContents.stickers / BOARD_TOTAL) * 100);
  const notesPercent = Math.round((boardContents.notes / BOARD_TOTAL) * 100);
  const templatesPercent = Math.round((boardContents.templates / BOARD_TOTAL) * 100);

  const getMonthColor = (value: number) => {
    if (value === 0) return '#F5EDE0';
    if (value <= 2) return '#D4A099';
    if (value <= 5) return '#A84848';
    return '#7B1D1D';
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={[styles.settingsButton, { left: undefined, right: 20, alignItems: 'flex-end' }]}
        onPress={() => router.push('/settings' as any)}
      >
        <View style={styles.settingsCircle}>
          <Settings {...({ size: 22, color: iconColor } as SettingsIconProps)} />
        </View>
      </TouchableOpacity>

      <View style={styles.creamPanel}>
        <View style={styles.outerCard}>
          <View style={styles.innerCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🌷</Text>
            </View>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>{entriesCount}</Text> Entries
              </Text>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>{friendsCount}</Text> Friends
              </Text>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>{foldersCount}</Text> Folders
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.dividerRow}>
          <Text style={styles.dividerFlourish}>❧</Text>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerFlourish}>❧</Text>
        </View>

        <ScrollView
          style={styles.analyticsScroll}
          contentContainerStyle={styles.analyticsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.userCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <View style={{ backgroundColor: '#F2E8D0', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>🕯️</Text>
              </View>
              <Text style={styles.userName}>The Nostalgic Curator</Text>
            </View>
            <Text style={styles.userMessage}>Lover of vintage aesthetics, journaling, and all things cozy. Sharing my thoughts and memories one entry at a time.</Text>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 8, marginHorizontal: 20 }]}>YOUR MEMORY THEMES</Text>
          <View style={styles.statsCard}>
            <View style={styles.tagsRow}>
              {topTags.length > 0 ? (
                topTags.map((tag, index) => (
                  <View
                    key={tag.tag_id}
                    style={[styles.tagStyle, { backgroundColor: tagColors[index % tagColors.length] }]}
                  >
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#a07050', fontSize: 13, paddingVertical: 6 }}>
                  No tags yet
                </Text>
              )}
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>WHAT FILLS YOUR BOARDS</Text>
          <View style={styles.analyticsCard}>
            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Photos</Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[styles.barFill, {
                    backgroundColor: '#4A7568',
                    width: barAnimPhotos.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, trackWidth * (photoPercent / 100)],
                    }),
                  }]}
                />
              </View>
              <Text style={styles.barPercent}>{photoPercent}%</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Stickers</Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[styles.barFill, {
                    backgroundColor: '#7B1D1D',
                    width: barAnimStickers.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, trackWidth * (stickerPercent / 100)],
                    }),
                  }]}
                />
              </View>
              <Text style={styles.barPercent}>{stickerPercent}%</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Notes</Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[styles.barFill, {
                    backgroundColor: '#8B6914',
                    width: barAnimNotes.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, trackWidth * (notesPercent / 100)],
                    }),
                  }]}
                />
              </View>
              <Text style={styles.barPercent}>{notesPercent}%</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Templates</Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[styles.barFill, {
                    backgroundColor: '#6B5B45',
                    width: barAnimTemplates.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, trackWidth * (templatesPercent / 100)],
                    }),
                  }]}
                />
              </View>
              <Text style={styles.barPercent}>{templatesPercent}%</Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>CARDS BY MONTH</Text>
          <View style={[styles.analyticsCard, { marginTop: 8 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heatmapScrollContent}>
              <View>
                <View style={styles.monthLabelsRow}>
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, index) => (
                    <Text key={`${m}-${index}`} style={[styles.monthLabel, { marginLeft: index === 0 ? 28 : 0 }]}>{m}</Text>
                  ))}
                </View>
                <View style={styles.heatmapRowsWrapper}>
                  <View style={styles.heatmapRow}>
                    <Text style={styles.heatmapRowLabel}>created</Text>
                    {cardsByMonth.map((month, idx) => (
                      <View key={`c-${idx}`} style={{ width: 18, height: 18, borderRadius: 3, margin: 1, backgroundColor: getMonthColor(month.created) }} />
                    ))}
                  </View>
                  <View style={styles.heatmapRow}>
                    <Text style={styles.heatmapRowLabel}>sent</Text>
                    {cardsByMonth.map((month, idx) => (
                      <View key={`s-${idx}`} style={{ width: 18, height: 18, borderRadius: 3, margin: 1, backgroundColor: getMonthColor(month.sent) }} />
                    ))}
                  </View>
                </View>
                <View style={styles.legendRow}>
                  <Text style={styles.legendText}>fewer</Text>
                  {['#F5EDE0', '#D4A099', '#A84848', '#7B1D1D'].map((c, i) => (
                    <View key={i} style={{ width: 18, height: 18, borderRadius: 3, marginHorizontal: 1, backgroundColor: c }} />
                  ))}
                  <Text style={styles.legendText}>more</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#7B1D1D' },
  creamPanel: {
    flex: 1, backgroundColor: '#EDE8D9',
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    marginTop: 160, paddingTop: 0, alignItems: 'center', zIndex: 1,
  },
  mainContent: { flex: 1, alignItems: 'center', paddingTop: 150, paddingBottom: 80 },
  settingsButton: { position: 'absolute', top: 50, right: 20, zIndex: 20, alignItems: 'flex-end' },
  settingsCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDE8D9',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
    borderColor: '#C4504A33', shadowColor: '#C4504A', shadowOpacity: 0.08,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  outerCard: {
    backgroundColor: '#4F7C6E', borderRadius: 24, padding: 16,
    width: width * 0.88, shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, zIndex: 2, marginTop: -50,
  },
  innerCard: {
    backgroundColor: '#EDE8D9', borderRadius: 18, paddingVertical: 35,
    paddingHorizontal: 24, alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, position: 'relative',
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 4,
    borderColor: '#7B1D1D', backgroundColor: '#EDE8D9',
    alignItems: 'center', justifyContent: 'center', marginTop: -20,
    marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.10,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 3, alignSelf: 'center',
  },
  avatarEmoji: { fontSize: 36, textAlign: 'center' },
  name: { marginTop: 8, fontSize: 22, color: '#7B1D1D', fontFamily: 'serif', fontWeight: 'bold', textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 13, width: '100%' },
  statsText: { fontSize: 13, color: '#7B1D1D', textAlign: 'center', marginHorizontal: 12 },
  statsNumber: { fontWeight: 'bold', color: '#7B1D1D', fontSize: 13 },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 3,
    width: width * 0.88, alignSelf: 'center', zIndex: 2,
  },
  dividerFlourish: { color: '#7B1D1D', fontSize: 20, marginHorizontal: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#7B1D1D', opacity: 0.6 },
  buttonStack: { marginTop: 8, gap: 10, width: '100%', alignItems: 'center', zIndex: 1 },
  button: {
    width: width * 0.72, paddingVertical: 14, borderRadius: 999,
    backgroundColor: '#7B1D1D', shadowColor: '#000', shadowOpacity: 0.10,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  buttonText: { color: '#FFF9F2', fontSize: 18, fontFamily: 'serif', textAlign: 'center', fontWeight: '600' },
  navbarContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10 },
  userCard: {
    backgroundColor: '#7B1D1D', borderRadius: 8, padding: 18,
    marginBottom: 15, marginHorizontal: 16, marginTop: 12, elevation: 3, width: 350,
  },
  statsOuter: { backgroundColor: '#7B1D1D', padding: 8, marginTop: 28, width: 300, alignItems: 'center', height: 120, borderRadius: 8 },
  statsCard: {
    backgroundColor: '#EDE8D9', borderColor: '#C8B89A', borderWidth: 0.5,
    borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16,
    width: width - 40, alignSelf: 'center', marginTop: 8,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 5, marginTop: 5, width: '100%' },
  tagStyle: {
    backgroundColor: '#557263', borderRadius: 10, paddingVertical: 6,
    paddingHorizontal: 12, opacity: 0.75, alignItems: 'center', justifyContent: 'center',
  },
  userName: { fontSize: 16, color: '#f5f0e8', textAlign: 'left', fontWeight: '700' },
  userMessage: { fontSize: 13, color: '#f5f0e8', textAlign: 'left', marginTop: 4 },
  tagText: { color: '#FDFAF4', fontSize: 12, fontWeight: '500' },
  sectionLabel: {
    fontSize: 11, color: '#8B7355', fontWeight: '600', letterSpacing: 1,
    textTransform: 'uppercase', marginHorizontal: 20, marginBottom: 6, alignSelf: 'flex-start',
  },
  analyticsCard: {
    backgroundColor: '#EDE8D9', borderRadius: 16, borderWidth: 0.5,
    borderColor: '#C8B89A', padding: 16, marginHorizontal: 20, marginTop: 20, width: width - 40,
  },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  barLabel: { width: 72, fontSize: 13, color: '#5A390E', fontWeight: '500', fontFamily: 'serif' },
  barTrack: {
    flex: 1, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(123,29,29,0.1)', marginHorizontal: 8, overflow: 'hidden',
  },
  barFill: { height: 10, borderRadius: 5 },
  barPercent: { width: 36, fontSize: 12, color: '#5A390E', textAlign: 'right', fontFamily: 'serif' },
  monthLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  monthLabel: { fontSize: 10, color: '#8B7355', textAlign: 'center', flex: 1, fontFamily: 'serif' },
  heatmapScrollContent: { paddingRight: 16 },
  heatmapRowsWrapper: { marginTop: 4 },
  heatmapRow: { flexDirection: 'row', alignItems: 'center' },
  heatmapRowLabel: { fontSize: 9, color: '#8B7355', width: 36, fontFamily: 'serif' },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 },
  legendText: { fontSize: 9, color: '#8B7355', marginHorizontal: 4, fontFamily: 'serif' },
  analyticsScroll: { flex: 1, width: '100%' },
  analyticsScrollContent: { paddingBottom: 120, alignItems: 'center' },
});