import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';

const { width } = Dimensions.get('window');
const bgImage = require('../../assets/images/swirly-subtle.png');

export default function EditProfilePage({
  initialName = '',
  initialBirthday = '',
  initialEmail = '',
  avatarSrc,
  onSave,
  onChangePassword,
}: {
  initialName?: string;
  initialBirthday?: string;
  initialEmail?: string;
  avatarSrc?: string;
  onSave?: (data: { name: string; birthday: string; email: string }) => void;
  onChangePassword?: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [birthday, setBirthday] = useState(initialBirthday);
  const [email, setEmail] = useState(initialEmail);
  const router = useRouter();

  const Divider = () => (
    <View style={styles.dividerContainer}>
      <Text style={styles.dividerIcon}>❧</Text>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerIcon}>❧</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={bgImage}
        style={styles.bg}
        resizeMode="repeat"
        imageStyle={{ resizeMode: 'repeat' }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/profile')}
            accessibilityLabel="Back"
          >
            <Text style={{ fontSize: 28, color: '#7B1D1D' }}>{'‹'}</Text>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Divider />
              <Text style={styles.title}>Edit Profile</Text>

              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {avatarSrc ? (
                  <Image source={{ uri: avatarSrc }} style={styles.avatar} />
                ) : (
                  <Text style={{ fontSize: 36 }}>🌸</Text>
                )}
              </View>

              {/* Input fields */}
              <View style={styles.fieldsContainer}>
                <Text style={styles.label}>
                  Name<Text style={{ color: '#B91C1C' }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name*"
                  placeholderTextColor="#7B6B4E"
                />
                <Text style={styles.label}>
                  Birthday<Text style={{ color: '#B91C1C' }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={birthday}
                  onChangeText={setBirthday}
                  placeholder="Birthday*"
                  placeholderTextColor="#7B6B4E"
                />
                <Text style={styles.label}>
                  Email<Text style={{ color: '#B91C1C' }}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email*"
                  placeholderTextColor="#7B6B4E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Buttons */}
              <TouchableOpacity style={styles.changePasswordBtn} onPress={onChangePassword}>
                <Text style={styles.changePasswordText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => onSave?.({ name, birthday, email })}
              >
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>

              <Divider />
            </View>
          </ScrollView>

          {/* Navbar pinned to bottom */}
          <View style={styles.navbarContainer}>
            {/* intentionally left empty inside KeyboardAvoidingView */}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      <View style={styles.navbarContainer}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 100, // space for navbar
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  card: {
    width: width * 0.9, // wider — 90% of screen
    backgroundColor: '#EDE8D9',
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 24, // less horizontal padding so fields are wider
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
  dividerIcon: {
    fontSize: 20,
    color: '#7B1D1D',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#7B1D1D',
    opacity: 0.6,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#6B1A1A',
    backgroundColor: '#EDE8D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  fieldsContainer: {
    width: '100%',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#5A390E',
    marginBottom: 4,
    fontWeight: '500',
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#C8B89A',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#3B2C1A',
  },
  changePasswordBtn: {
    width: '80%',
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: '#8B2E2E',
    alignItems: 'center',
    marginTop: 16,
  },
  changePasswordText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  saveBtn: {
    width: '80%',
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: '#5C1010',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});