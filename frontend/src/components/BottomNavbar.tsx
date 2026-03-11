import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function BottomNavbar() {
  const router = useRouter();
  return (
    <View style={styles.bottomNavbar}>
      <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/' as any)}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/messages' as any)}>
        <Text>Messages</Text>
      </TouchableOpacity>
      <View style={styles.centerButton}>
        <TouchableOpacity onPress={() => router.replace('/upload-card' as any)} style={styles.centerTouchable}>
          <Text style={{ color: '#fff' }}>✉︎</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/folders' as any)}>
        <Text>Folders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/profile' as any)}>
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavbar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: '#e9dccd', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navButton: { alignItems: 'center' },
  centerButton: { marginTop: -28 },
  centerTouchable: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#7a2a2a', alignItems: 'center', justifyContent: 'center' },
});
