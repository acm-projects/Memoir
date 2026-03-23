import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';

const { width } = Dimensions.get('window');

type SettingsIconProps = React.ComponentProps<typeof Settings>;


export default function ProfilePage({ name = 'Tejasvi Annamaraju', entriesCount = 67, friendsCount = 45, foldersCount = 12 }) {
  const router = useRouter();
  const iconColor = '#7B1D1D';
  const tagColors = [
  '#557263', // teal/sage — already using this
  '#7B1D1D', // maroon
  '#8B6A3E', // warm brown
  '#4A6741', // deeper green
  '#6B4F6B', // muted mauve/purple
];

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
            {/* User Card */}
            {/* Stats */}
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

        {/* Decorative Divider */}
        <View style={styles.dividerRow}>
          <Text style={styles.dividerFlourish}>❧</Text>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerFlourish}>❧</Text>
        </View>

        {/* Elliptical background panel for buttons */}
        <View style={styles.ellipsePanel} />
        <View style={styles.userCard}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6}}>
    <View style={{backgroundColor: '#F2E8D0', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20}}>🕯️</Text>
    </View>
    <Text style={styles.userName}>The Nostalgic Curator</Text>
  </View>
  <Text style={styles.userMessage}>Lover of vintage aesthetics, journaling, and all things cozy. Sharing my thoughts and memories one entry at a time.</Text>
            </View>
            <Text style={{textAlign: 'left', color: '#7B1D1D'}}>Your memory themes</Text>
          <View style={styles.statsCard}>
            <View style={styles.tagsRow}>
              {['family', 'friends', 'birthday', 'celebration', 'fun'].map((tag, index) => (
                <View style={[styles.tagStyle, {backgroundColor: tagColors[index % tagColors.length]}]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
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
    marginTop: -40, // pull up to overlap with settings button
  },
  innerCard: {
    backgroundColor: '#EDE8D9',
    borderRadius: 18,
    paddingVertical: 35,
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
    gap: 20,
    marginTop: 13,
    width: '100%',
  },
  statsText: {
    fontSize: 13,
    color: '#7B1D1D',
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
    marginTop: -2,
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
    top: 245,
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
    gap: 10,
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
  userCard: {
    backgroundColor: '#7B1D1D',
    borderRadius: 8,
    padding: 18,
    marginBottom: 15,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 3,
    width: 350,
  },
  statsOuter: {
    backgroundColor: '#7B1D1D',
    padding: 8,
    marginTop: 28,
    width: 300,
    alignItems: 'center',
    height: 120,
    borderRadius: 8,
  },
  statsCard: {
    backgroundColor: '#f5f0e8',
    borderColor: '#7B1D1D',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '90%',
    height: 80,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 5,
    marginTop: 5,
    width: '100%',
  },
  tagStyle: {
    backgroundColor: '#557263',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    opacity: 0.75,
    alignItems: 'center',
  justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    color: '#f5f0e8',
    textAlign: 'left',
    fontWeight: '700',
  },
  userMessage: {
    fontSize: 13,
    color: '#f5f0e8',
    textAlign: 'left',
    marginTop: 4,
  },
  tagText: {
  color: '#FDFAF4',  // or '#F5EFE0' — light cream color
  fontSize: 12,
  fontWeight: '500',
},

});