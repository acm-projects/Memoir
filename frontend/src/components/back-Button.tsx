import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  onPress?: () => void;
  color?: string;
};

export default function BackButton({ onPress, color = "#f5e6c8" }: Props) {
  const router = useRouter();

  return (
    <Pressable style={styles.btn} onPress={onPress ?? (() => router.back())}>
      <Text style={[styles.arrow, { color }]}>{'←'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
  arrow: {
    fontSize: 22,
  },
});