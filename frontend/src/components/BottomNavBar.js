import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function BottomNavBar({ navigation }) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Image source={require('@/assets/images/tabIcons/home.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MessagesScreen')}>
        <Image source={require('@/assets/images/tabIcons/explore.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreateScreen')} style={styles.centerButton}>
        <Image source={require('@/assets/images/tabIcons/plus.png')} style={styles.centerIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('FoldersScreen')}>
        <Image source={require('@/assets/images/tabIcons/folder.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
        <Image source={require('@/assets/images/tabIcons/profile.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5DEB3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  centerButton: {
    backgroundColor: '#8B0000',
    borderRadius: 30,
    padding: 10,
    elevation: 10,
  },
  centerIcon: {
    width: 30,
    height: 30,
  },
});
