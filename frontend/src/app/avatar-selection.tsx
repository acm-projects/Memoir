//JUST A PLACEHOLDER FOR NOW, FRONTEND WORK IN PROGRESS
import { View, Text, StyleSheet } from 'react-native'

export default function AvatarSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Avatar Selection</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
})