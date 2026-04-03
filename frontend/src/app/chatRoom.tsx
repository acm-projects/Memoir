import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ImageBackground, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatRoomHeader from "../components/ChatRoomHeader";
import { Modal } from 'react-native';
import { useEffect } from 'react';
import { Image } from 'react-native-svg';


const MOCK_MESSAGES = [
  { id: '1', text: 'Hey! How are you?', sent: false },
  { id: '2', text: 'I am good! How about you?', sent: true },
  { id: '3', text: 'Doing great, thanks!', sent: false },
];
// TODO: Replace mock data with real backend response

const MOCK_FOLDERS = [
  { id: 'all', name: 'All memories', image: require('../../assets/images/Australia-Stamp.png') },
  { id: 'prom', name: '16th Birthday', image: require('../../assets/images/star-stamp.png') },
  { id: 'plain', name: 'Prom', image: require('../../assets/images/costa-rica-stamp.png') },
  { id: 'spring', name: 'Spring Break +', image: require('../../assets/images/star-stamp.png') },
];
// TODO: Replace mock data with real backend response

interface Message {
  id: string;
  text: string;
  sent: boolean;
  type?: 'text' | 'folder';
  folderName?: string;
  folderImage?: any;
}

export default function ChatRoom() {
    const { item } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [showPopInfo, setShowPopInfo] = useState(false);

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
        <View style={{ flex: 1, backgroundColor: '#7a1a1a'}}>
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
                    {message.type == 'folder' && (
                      <TouchableOpacity>
                      <View style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', width: 150 }}>
                        <Image source={message.folderImage} style={{ width: 150, height: 100 }} />
                        <View style={{ padding: 8 }}>
                          <Text style={{ fontSize: 12, color: '#590502', fontFamily: 'Calistoga' }}>
                            {message.folderName}
                          </Text>
                        </View>
                      </View>
                      </TouchableOpacity>
                    )}
                    <View style={{
                      backgroundColor: message.sent ? '#7a1a1a' : '#fff8f0',
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
              <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 20, backgroundColor: '#7a1a1a', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, gap: 10 }}>
                <TextInput
                  placeholder="Type your message..."
                  value={inputText}
                  onChangeText={setInputText}
                  placeholderTextColor="white"
                  style={{ color: '#f5e8d8', fontSize: 16, flex: 1, marginRight: 2 }}
                />
                <TouchableOpacity onPress={() => setShowPopInfo(true)} style={{ backgroundColor: '#F5EEE1', borderRadius: 20, padding: 10 }}>
                  <Feather name="paperclip" size={20} gap={5} color="#590502" />
                </TouchableOpacity>
                  <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: '#F5EEE1', borderRadius: 20, padding: 10 }}>
                    <Feather name="send" size={20} color="#590502" />
                  </TouchableOpacity>
              </View>

              <Modal visible={showPopInfo} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View style={{ backgroundColor: '#f5f0e8', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20}}>
                    <Text style ={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Attach a memory</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                      {MOCK_FOLDERS.map(folder => (
                        <TouchableOpacity
                        key = {folder.id}
                        onPress={() => {
                          setMessages(prev => [...prev, { id: Date.now().toString(), text: '', sent: true, type: 'folder', folderName: folder.name, folderImage: folder.image }]);
                          setShowPopInfo(false);
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}
                      >
                        <Image source={folder.image} style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }} />
                        <Text style={{ fontSize: 16 }}>{folder.name}</Text>
                      </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity onPress={() => setShowPopInfo(false)} style={{ marginTop: 10, alignSelf: 'center', backgroundColor: '#590502', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                        <Text style={{ color: '#F5EEE1', fontSize: 16 }}>Cancel</Text>
      </TouchableOpacity>
                      
                  </View>
                </View>
              </Modal>
            </ImageBackground>
        </View>
    );
}
// TODO: Integrate with backend API here (endpoint: /messages, method: GET/POST)
// TODO: Add backend integration logic (loading, error handling, response handling)