import { Text, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

export default function Index() {
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/members") // fetches backend 
      .then(res => res.json())
      .then(data => setMembers(data.members)) // retrieves the members array data
      .catch(err => console.log("Error:", err)); // catches in case anything fails
  }, []);

  return ( // returns each of the array's elements, maps them
    <View style={styles.container}>
      {members.length > 0 ? (
        members.map((member, index) => (
          <Text key={index} style={styles.text}> 
            {member}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>Loading...</Text>
      )}
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
    fontSize: 18,
  },
});
