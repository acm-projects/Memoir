import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import BottomNavbar from '../components/BottomNavbar';
import Svg, { Circle } from 'react-native-svg';

const paperTexture = require('../../assets/images/layered-vintage-paper.png');
const swirlyBg = require('../../assets/images/swirly-subtle.png');

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
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const onPickFileWebGallery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImages((prev) => [...prev, url]);
  };

  const onPickFileWebCamera = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImages((prev) => [...prev, url]);
  };

  const triggerFileInput = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const res = result.assets[0];
      if (res.uri) {
        setUploadedImages((prev) => [...prev, res.uri]);
      }
    }
  };

  const triggerCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const res = result.assets[0];
      if (res.uri) {
        setUploadedImages((prev) => [...prev, res.uri]);
      }
    }
  };

  const deleteImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onNext = () => {
    const card = {
      id: createTempId(),
      image: uploadedImages,
      title,
      caption,
      date: selectedDate ? selectedDate.toISOString() : null,
      folderId: selectedFolder,
    };
    console.log('Next (saved to temp)', card);
    router.push('/selectMemory' as any);
  };

  return (
    <>
      <ImageBackground
        source={swirlyBg}
        style={styles.screen}
        imageStyle={{ width: '100%', height: '100%' }}
      >
        <View style={styles.headerArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Upload Card</Text>
          </View>
        </View>

        <ImageBackground
          source={paperTexture}
          style={styles.paperCard}
          imageStyle={styles.paperImage}
        >
          <View
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            {containerSize.width > 0 && containerSize.height > 0 && (
              <Svg
                width={containerSize.width}
                height={containerSize.height}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
              >
                {Array.from({ length: Math.ceil(containerSize.width / 6) }).map((_, col) =>
                  Array.from({ length: Math.ceil(containerSize.height / 6) }).map((_, row) => (
                    <Circle
                      key={`dot-${col}-${row}`}
                      cx={col * 6 + 3}
                      cy={row * 6 + 3}
                      r={0.6}
                      fill="#8B6A3E"
                      opacity={0.06}
                    />
                  ))
                )}
              </Svg>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Photos</Text>

              <View style={styles.previewContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ alignItems: 'center' }}
                >
                  {(!uploadedImages || uploadedImages.length === 0) ? (
                    <View style={styles.previewPlaceholder}>
                      <Text style={styles.previewPlaceholderText}>No image selected</Text>
                    </View>
                  ) : (
                    uploadedImages.map((uri, index) => (
                      <View key={index} style={{ position: 'relative', marginRight: 10 }}>
                        <Image
                          source={{ uri }}
                          style={styles.previewImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deleteBadge}
                          onPress={() => deleteImage(index)}
                        >
                          <X size={12} color="#FFF9F2" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>

              <View style={styles.uploadButtonsRow}>
                <TouchableOpacity
                  onPress={triggerCamera}
                  style={styles.cameraButton}
                >
                  <Camera size={18} color="#EDE8D9" />
                  <Text style={styles.cameraButtonText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={triggerFileInput}
                  style={styles.galleryButton}
                >
                  <ImageIcon size={18} color="#7B1D1D" />
                  <Text style={styles.galleryButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {Platform.OS === 'web' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={onPickFileWebGallery}
                  />
                  <input
                    ref={fileInputCameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={onPickFileWebCamera}
                  />
                </>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.section} onLayout={e => setContainerSize(e.nativeEvent.layout)}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Date</Text>
                {Platform.OS === 'web' ? (
                  <div style={{ width: '100%', marginBottom: 0 }}>
                    <input
                      type="date"
                      value={
                        selectedDate
                          ? selectedDate.toISOString().slice(0, 10)
                          : ''
                      }
                      onChange={(e: any) =>
                        setSelectedDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      style={{
                        width: '100%',
                        padding: 12,
                        borderRadius: 10,
                        border: '1px solid #D4C9A8',
                        backgroundColor: 'rgba(200,184,154,0.25)',
                        fontSize: 15,
                        color: '#3B2C1A',
                      }}
                    />
                  </div>
                ) : (
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      style={{
                        color: selectedDate ? '#3B2C1A' : '#A09070',
                      }}
                    >
                      {selectedDate
                        ? selectedDate.toDateString()
                        : 'Select a date'}
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
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Title</Text>
                <TextInput
                  placeholder=""
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  placeholderTextColor="#A09070"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Caption</Text>
                <TextInput
                  placeholder=""
                  value={caption}
                  onChangeText={setCaption}
                  style={[styles.input, styles.captionInput]}
                  multiline
                  placeholderTextColor="#A09070"
                />
              </View>
            </View>

            <View style={styles.nextButtonWrapper}>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Text style={styles.nextText}>Next →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </ImageBackground>

      <View style={styles.navbarWrapper}>
        <BottomNavbar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#4A7568',
  },
  headerArea: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#EDE8D9',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EDE8D9',
    marginLeft: 90,
    fontFamily: 'Calistoga',
    textAlign: 'center',
  },
  paperCard: {
    flex: 1,
    backgroundColor: '#F5E8D8',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
    marginTop: 8,
  },
  paperImage: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#557263',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    fontFamily: 'Calistoga, serif',
  },
  previewContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: 'rgba(200,184,154,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7B1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  previewPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C8B89A',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(200,184,154,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  previewPlaceholderText: {
    fontSize: 14,
    color: '#C8B89A',
    textAlign: 'center',
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cameraButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7B1D1D',
  },
  cameraButtonText: {
    color: '#EDE8D9',
    fontSize: 14,
    fontWeight: '600',
  },
  galleryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#7B1D1D',
  },
  galleryButtonText: {
    color: '#7B1D1D',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#D4C9A8',
    opacity: 0.5,
    marginVertical: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#557263',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: 'Calistoga, serif',
  },
  input: {
    backgroundColor: 'rgba(200,184,154,0.25)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4C9A8',
    fontSize: 15,
    color: '#3B2C1A',
  },
  captionInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  nextButtonWrapper: {
    marginTop: 8,
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: '#7B1D1D',
    borderRadius: 999,
    paddingVertical: 16,
    width: '100%',
  },
  nextText: {
    color: '#EDE8D9',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  navbarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});