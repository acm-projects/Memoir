import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { RedButton } from '../components/redButton';
import AppTabs from '../components/app-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    birthday: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground 
          source={require('../../assets/images/swirls.jpg')} 
          style={styles.background}
          imageStyle={{ resizeMode: 'cover', opacity: 0.2 }}
        >
          <View style={styles.container}>
            <View style={styles.profileCard}>
              <Image source={userData.avatar ? { uri: userData.avatar } : require('../../assets/images/default-avatar.png')} style={styles.avatar} />
              <Text style={styles.name}>{userData.fullName}</Text>
              <Text style={styles.stats}>{userData.birthday}</Text>
              <Text style={styles.stats}>{userData.email}</Text>
            </View>
            <RedButton title="Edit profile" onPress={handleEditProfile} />
            <RedButton title="View entries" onPress={() => router.push('/entries')} />
            <RedButton title="About" onPress={() => router.push('/about')} />
          </View>
          <AppTabs />
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
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
  profileCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stats: {
    fontSize: 16,
    color: '#555',
  },
});
