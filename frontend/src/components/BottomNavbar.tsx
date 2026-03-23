import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { House, Mail, FolderOpen, User } from 'lucide-react-native';

const plusSeal = require('../../assets/images/plus-seal.png');




type AnyIconProps = React.ComponentProps<typeof House>;

export default function BottomNavbar() {
  
  const router = useRouter();

  const handlePlusPress = () => {
    Alert.alert(
      'Add a Card',
      'What would you like to do',
      [
        {text: 'Upload a Card',
          onPress: () => router.push('/upload-card' as any),
        },
         {text: 'Create a Card',
          onPress: () => router.push('/create-card' as any),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }
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
        style={[styles.navButton, styles.centerButtonWrap]}
        onPress={handlePlusPress}
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
  },
  centerButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSealIcon: {
    width: 80,
    height: 80,
  },
});