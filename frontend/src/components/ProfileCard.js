import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StatsRow from './StatsRow';
import DecorativeDivider from './DecorativeDivider';

export default function ProfileCard() {
  return (
    <View style={styles.card}>
      <View style={styles.patternedBg}>
        <View style={styles.innerCard}>
          <Image
            source={require('../../assets/images/default-avatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>Tejasvi Annamaraju</Text>
          <StatsRow leftStat={{number: '67', label: 'Entries'}} rightStat={{number: '45', label: 'Friends'}} />
        </View>
      </View>
      <DecorativeDivider />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    backgroundColor: 'transparent',
  },
  patternedBg: {
    backgroundColor: '#3d5a4a',
    borderRadius: 24,
    padding: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  innerCard: {
    backgroundColor: '#F5F5DC',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#7a2a2a',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7a2a2a',
    marginBottom: 10,
    fontFamily: 'serif',
  },
});
