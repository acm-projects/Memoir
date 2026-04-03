import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Bell, Lock, ShieldCheck, LogOut, ChevronLeft, Settings, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type IconProps = React.ComponentProps<typeof Settings>;

type SmallIconProps = React.ComponentProps<typeof Bell>;

export default function SettingsPage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/layered-vintage-paper.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.root}>
        {/* Top red banner */}
        <ImageBackground
          source={require('../../assets/images/RED swirl subtle.png')}
          style={styles.banner}
          resizeMode="cover"
        >
          <View style={styles.bannerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft {...({ size: 24, color: '#F6E5CD' } as IconProps)} />
            </TouchableOpacity>

            <Text style={styles.bannerTitle}>Settings</Text>

            <View style={{ width: 24 }} />
          </View>
        </ImageBackground>

        {/* Centered settings icon badge */}
        <View style={styles.settingsBadge}>
          <Settings {...({ size: 32, color: '#7B1D1D' } as IconProps)} />
        </View>

        {/* Ornamental divider between icon badge and buttons */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerFlourish}>❧</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Scrollable main content: button list */}
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings buttons as list rows */}
          <View style={styles.buttonList}>
            {/* Notifications -> /notifications */}
            <TouchableOpacity
              style={styles.buttonRow}
              onPress={() => router.push('/notifications' as any)}
            >
              <View style={styles.buttonLeftRow}>
                <View style={styles.iconCircleDefault}>
                  <Bell {...({ size: 16, color: '#EDE8D9' } as SmallIconProps)} />
                </View>
                <Text style={styles.buttonLabel}>Notifications</Text>
              </View>
              <ChevronRight {...({ size: 16, color: '#C8B89A' } as SmallIconProps)} />
            </TouchableOpacity>

            {/* Edit Profile -> /edit-profile */}
            <TouchableOpacity
              style={styles.buttonRow}
              onPress={() => router.push('/edit-profile' as any)}
            >
              <View style={styles.buttonLeftRow}>
                <View style={styles.iconCircleDefault}>
                  <Lock {...({ size: 16, color: '#EDE8D9' } as SmallIconProps)} />
                </View>
                <Text style={styles.buttonLabel}>Edit Profile</Text>
              </View>
              <ChevronRight {...({ size: 16, color: '#C8B89A' } as SmallIconProps)} />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity
              style={styles.buttonRow}
              onPress={() => router.push('/about' as any)}
            >
              <View style={styles.buttonLeftRow}>
                <View style={styles.iconCircleDefault}>
                  <ShieldCheck {...({ size: 16, color: '#EDE8D9' } as SmallIconProps)} />
                </View>
                <Text style={styles.buttonLabel}>About</Text>
              </View>
              <ChevronRight {...({ size: 16, color: '#C8B89A' } as SmallIconProps)} />
            </TouchableOpacity>

            {/* Log Out */}
            <TouchableOpacity style={[styles.buttonRow, styles.logoutRow]}>
              <View style={styles.buttonLeftRow}>
                <View style={styles.iconCircleLogout}>
                  <LogOut {...({ size: 16, color: '#EDE8D9' } as SmallIconProps)} />
                </View>
                <Text style={styles.logoutLabel}>Log Out</Text>
              </View>
              <ChevronRight {...({ size: 16, color: '#C8B89A' } as SmallIconProps)} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Navbar pinned to bottom */}
        <View style={styles.navbarContainer}>
          <BottomNavbar />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  banner: {
    height: 140,
    width: '100%',
  },
  bannerContent: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#F6E5CD',
    textAlign: 'center',
  },
  settingsBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDE8D9',
    borderWidth: 2,
    borderColor: '#C8B89A',
    alignSelf: 'center',
    marginTop: -36,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8B89A',
    opacity: 0.6,
  },
  dividerFlourish: {
    color: '#C8B89A',
    fontSize: 16,
    marginHorizontal: 8,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  buttonList: {
    paddingHorizontal: 0,
  },
  buttonRow: {
    backgroundColor: '#EDE8D9',
    borderRadius: 14,
    marginHorizontal: 24,
    marginBottom: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleDefault: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleLogout: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5C1010',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B2C1A',
  },
  logoutRow: {
    backgroundColor: '#F5EDE0',
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7B1D1D',
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});