import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormInput({ label, placeholder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#8B4513" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#8B0000',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5DC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#8B0000',
    color: '#8B4513',
  },
});
