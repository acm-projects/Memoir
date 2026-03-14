import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import BottomNavbar from '../components/BottomNavbar';
import DecorativeDivider from '../components/DecorativeDivider';

export default function EditProfileScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/images/swirls.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.container}>
        <View style={styles.panel}>
          <DecorativeDivider />
          <Text style={styles.title}>Edit Profile</Text>
          <Image source={require('../../assets/images/default-avatar.png')} style={styles.avatar} />
          <FormInput label="Name*" placeholder="Enter your name" />
          <FormInput label="Birthday*" placeholder="Enter your birthday" />
          <FormInput label="Email*" placeholder="Enter your email" />
          <PrimaryButton title="Change Password" style={styles.changePasswordButton} />
          <PrimaryButton title="Save Changes" style={styles.saveButton} />
        </View>
      </View>
      <BottomNavbar navigation={navigation} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    backgroundColor: '#F5F5DC',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#7a2a2a',
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  changePasswordButton: {
    backgroundColor: '#CD5C5C',
    width: '60%',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#8B0000',
    width: '100%',
    marginVertical: 10,
  },
});
