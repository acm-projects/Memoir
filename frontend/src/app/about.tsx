import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { ChevronLeft, Flame, ScanLine, FolderOpen, Sparkles } from 'lucide-react-native';

// Small helper type to satisfy lucide-react-native typings when passing color/size directly
type IconProps = { size?: number; color?: string };

export default function AboutPage() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Background paper texture */}
      <ImageBackground
        source={require('../../assets/images/layered-vintage-paper.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Top red banner */}
        <ImageBackground
          source={require('../../assets/images/RED swirl subtle.png')}
          style={styles.banner}
          resizeMode="cover"
        >
          <View style={styles.bannerContent}>
            {/* Back button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft {...({ size: 26, color: '#F6E5CD' } as IconProps)} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.bannerTitle}>About Memoir</Text>

            {/* Spacer to center title */}
            <View style={styles.backButtonSpacer} />
          </View>
        </ImageBackground>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1 — Hero tagline */}
          <Text style={styles.heroEmoji}>🌻</Text>
          <Text style={styles.heroTagline}>Preserving the moments that matter most.</Text>
          <Text style={styles.heroSubtitle}>
            In a world where meaningful messages get lost, Memoir creates a dedicated space to scan, organize,
            and revisit handwritten cards and letters- while helping you design new ones worth saving.
          </Text>

          {/* Ornamental divider */}
          <View style={styles.dividerRow}>
            <Text style={styles.dividerFlourish}>❧</Text>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerFlourish}>❧</Text>
          </View>

          {/* SECTION 2 — Inspiration card */}
          <View style={styles.inspirationCard}>
            <View style={styles.inspirationHeaderRow}>
              <Flame {...({ size: 20, color: '#F6E5CD' } as IconProps)} />
              <Text style={styles.inspirationLabel}>THE INSPIRATION</Text>
            </View>
            <View style={styles.inspirationDivider} />
            <Text style={styles.inspirationBody}>
              I read about elderly families who lost fifty years of handwritten letters in the Palisades fire. It
              made me realize how fragile meaningful memories can be. Almost everyone has a box of birthday cards
              and handwritten notes- they hold moments, not just words.
            </Text>
          </View>

          {/* SECTION 3 — What Memoir does */}
          <Text style={styles.sectionLabel}>WHAT MEMOIR DOES</Text>

          {/* Feature 1 - Preserve */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconCirclePreserve}>
              <ScanLine {...({ size: 20, color: '#FFF9F2' } as IconProps)} />
            </View>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>Preserve the Past</Text>
              <Text style={styles.featureBody}>
                Scan and digitize handwritten cards, letters, and notes so they're never lost.
              </Text>
            </View>
          </View>

          {/* Feature 2 - Organize */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconCircleOrganize}>
              <FolderOpen {...({ size: 20, color: '#FFF9F2' } as IconProps)} />
            </View>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>Organize Your Memories</Text>
              <Text style={styles.featureBody}>
                Create bulletin board-style folders for every event, trip, or milestone in your life.
              </Text>
            </View>
          </View>

          {/* Feature 3 - Create */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconCircleCreate}>
              <Sparkles {...({ size: 20, color: '#FFF9F2' } as IconProps)} />
            </View>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>Create New Moments</Text>
              <Text style={styles.featureBody}>
                Design personalized digital cards with music, animations, and voice notes for the people you love.
              </Text>
            </View>
          </View>

          {/* SECTION 4 — Closing quote */}
          <View style={styles.dividerRowSecondary}>
            <Text style={styles.dividerFlourishSecondary}>❧</Text>
            <View style={styles.dividerLineSecondary} />
            <Text style={styles.dividerFlourishSecondary}>❧</Text>
          </View>

          <Text style={styles.closingQuote}>
            Blending nostalgia with modern AI tools- preserving the past while helping create new moments worth
            saving.
          </Text>

          <Text style={styles.madeWith}>Made with 🌺 by the Memoir team</Text>
        </ScrollView>
      </ImageBackground>

      {/* Bottom navbar pinned */}
      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5EDE0',
  },
  bgImage: {
    flex: 1,
  },
  banner: {
    height: 110,
    width: '100%',
  },
  bannerContent: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonSpacer: {
    width: 40,
  },
  bannerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#F6E5CD',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  heroEmoji: {
    fontSize: 52,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroTagline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B1D1D',
    textAlign: 'center',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#5A390E',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerFlourish: {
    color: '#4A7568',
    fontSize: 20,
    marginHorizontal: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4A7568',
    opacity: 0.6,
  },
  inspirationCard: {
    backgroundColor: '#7B1D1D',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  inspirationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspirationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F6E5CD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
  },
  inspirationDivider: {
    height: 1,
    backgroundColor: 'rgba(246,229,205,0.3)',
    marginVertical: 12,
  },
  inspirationBody: {
    fontSize: 14,
    color: '#F6E5CD',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#8B7355',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  featureCard: {
    backgroundColor: '#EDE8D9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 14,
  },
  featureIconCirclePreserve: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7568',
  },
  featureIconCircleOrganize: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B1D1D',
  },
  featureIconCircleCreate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B6914',
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7B1D1D',
  },
  featureBody: {
    fontSize: 13,
    color: '#5A390E',
    lineHeight: 20,
    marginTop: 4,
  },
  dividerRowSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerFlourishSecondary: {
    color: '#4A7568',
    fontSize: 20,
    marginHorizontal: 6,
  },
  dividerLineSecondary: {
    flex: 1,
    height: 1,
    backgroundColor: '#4A7568',
    opacity: 0.6,
  },
  closingQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#7B1D1D',
    textAlign: 'center',
    lineHeight: 24,
  },
  madeWith: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
    marginTop: 12,
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});
