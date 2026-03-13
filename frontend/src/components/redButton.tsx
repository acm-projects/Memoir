import React from 'react';
import { router } from "expo-router";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface RedButtonProps {
    title: string;
    onPress: () => void;
    style?: any; 
  }
  
  export const RedButton: React.FC<RedButtonProps> = ({ title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#590502',
      borderRadius: 20,
      width: '60%',
      height: 45, 
      alignSelf: 'center',
      justifyContent: 'center', 
      marginTop: 20,
      
      
    },
    text: {
      fontFamily: 'Inter',
      fontSize: 16,
      color: '#E8DCDC',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });