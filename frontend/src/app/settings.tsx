import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Bell, Lock, ShieldCheck, LogOut, ChevronLeft, Settings } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type IconProps = React.ComponentProps<typeof Settings>;

type SmallIconProps = React.ComponentProps<typeof Bell>;

export default function SettingsPage() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Top-left back button to mirror profile layout */}
      <TouchableOpacity style={styles.backButtonFloating} onPress={() => router.back()}>
        <View style={styles.backCircle}>
          <ChevronLeft {...({ size: 22, color: '#7B1D1D' } as IconProps)} />
        </View>
      </TouchableOpacity>

      <View style={styles.mainContent}>
        {/* Settings Card: green outer, beige inner, similar to profile */}
        <View style={styles.outerCard}>
          <View style={styles.innerCard}>
            {/* Icon circle */}
            <View style={styles.settingsIconCircle}>
              <Settings {...({ size: 40, color: '#7B1D1D' } as IconProps)} />
            </View>
            {/* Title */}
            <Text style={styles.settingsTitle}>Settings</Text>
            {/* Ornamental divider */}
            <View style={styles.dividerRow}>
              <Text style={styles.dividerFlourish}>❧</Text>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerFlourish}>❧</Text>
            </View>
          </View>
        </View>

        {/* Elliptical background panel for buttons */}
        <View style={styles.ellipsePanel} />

        {/* Settings buttons */}
        <View style={styles.buttonStack}>
          {/* Notifications -> /notifications */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/notifications' as any)}
          >
            <View style={styles.buttonInnerRow}>
              <Bell {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={styles.buttonText}>Notifications</Text>
            </View>
          </TouchableOpacity>

          {/* Edit Profile -> /edit-profile */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <View style={styles.buttonInnerRow}>
              <Lock {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonInnerRow}>
              <ShieldCheck {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={styles.buttonText}>About</Text>
            </View>
          </TouchableOpacity>

          {/* Log Out */}
          <TouchableOpacity style={[styles.button, styles.logoutButton]}>
            <View style={styles.buttonInnerRow}>
              <LogOut {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={[styles.buttonText, styles.logoutText]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navbar pinned to bottom */}
      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7B1D1D',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 180,
    paddingBottom: 80,
  },
  // Floating back button similar positioning to profile's settings button
  backButtonFloating: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE8D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Green outer and beige inner, mirroring profile card
  outerCard: {
    backgroundColor: '#4F7C6E',
    borderRadius: 24,
    padding: 16,
    width: width * 0.88,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 2,
  },
  innerCard: {
    backgroundColor: '#EDE8D9',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    paddingTop: 60, // moved icon + title further down
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  settingsIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#7B1D1D',
    backgroundColor: '#EDE8D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  settingsTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B1D1D',
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
  },
  dividerFlourish: {
    color: '#7B1D1D',
    fontSize: 20,
    marginHorizontal: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#7B1D1D',
    opacity: 0.6,
  },
  ellipsePanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 520,
    backgroundColor: '#EDE8D9',
    borderTopLeftRadius: 1200,
    borderTopRightRadius: 1200,
    zIndex: 0,
  },
  buttonStack: {
    marginTop: 32,
    gap: 14,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  button: {
    width: width * 0.72,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#7B1D1D',
  },
  logoutButton: {
    backgroundColor: '#5C1010',
  },
  buttonInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF9F2',
    fontSize: 17,
    fontWeight: '600',
  },
  logoutText: {
    color: '#C0392B',
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
