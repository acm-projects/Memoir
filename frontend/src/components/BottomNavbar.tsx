import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { House, Mail, FolderOpen, User } from 'lucide-react-native';

const plusSeal = require('../../assets/images/plus-seal.png');

type AnyIconProps = React.ComponentProps<typeof House>;

export default function BottomNavbar() {
  const router = useRouter();
  const iconColor = '#7a2a2a';

  return (
    <View style={styles.bottomNavbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.replace('/timelineScreen' as any)}
      >
        <House {...({ size: 30, color: iconColor } as AnyIconProps)} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.replace('/messages' as any)}
      >
        <Mail {...({ size: 30, color: iconColor } as AnyIconProps)} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.centerButtonWrap}
        onPress={() => router.replace('/upload-card' as any)}
      >
        <Image source={plusSeal} style={styles.plusSealIcon} resizeMode="contain" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.replace('/view-folder copy' as any)}
      >
        <FolderOpen {...({ size: 30, color: iconColor } as AnyIconProps)} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.replace('/profile' as any)}
      >
        <User {...({ size: 30, color: iconColor } as AnyIconProps)} />
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
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSealIcon: {
    width: 100,
    height: 100,
  },
});