import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomNavbar from '../components/BottomNavbar';

const paperTexture = require('../../assets/images/layered-vintage-paper.png');
const swirlyBg = require('../../assets/images/swirly-subtle.png');

// simple helper to create a temporary id without crypto
const createTempId = () => `card-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export default function UploadCard() {
  const router = useRouter();
  const fileInputRef = useRef<any>(null);
  const fileInputCameraRef = useRef<any>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<number | string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const safeUploadedImages = Array.isArray(uploadedImages) ? uploadedImages : [];

  const onPickFileWebGallery = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImages((prev) => [...prev, url]);
  };

  const onPickFileWebCamera = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImages((prev) => [...prev, url]);
  };

  const triggerFileInput = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current && fileInputRef.current.click();
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled && res.assets && res.assets[0]?.uri) {
      const uri = res.assets[0].uri;
      setUploadedImages((prev) => [...prev, uri]);
    }
  };

  const triggerCamera = async () => {
    if (Platform.OS === 'web') {
      fileInputCameraRef.current && fileInputCameraRef.current.click();
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission required.');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled && res.assets && res.assets[0]?.uri) {
      const uri = res.assets[0].uri;
      setUploadedImages((prev) => [...prev, uri]);
    }
  };

  const onNext = () => {
    const card = {
      id: createTempId(),
      image: safeUploadedImages,
      title,
      caption,
      date: selectedDate ? selectedDate.toISOString() : null,
      folderId: selectedFolder,
    };
    console.log('Next (saved to temp)', card);
    router.push('/selectMemory' as any);
  };

  return (
    // Outer green background with swirly image
    <ImageBackground
      source={swirlyBg}
      style={styles.screen}
      imageStyle={{ width: '100%', height: '100%' }}
    >
      {/* Paper texture card fills the rest */}
      <ImageBackground
        source={paperTexture}
        style={styles.paperCard}
        imageStyle={styles.paperImage}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Upload Card</Text>
          </View>

          {/* Image preview */}
          <View style={styles.previewArea}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              {safeUploadedImages.length === 0 ? (
                <View style={styles.previewPlaceholder}>
                  <Text style={styles.previewPlaceholderText}>No image selected</Text>
                </View>
              ) : (
                safeUploadedImages.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ))
              )}
            </ScrollView>
            <View style={styles.uploadRow}>
              <TouchableOpacity onPress={triggerCamera} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>📷</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={triggerFileInput} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>🖼️</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS === 'web' && (
              <>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickFileWebGallery} />
                <input ref={fileInputCameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onPickFileWebCamera} />
              </>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Date</Text>
            {Platform.OS === 'web' ? (
              <div style={{ width: '100%', marginBottom: 12 }}>
                <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                  onChange={(e: any) =>
                    setSelectedDate(e.target.value ? new Date(e.target.value) : null)
                  }
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #d9cfc0',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    fontSize: 15,
                  }}
                />
              </div>
            ) : (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: '#5A390E' }}>
                  {selectedDate ? selectedDate.toDateString() : 'Select a date'}
                </Text>
              </TouchableOpacity>
            )}

            {Platform.OS !== 'web' && showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={(event: any, date?: Date) => {
                  setShowDatePicker(false);
                  if ((event as any).type === 'set' && date) {
                    setSelectedDate(date);
                  }
                }}
              />
            )}

            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder=""
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Caption</Text>
            <TextInput
              placeholder=""
              value={caption}
              onChangeText={setCaption}
              style={[styles.input, styles.captionInput]}
              multiline
            />
          </View>

          <View style={styles.buttonsRowSingle}>
            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>

      <BottomNavbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#4A7568',
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  paperCard: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
    borderRadius: 34,
    overflow: 'hidden',
  },
  paperImage: {
    borderRadius: 34,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    gap: 12,
  },
  backArrow: {
    fontSize: 24,
    color: '#7B1D1D',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7B1D1D',
  },
  previewArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 10,
  },
  previewPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: 'rgba(200,184,154,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  previewPlaceholderText: {
    color: '#7B6B4E',
    fontSize: 14,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  smallButton: {
    width: 52,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#7a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  smallButtonText: { color: '#fff', fontSize: 18 },
  form: { marginTop: 8 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A390E',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(235, 220, 190, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#d9cfc0',
    fontSize: 15,
    color: '#3B2C1A',
  },
  captionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsRowSingle: { alignItems: 'center', marginTop: 24 },
  nextButton: {
    backgroundColor: '#7a2a2a',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 28,
  },
  nextText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});