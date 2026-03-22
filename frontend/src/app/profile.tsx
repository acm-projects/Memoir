import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type SettingsIconProps = React.ComponentProps<typeof Settings>;

export default function ProfilePage({ name = 'Tejasvi Annamaraju', entriesCount = 67, friendsCount = 45 }) {
  const router = useRouter();
  const iconColor = '#7B1D1D';

  return (
    <View style={styles.root}>
      {/* Top-left settings button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/settings' as any)}
      >
        <View style={styles.settingsCircle}>
          <Settings {...({ size: 22, color: iconColor } as SettingsIconProps)} />
        </View>
      </TouchableOpacity>

      <View style={styles.mainContent}>
        {/* Profile Card */}
        <View style={styles.outerCard}>
          <View style={styles.innerCard}>
            {/* Avatar */}
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🌷</Text>
            </View>
            {/* Name */}
            <Text style={styles.name}>{name}</Text>
            {/* Stats */}
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>{entriesCount}</Text> Entries
              </Text>
              <Text style={styles.statsText}>
                <Text style={styles.statsNumber}>{friendsCount}</Text> Friends
              </Text>
            </View>
          </View>
        </View>

        {/* Decorative Divider */}
        <View style={styles.dividerRow}>
          <Text style={styles.dividerFlourish}>❧</Text>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerFlourish}>❧</Text>
        </View>

        {/* Elliptical background panel for buttons */}
        <View style={styles.ellipsePanel} />

        {/* Buttons */}
        <View style={styles.buttonStack}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/edit-profile')}>
            <Text style={styles.buttonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/entries')}>
            <Text style={styles.buttonText}>View entries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/about')}>
            <Text style={styles.buttonText}>About</Text>
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
    paddingBottom: 80, // space for navbar
  },
  settingsButton: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
  },
  settingsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE8D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCard: {
    backgroundColor: '#4F7C6E',
    borderRadius: 24,
    padding: 16,
    width: width * 0.88, // wider — 88% of screen width
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
    alignItems: 'center',
    width: '100%', // fills outer card
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarCircle: {
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
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarEmoji: {
    fontSize: 36,
    textAlign: 'center',
  },
  name: {
    marginTop: 8,
    fontSize: 22,
    color: '#7B1D1D',
    fontFamily: 'serif',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 8,
    width: '100%',
  },
  statsText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  statsNumber: {
    fontWeight: 'bold',
    color: '#7B1D1D',
    fontSize: 13,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 18,
    width: width * 0.88,
    alignSelf: 'center',
    zIndex: 2,
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
    marginTop: 8,
    gap: 16,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  button: {
    width: width * 0.72, // wider buttons too
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#7B1D1D',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#FFF9F2',
    fontSize: 18,
    fontFamily: 'serif',
    textAlign: 'center',
    fontWeight: '600',
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});