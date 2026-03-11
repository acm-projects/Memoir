import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import ImagePreview from '../components/ImagePreview';
import FolderCard from '../components/FolderCard';
import BottomNavbar from '../components/BottomNavbar';

type Folder = { id: string | number; name: string; thumbnail?: any };

const foldersMock: Folder[] = [
  { id: 1, name: "16th Birthday", thumbnail: require('../../assets/images/tutorial-web.png') },
  { id: 2, name: "Prom", thumbnail: require('../../assets/images/react-logo.png') },
  { id: 3, name: "Mom's Birthday", thumbnail: require('../../assets/images/react-logo.png') },
];

export default function UploadCard() {
  const router = useRouter();
  const fileInputRef = useRef<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<number | string | null>(null);
  const [folders] = useState<Folder[]>(foldersMock);

  const onPickFileWeb = (e: any) => {
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
    // Native: use Expo ImagePicker dynamically (so bundler doesn't require it at build time)
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
    const res = await ImagePickerModule.launchImageLibraryAsync({ mediaTypes: ImagePickerModule.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.cancelled) {
      setUploadedImage(res.uri);
    }
  };

  const onSave = () => {
    const card = {
      id: uuidv4(),
      image: uploadedImage,
      title,
      caption,
      date: selectedDate ? selectedDate.toISOString() : null,
      folderId: selectedFolder,
    };
    console.log('Saved card', card);
    // keep routing simple for testing
    router.replace('/');
  };

  const onDiscard = () => {
    setUploadedImage(null);
    setTitle('');
    setCaption('');
    setSelectedDate(null);
    setSelectedFolder(null);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backChevron}>{'<'} </Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Upload Card</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewArea}>
          <ImagePreview uri={uploadedImage} />

          <View style={styles.uploadRow}>
            <TouchableOpacity onPress={triggerFileInput} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>+</Text>
            </TouchableOpacity>
            {/* web file input */}
            {Platform.OS === 'web' && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onPickFileWeb}
              />
            )}
          </View>

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

        <View style={styles.folderSection}>
          <Text style={styles.folderTitle}>Add to a folder</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderList}>
            <TouchableOpacity style={[styles.folderCard, styles.createCard]} onPress={() => alert('Create folder (not implemented)')}>
              <Text style={styles.plusSign}>+</Text>
            </TouchableOpacity>
            {folders.map((f) => (
              <FolderCard key={String(f.id)} folder={f} selected={selectedFolder === f.id} onSelect={(id: string | number) => setSelectedFolder(id)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.discardButton} onPress={onDiscard}>
            <Text style={styles.discardText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
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
  content: { padding: 16, paddingBottom: 120 },
  previewArea: { backgroundColor: '#557263', borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center' },
  uploadRow: { position: 'absolute', right: 16, top: 16 },
  uploadButton: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#2b6b5a', alignItems: 'center', justifyContent: 'center' },
  uploadButtonText: { color: '#fff', fontSize: 24 },
  form: { marginTop: 16 },
  input: { backgroundColor: '#F5EEE1', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#d9cfc0' },
  dateField: { backgroundColor: '#F5EEE1', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d9cfc0' },
  folderSection: { marginTop: 20 },
  folderTitle: { fontSize: 24, color: '#5A390E', marginBottom: 12 },
  folderList: { flexDirection: 'row' },
  folderCard: { width: 96, height: 120, marginRight: 12, backgroundColor: '#8e2f2f', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  folderCardSelected: { borderWidth: 3, borderColor: '#ffd6d3' },
  folderThumb: { width: 64, height: 64, borderRadius: 6, backgroundColor: '#fff' },
  folderName: { color: '#fff', marginTop: 6, fontSize: 12, textAlign: 'center' },
  createCard: { backgroundColor: '#7a2a2a', alignItems: 'center', justifyContent: 'center' },
  plusSign: { fontSize: 32, color: '#fff' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  discardButton: { backgroundColor: '#7a2a2a', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 24 },
  discardText: { color: '#fff' },
  saveButton: { backgroundColor: '#557263', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 24 },
  saveText: { color: '#fff' },
  bottomNavbar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: '#e9dccd', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navButton: { alignItems: 'center' },
  centerButton: { marginTop: -28 },
  centerTouchable: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#7a2a2a', alignItems: 'center', justifyContent: 'center' },
});