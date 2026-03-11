import { Text, View,  StyleSheet } from 'react-native';
import { Redirect } from 'expo-router'

//View style={styles.container}>
      //<Text style={styles.text}>Home screen</Text>
    //</View>/

export default function Index() {
  return (
    

    <Redirect href="/signupScreen" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});

