import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import ImagePreview from '../components/ImagePreview';
import BottomNavbar from '../components/BottomNavbar';

export default function UploadCard() {
  const router = useRouter();
  const fileInputRef = useRef<any>(null);
  const fileInputCameraRef = useRef<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<number | string | null>(null);

  const onPickFileWebGallery = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
  };

  const onPickFileWebCamera = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
  };

  const triggerFileInput = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current && fileInputRef.current.click();
      return;
    }
    // Native gallery
    let ImagePickerModule: any;
    try {
      ImagePickerModule = await import('expo-image-picker');
    } catch (err) {
      console.warn('expo-image-picker not available:', err);
      alert('Please install expo-image-picker (run: expo install expo-image-picker) to pick images on native devices.');
      return;
    }

    const permission = await ImagePickerModule.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission required to access photos.');
      return;
    }
    const res = await ImagePickerModule.launchImageLibraryAsync({ quality: 0.8 });
    if (!res.cancelled) {
      setUploadedImage(res.uri);
    }
  };

  const triggerCamera = async () => {
    if (Platform.OS === 'web') {
      // open mobile camera capture if available
      fileInputCameraRef.current && fileInputCameraRef.current.click();
      return;
    }

    // Native camera
    let ImagePickerModule: any;
    try {
      ImagePickerModule = await import('expo-image-picker');
    } catch (err) {
      console.warn('expo-image-picker not available:', err);
      alert('Please install expo-image-picker (run: expo install expo-image-picker) to use the camera on native devices.');
      return;
    }

    // Request camera permission using whichever API is available
    const cameraPermission = ImagePickerModule.requestCameraPermissionsAsync
      ? await ImagePickerModule.requestCameraPermissionsAsync()
      : ImagePickerModule.requestPermissionsAsync
      ? await ImagePickerModule.requestPermissionsAsync()
      : null;

    if (cameraPermission && !cameraPermission.granted) {
      alert('Camera permission required to take photos.');
      return;
    }

    const res = await ImagePickerModule.launchCameraAsync({ quality: 0.8 });
    if (!res.cancelled) {
      setUploadedImage(res.uri);
    }
  };

  const onNext = () => {
    const card = {
      id: uuidv4(),
      image: uploadedImage,
      title,
      caption,
      date: selectedDate ? selectedDate.toISOString() : null,
      folderId: selectedFolder,
    };
    console.log('Next (saved to temp)', card);
    // proceed to next step (folder selection will be separate)
    router.push('/timelineScreen');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/timelineScreen' as any)} style={styles.backButton}>
          <Text style={styles.backChevron}>{'<'} </Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Upload Card</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* push content further down to avoid clashing with top decorations */}
        <View style={styles.previewArea}>
          <ImagePreview uri={uploadedImage} />

          <View style={styles.uploadRow}>
            <TouchableOpacity onPress={triggerCamera} style={styles.smallButton}>
              <Text style={styles.smallButtonText}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={triggerFileInput} style={styles.smallButton}>
              <Text style={styles.smallButtonText}>🖼️</Text>
            </TouchableOpacity>
          </View>

          {/* web hidden inputs for gallery and camera capture */}
          {Platform.OS === 'web' && (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickFileWebGallery} />
              <input ref={fileInputCameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onPickFileWebCamera} />
            </>
          )}
        </View>

        <View style={styles.form}>
          <TextInput placeholder="Add a title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Add a caption" value={caption} onChangeText={setCaption} style={styles.input} />

          {Platform.OS === 'web' ? (
            <div style={{ width: '100%' }}>
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                onChange={(e: any) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d9cfc0' }}
              />
            </div>
          ) : (
            <TouchableOpacity style={styles.dateField} onPress={() => alert('Date picker not implemented in this test build')}>
              <Text style={{ color: '#5A390E' }}>{selectedDate ? selectedDate.toDateString() : 'Date'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonsRowSingle}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5EEE1' },
  topBar: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: 'transparent' },
  backButton: { padding: 8 },
  backChevron: { fontSize: 20, color: '#5A390E' },
  topTitle: { fontSize: 18, fontWeight: '600', color: '#5A390E', marginLeft: 8 },
  content: { padding: 16, paddingTop: 80, paddingBottom: 160 },
  previewArea: { backgroundColor: '#F5EEE1', borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  uploadRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  smallButton: { width: 52, height: 36, borderRadius: 8, backgroundColor: '#7a2a2a', alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
  smallButtonText: { color: '#fff', fontSize: 18 },
  form: { marginTop: 16 },
  input: { backgroundColor: '#F5EEE1', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#d9cfc0' },
  dateField: { backgroundColor: '#F5EEE1', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d9cfc0' },
  buttonsRowSingle: { alignItems: 'center', marginTop: 24 },
  nextButton: { backgroundColor: '#7a2a2a', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 28 },
  nextText: { color: '#fff', fontSize: 20 },
});