import { Text, View,  StyleSheet } from 'react-native';
import { useAuthContext } from '@/hooks/use-auth-context'
import SignOutButton from '@/components/sign-out-button'

export default function Index() {
  const { profile } = useAuthContext()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Text style={styles.text}>Logged in as: {profile?.email}</Text>
      <SignOutButton />
    </View>
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
