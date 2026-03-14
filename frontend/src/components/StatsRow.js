import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsRow({ leftStat, rightStat }) {
  return (
    <View style={styles.row}>
      <View style={styles.stat}>
        <Text style={styles.number}>{leftStat.number}</Text>
        <Text style={styles.label}>{leftStat.label}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.number}>{rightStat.number}</Text>
        <Text style={styles.label}>{rightStat.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7a2a2a',
    fontFamily: 'serif',
  },
  label: {
    fontSize: 14,
    color: '#7a2a2a',
    fontFamily: 'serif',
  },
});
