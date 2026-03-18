import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const plusSeal = require('../../assets/images/plus-seal.png');

export default function BottomNavbar() {
  const router = useRouter();
  return (
    <View style={styles.bottomNavbar}>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/timelineScreen' as any)}>
        <Ionicons name="home-outline" size={28} color="#7a2a2a" style={styles.icon} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/messages' as any)}>
        <Ionicons name="mail-outline" size={28} color="#7a2a2a" style={styles.icon} />
        <Text style={styles.navText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.centerButtonWrap} onPress={() => router.push('/upload-card' as any)}>
        <Image source={plusSeal} style={styles.plusSealIcon} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/view-folder' as any)}>
        <Ionicons name="folder-outline" size={28} color="#7a2a2a" style={styles.icon} />
        <Text style={styles.navText}>Folders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile' as any)}>
        <Ionicons name="person-outline" size={28} color="#7a2a2a" style={styles.icon} />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: '#e9dccd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  navButton: { alignItems: 'center', justifyContent: 'center' },
  navText: { marginTop: 4, fontSize: 12, color: '#5A390E' },
  icon: { width: 28, height: 28, marginBottom: 2 },
  centerButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSealIcon: {
    width: 100,
    height: 100,
  },
});
