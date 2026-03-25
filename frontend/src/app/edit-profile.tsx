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
      <ImageBackground source={bgImage} style={styles.bg}>
        {/* Green header section */}
        <View style={styles.greenHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Avatar overlapping header and card */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            {avatarSrc ? (
              <Image source={{ uri: avatarSrc }} style={styles.avatar} />
            ) : (
              <Text style={{ fontSize: 36 }}>🌸</Text>
            )}
          </View>
        </View>

        {/* KeyboardAvoidingView wrapping the card */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Divider />

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
  greenHeader: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,232,217,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#EDE8D9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EDE8D9',
    textAlign: 'center',
    flex: 1,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -40,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#EDE8D9',
    borderRadius: 32,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 8,
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
    borderWidth: 3,
    borderColor: '#7B1D1D',
    backgroundColor: '#EDE8D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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