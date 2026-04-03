import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import {
  ChevronLeft,
  UserRound,
  Heart,
  MessageCircle,
  BookImage,
  FolderOpen,
  Bell,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const paperBg = require('../../assets/images/layered-vintage-paper.png');
const redSwirl = require('../../assets/images/RED swirl subtle.png');

type ToggleItem = {
  id: string;
  label: string;
  icon: 'UserRound' | 'Heart' | 'MessageCircle' | 'BookImage' | 'FolderOpen' | 'Bell';
  enabled: boolean;
};

type IconProps = React.ComponentProps<typeof Bell>;

const INITIAL_TOGGLES: ToggleItem[] = [
  { id: '1', label: 'New Followers', icon: 'UserRound', enabled: true },
  { id: '2', label: 'Memory Likes', icon: 'Heart', enabled: true },
  { id: '3', label: 'Comments', icon: 'MessageCircle', enabled: true },
  { id: '4', label: 'New Card Added', icon: 'BookImage', enabled: false },
  { id: '5', label: 'Folder Updates', icon: 'FolderOpen', enabled: false },
  { id: '6', label: 'App Announcements', icon: 'Bell', enabled: true },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [toggles, setToggles] = useState<ToggleItem[]>(INITIAL_TOGGLES);

  const handleToggle = (id: string) => {
    setToggles(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  const renderIcon = (icon: ToggleItem['icon']) => {
    const color = '#FFF9F2';
    const size = 18;

    switch (icon) {
      case 'UserRound':
        return <UserRound {...({ size, color } as IconProps)} />;
      case 'Heart':
        return <Heart {...({ size, color } as IconProps)} />;
      case 'MessageCircle':
        return <MessageCircle {...({ size, color } as IconProps)} />;
      case 'BookImage':
        return <BookImage {...({ size, color } as IconProps)} />;
      case 'FolderOpen':
        return <FolderOpen {...({ size, color } as IconProps)} />;
      case 'Bell':
      default:
        return <Bell {...({ size, color } as IconProps)} />;
    }
  };

  return (
    <View style={styles.safeRoot}>
      <View style={styles.rootBg}>
        <ImageBackground source={paperBg} style={styles.paperBg} resizeMode="cover">
          {/* Top red banner */}
          <ImageBackground source={redSwirl} style={styles.redBanner} resizeMode="cover">
            <View style={styles.bannerContent}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ChevronLeft {...({ size: 26, color: '#F6E5CD' } as IconProps)} />
              </TouchableOpacity>

              <Text style={styles.bannerTitle}>Notifications</Text>

              {/* Spacer to center title */}
              <View style={styles.bannerRightSpacer} />
            </View>
          </ImageBackground>

          {/* Decorative divider */}
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerFlourish}>❧</Text>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerFlourish}>❧</Text>
          </View>

          {/* Section header */}
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionHeaderText}>Notification Preferences</Text>
          </View>

          {/* Notification list */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {toggles.map(item => {
              const enabled = item.enabled;
              return (
                <View key={item.id} style={styles.toggleRow}>
                  {/* Left: icon + label */}
                  <View style={styles.toggleLeft}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: enabled ? '#4A7568' : '#C8B89A' },
                      ]}
                    >
                      {renderIcon(item.icon)}
                    </View>
                    <Text style={styles.toggleLabel}>{item.label}</Text>
                  </View>

                  {/* Right: custom toggle */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleToggle(item.id)}
                  >
                    <View
                      style={[
                        styles.toggleTrack,
                        { backgroundColor: enabled ? '#4A7568' : '#C8B89A' },
                      ]}
                    >
                      <View
                        style={[
                          styles.toggleThumb,
                          { transform: [{ translateX: enabled ? 24 : 4 }] },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </ImageBackground>

        {/* Navbar pinned to bottom */}
        <View style={styles.navbarContainer}>
          <BottomNavbar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: '#F5EDE0',
  },
  rootBg: {
    flex: 1,
    backgroundColor: '#F5EDE0',
  },
  paperBg: {
    flex: 1,
    width,
    height,
  },
  redBanner: {
    width: '100%',
    height: 110,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bannerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#F6E5CD',
  },
  bannerRightSpacer: {
    width: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  dividerFlourish: {
    color: '#4A7568',
    fontSize: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4A7568',
    opacity: 0.7,
    marginHorizontal: 8,
  },
  sectionHeaderWrap: {
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  toggleRow: {
    backgroundColor: '#EDE8D9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3B2C1A',
  },
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF9F2',
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});
