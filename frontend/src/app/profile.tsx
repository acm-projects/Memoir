import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';
export default function ProfilePage({ name = "Tejasvi Annamaraju", entriesCount = 67, friendsCount = 45 }) {
  return (
    <SafeAreaView style={styles.root}>
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
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View entries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>About</Text>
          </TouchableOpacity>
        </View>
        <BottomNavbar/>
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7B1D1D', // updated to match button color
    justifyContent: 'center',
    position: 'relative', // Needed for absolute ellipse
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    paddingTop: 40,
  },
  outerCard: {
    backgroundColor: '#4F7C6E',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 2,
  },
  innerCard: {
    backgroundColor: '#EDE8D9',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    width: 280,
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
    width: 260,
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
  height: 600,
  backgroundColor: '#EDE8D9',
  borderTopLeftRadius: 1000,
  borderTopRightRadius: 1100,
  zIndex: 0,
  marginTop: 0, // removed negative margin to avoid bottom gap
  paddingBottom: 60, // ensures it fills to the bottom on tall screens
},
  buttonStack: {
    marginTop: 8,
    gap: 16,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  bottomNavbar: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10,
  },
  button: {
    width: 220,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#7B1D1D',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF9F2',
    fontSize: 18,
    fontFamily: 'serif',
    textAlign: 'center',
    fontWeight: '600',
  },
});