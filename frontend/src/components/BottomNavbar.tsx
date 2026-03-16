import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.centerButtonWrap}>
      <TouchableOpacity onPress={() => router.push('/upload-card' as any)} style={styles.centerTouchable}>
        <Ionicons name="add" size={44} color={'#fff'} />
      </TouchableOpacity>
    </View>
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
  bottomNavbar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: '#e9dccd', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navButton: { alignItems: 'center', justifyContent: 'center' },
  navText: { marginTop: 4, fontSize: 12, color: '#5A390E' },
  icon: { width: 28, height: 28, marginBottom: 2 },
  centerButtonWrap: { marginTop: -36, zIndex: 2 },
  centerTouchable: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', shadowColor: '#7a2a2a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  centerIcon: { display: 'none' },
});
