import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Test() {
  return (
    <View style={styles.container}>
      <LoadingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
  },
});