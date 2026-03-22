import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ImageBackground, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatRoomHeader from "../components/ChatRoomHeader";

const MOCK_MESSAGES = [
  { id: '1', text: 'Hey! How are you?', sent: false },
  { id: '2', text: 'I am good! How about you?', sent: true },
  { id: '3', text: 'Doing great, thanks!', sent: false },
];

interface Message {
  id: string;
  text: string;
  sent: boolean;
}

export default function ChatRoom() {
    const { item } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView | null>(null);
    
    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = { id: Date.now().toString(), text: inputText, sent: true };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText('');
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return(
        <View style={{ flex: 1, backgroundColor: '#590502'}}>
            <StatusBar barStyle="light-content" />
            <ChatRoomHeader user={item} router={router}/> 
            <ImageBackground
                source={require('../../assets/images/layered-vintage-paper.png')}
                style={{ flex: 1 }}
            >
              {/* messages list */}
              <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
              >
                {messages.map(message => (
                  <View key={message.id} style={{
                    alignSelf: message.sent ? 'flex-end' : 'flex-start',
                    marginBottom: 8,
                    maxWidth: '75%'
                  }}>
                    <View style={{
                      backgroundColor: message.sent ? '#590502' : 'white',
                      borderRadius: 12,
                      padding: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                    }}>
                      <Text style={{ color: message.sent ? '#F5EEE1' : 'black', fontSize: hp(1.8) }}>
                        {message.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 20, backgroundColor: '#590502', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10 }}>
                <TextInput
                  placeholder="Type your message..."
                  value={inputText}
                  onChangeText={setInputText}
                  placeholderTextColor="white"
                  style={{ color: '#F5EEE1', fontSize: 16, flex: 1, marginRight: 2 }}
                />
                <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: '#F5EEE1', borderRadius: 20, padding: 10 }}>
                  <Feather name="send" size={20} color="#590502" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
        </View>
    );
}