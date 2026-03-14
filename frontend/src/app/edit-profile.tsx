import React from 'react';
import { View, Text, StyleSheet, TextInput, ImageBackground } from 'react-native';
import { RedButton } from '../components/redButton';

export default function EditProfile() {
  return (
    <ImageBackground 
      source={require('../../assets/images/swirls.jpg')} 
      style={styles.background}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        <TextInput style={styles.input} placeholder="Name*" />
        <TextInput style={styles.input} placeholder="Birthday*" />
        <TextInput style={styles.input} placeholder="Email*" />
        <RedButton title="Change password" onPress={() => {}} />
        <RedButton title="Save Changes" onPress={() => {}} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
