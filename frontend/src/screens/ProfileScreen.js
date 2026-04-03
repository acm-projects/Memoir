import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import PrimaryButton from '../components/PrimaryButton';
import BottomNavbar from '../components/BottomNavbar';
import DecorativeDivider from '../components/DecorativeDivider';

export default function ProfileScreen({ navigation }) {
  const handleEditProfile = () => navigation.navigate('EditProfileScreen');
  const handleViewEntries = () => navigation.navigate('EntriesScreen');
  const handleAbout = () => navigation.navigate('AboutScreen');

  return (
    <ImageBackground
      source={require('../../assets/images/swirls.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.2 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileCard />
        <DecorativeDivider />
        <View style={styles.buttonsContainer}>
          <PrimaryButton title="Edit Profile" onPress={handleEditProfile} />
          <PrimaryButton title="View Entries" onPress={handleViewEntries} />
          <PrimaryButton title="About" onPress={handleAbout} />
        </View>
      </ScrollView>
      <BottomNavbar navigation={navigation} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#EDE3D3',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  divider: { display: 'none' },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
