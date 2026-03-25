import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet, Pressable, ScrollView,
  Image, ImageBackground, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackButton from "../components/back-Button";
import BottomNavbar from '../components/BottomNavbar';

const STAMPS = [
  { key: "star", source: require("../../assets/images/star-stamp.png"), label: "Star" },
  { key: "costa-rica", source: require("../../assets/images/costa-rica-stamp.png"), label: "Costa Rica" },
  { key: "australia", source: require("../../assets/images/Australia-Stamp.png"), label: "Australia" },
  { key: "bird", source: require("../../assets/images/bird-stamp.png"), label: "bird" },
  { key: "brazil", source: require("../../assets/images/brasil-stamp.png"), label: "brazil" },
];

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
        <ImageBackground
          source={require("../../assets/images/layered-vintage-paper.png")}
          style={styles.paperBack}
        >
          <BackButton />
          
          <Text style={styles.headerTitle}>New Memory Folder</Text>

          <View style={styles.body}>
            {/* Title input */}
            <Text style={styles.label}>Folder title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              maxLength={40}
            />

            {/* Date picker */}
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.datePressable} onPress={() => setShowDatePicker(!showDatePicker)}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </Pressable>
                        
           

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display= 'spinner'
                onChange={(_: any, selectedDate: React.SetStateAction<Date>) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) setDate(selectedDate);
                }}
                themeVariant="light"
              />
            )}
            {/* Stamp picker */}
            <Text style={styles.sectionTitle}>Choose a stamp cover</Text>
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
        </ImageBackground>
      </ScrollView>
      <BottomNavbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#F5F0E8" },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: { padding: 4 },
  backArrow: { color: "#f5e6c8", fontSize: 22 },
  headerTitle: { color: "#5A390E", fontSize: 32, fontFamily: "Calistoga", textAlign: "center" },
  paperBack: { height: "98%", width: "100%", marginTop: 100, borderRadius: 10, overflow: "hidden" },
  body: { padding: 20 },
  label: { fontSize: 14, color: "#5A390E", marginBottom: 6, fontFamily: "Inter", marginTop:10, },
  input: {
    backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#c8b89a",
    borderRadius: 10, padding: 12, fontSize: 16, color: "#3a2010", fontFamily: "Calistoga",
  },

  // Date picker styles
  datePressable: {
    backgroundColor: "#F5EEE1", borderWidth: 1, borderColor: "#c8b89a",
    borderRadius: 10, padding: 12, marginBottom: 16,
  },
  dateText: { fontSize: 16, color: "#3a2010", },

  sectionTitle: {
    fontSize: 14, color: "#5a3020", fontFamily: "Inter",
    fontWeight: "500", marginTop: 20, marginBottom: 12,
  },
  stampsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  stampBtn: { opacity: 0.6, borderRadius: 8, overflow: "hidden" },
  stampBtnSelected: { opacity: 1, borderWidth: 2, borderColor: "#6D1B12", borderRadius: 8 },
  stampImage: { width: 70, height: 70, resizeMode: "contain" },
  divider: { height: 1, backgroundColor: "#d8cfc0", marginTop: 20 },
  createBtn: { backgroundColor: "#6D1B12", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 20 },
  createBtnDisabled: { backgroundColor: "#c8a898" },
  createBtnText: { color: "#f5e6c8", fontSize: 16, fontFamily: "Calistoga", letterSpacing: 0.3 },
});
