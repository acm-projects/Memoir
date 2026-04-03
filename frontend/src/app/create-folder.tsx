import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet, Pressable, ScrollView,
  Image, ImageBackground, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomNavbar from '../components/BottomNavbar';

const STAMPS = [
  { key: "usa", source: require("../../assets/images/usa-stamp.png"), label: "USA" },
  { key: "cat", source: require("../../assets/images/cat-stamp.png"), label: "Cat" },
  { key: "orange", source: require("../../assets/images/orange-flower-stamp.png"), label: "Orange" },
  { key: "bird", source: require("../../assets/images/bird-stamp.png"), label: "Bird" },
  { key: "brazil", source: require("../../assets/images/brasil-stamp.png"), label: "Brazil" },
];
// TODO: Replace mock data with real backend response

export default function CreateFolder() {
  const [title, setTitle] = useState("");
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const canCreate = title.trim().length > 0 && selectedStamp !== null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <ImageBackground
      source={require("../../assets/images/swirly-subtle.png")}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Manual back button above the paperBack */}
        <Pressable
          onPress={() => router.back()}
          style={{
            alignSelf: 'flex-start',
            marginTop: 65,
            marginLeft: 16,
            marginBottom: 8,
            zIndex: 100,
            backgroundColor: '#6D1B12', borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 6,
            flexDirection: 'row', alignItems: 'center', gap: 4
          }}
        >
          <Text style={{ color: '#f5e6c8', fontSize: 14, fontFamily: 'Calistoga' }}>← Back</Text>
        </Pressable>
        <ImageBackground
          source={require("../../assets/images/layered-vintage-paper.png")}
          style={styles.paperBack}
        >
          {/* Remove paddingTop to move title higher */}
          <View>
            <Text style={styles.headerTitle}>New Memory Folder</Text>
            {/* Decorative divider */}
            <View style={styles.decorativeDivider} />
            <View style={styles.body}>
              {/* Title input */}
              <Text style={styles.label}>Folder title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                maxLength={40}
              />
              {/* Hint text */}
              <Text style={styles.inputHint}>e.g. Summer in Japan, Weekend Road Trip</Text>
              {/* Date picker section */}
              <View style={styles.dateCardRow}>
                <View style={styles.dateAccentBar} />
                <Pressable style={styles.dateCardPressable} onPress={() => setShowDatePicker(!showDatePicker)}>
                  <Text style={styles.dateCardEmoji}>📅</Text>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                  </View>
                </Pressable>
              </View>
              {showDatePicker && (
                Platform.OS === 'ios' ? (
                  <View style={{ maxHeight: 120, overflow: 'hidden' }}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display='spinner'
                      onChange={(_: any, selectedDate: React.SetStateAction<Date>) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) setDate(selectedDate);
                      }}
                      themeVariant="light"
                      style={{ height: 120 }}
                      scalesPageToFit={false}
                    />
                  </View>
                ) : (
                  <View style={{ height: 120, overflow: 'hidden' }}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display='spinner'
                      onChange={(_: any, selectedDate: React.SetStateAction<Date>) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) setDate(selectedDate);
                      }}
                      themeVariant="light"
                      style={{ height: 120 }}
                      scalesPageToFit={false}
                    />
                  </View>
                )
              )}
              {/* Stamp picker section */}
              <Text style={styles.stampSectionTitle}>Choose a stamp cover</Text>
              <Text style={styles.stampSubtitle}>This will appear on your folder cover</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stampsRow}
              >
                {STAMPS.map((stamp) => {
                  const isSelected = selectedStamp === stamp.key;
                  return (
                    <Pressable
                      key={stamp.key}
                      style={[styles.stampBtn, isSelected && styles.stampBtnSelected]}
                      onPress={() => setSelectedStamp(stamp.key)}
                    >
                      <Image source={stamp.source} style={styles.stampImage} />
                      {isSelected && (
                        <View style={styles.stampCheckBadge}>
                          <Text style={styles.stampCheckText}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View style={styles.divider} />
              {/* Create button */}
              <Pressable
                style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
                disabled={!canCreate}
                onPress={() =>
                  router.push({
                    pathname: "/bulletin-board",
                    params: {
                      id: Date.now().toString(),
                      title: title.trim(),
                      stamp: selectedStamp,
                      date: formatDate(date),
                    },
                  })
                }
              >
                <Text style={styles.createBtnText}>Create folder</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      <BottomNavbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#F5F0E8", borderRadius:32, overflow:'hidden' },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: { padding: 4 },
  backArrow: { color: "#f5e6c8", fontSize: 22 },
  headerTitle: { color: "#5A390E", fontSize: 32, fontFamily: "Calistoga", textAlign: "center", marginTop: 35 },
  paperBack: { height: "98%", width: "100%", marginTop: 8, borderRadius: 10, overflow: "hidden" },
  headerRow: {
    position: 'absolute',
    top: 18,
    left: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeDivider: {
    height: 2,
    backgroundColor: '#c8b89a',
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 2,
  },
  body: { padding: 20, paddingTop: 24 },
  label: { fontSize: 14, color: "#5A390E", marginBottom: 6, fontFamily: "Inter", marginTop:10, },
  input: {
    backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#c8b89a",
    borderRadius: 10, padding: 12, fontSize: 16, color: "#3a2010", fontFamily: "Calistoga",
    minHeight: 48,
  },
  inputHint: {
    fontStyle: 'italic',
    color: '#9a8470',
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 10,
    marginTop: 2,
    marginLeft: 2,
  },
  // Date card row
  dateCardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
    marginTop: 10,
  },
  dateAccentBar: {
    width: 4,
    backgroundColor: '#6D1B12',
    borderRadius: 2,
    marginRight: 8,
  },
  dateCardPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#c8b89a',
  },
  dateCardEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#3a2010',
    fontFamily: 'Calistoga',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14, color: "#5a3020", fontFamily: "Inter",
    fontWeight: "500", marginTop: 20, marginBottom: 12,
  },
  stampSectionTitle: {
    fontSize: 16,
    color: '#5A390E',
    fontFamily: 'Inter',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 2,
  },
  stampSubtitle: {
    color: '#9a8470',
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 10,
    marginLeft: 2,
  },
  stampsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  stampBtn: { opacity: 0.6, borderRadius: 8, overflow: "hidden", marginRight: 8 },
  stampBtnSelected: { opacity: 1, borderWidth: 3, borderColor: "#6D1B12", borderRadius: 8 },
  stampImage: { width: 150, height: 150, resizeMode: "contain" },
  stampCheckBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: '#6D1B12',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  stampCheckText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  divider: { height: 1, backgroundColor: "#d8cfc0", marginTop: 20 },
  createBtn: { backgroundColor: "#6D1B12", borderRadius: 12, paddingVertical: 16, paddingHorizontal: 14, alignItems: "center", marginTop: 20, flexDirection: 'row', justifyContent: 'center' },
  createBtnDisabled: { backgroundColor: "#c8a898" },
  createBtnText: { color: "#f5e6c8", fontSize: 16, fontFamily: "Calistoga", letterSpacing: 0.3, flexDirection: 'row', alignItems: 'center' },
});
// TODO: Integrate with backend API here (endpoint: /folders, method: POST)
// TODO: Add backend integration logic (loading, error handling, response handling)
