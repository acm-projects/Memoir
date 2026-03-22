import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import { Bell, Lock, ShieldCheck, LogOut, ChevronLeft, Settings } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type IconProps = React.ComponentProps<typeof Settings>;

type SmallIconProps = React.ComponentProps<typeof Bell>;

export default function SettingsPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.mainContent}>
        {/* Top settings card */}
        <View style={styles.topCard}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft {...({ size: 24, color: '#7B1D1D' } as IconProps)} />
          </TouchableOpacity>

          {/* Centered settings icon and title */}
          <View style={styles.topCardContent}>
            <View style={styles.settingsIconCircle}>
              <Settings {...({ size: 52, color: '#7B1D1D' } as IconProps)} />
            </View>
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
          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonInnerRow}>
              <Bell {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={styles.buttonText}>Notifications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonInnerRow}>
              <Lock {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={styles.buttonText}>Change Password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonInnerRow}>
              <ShieldCheck {...({ size: 18, color: '#FFF9F2' } as SmallIconProps)} />
              <Text style={styles.buttonText}>Privacy</Text>
            </View>
          </TouchableOpacity>

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
    </SafeAreaView>
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
    paddingTop: 120,
    paddingBottom: 80,
  },
  topCard: {
    backgroundColor: '#EDE8D9',
    borderRadius: 24,
    width: width * 0.88,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 18,
    zIndex: 3,
  },
  topCardContent: {
    alignItems: 'center',
  },
  settingsIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(123,29,29,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
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
