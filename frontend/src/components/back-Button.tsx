import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  onPress?: () => void;
};

export default function BackButton({ onPress }: Props) {
  const router = useRouter();

  return (
    <Pressable style={styles.btn} onPress={onPress ?? (() => router.back())}>
      <Text style={styles.arrow}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
  arrow: {
    color: "#f5e6c8",
    fontSize: 22,
  },
});