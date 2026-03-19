import { View, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import ChatRoomHeader from "../components/ChatRoomHeader";
import { StatusBar } from "react-native";
import { useLocalSearchParams} from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';


export default function ChatRoom() {
    const { item } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    return(
         <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content"/>
                <ChatRoomHeader user={item} router={router}/>
                <View style={{height: 3, borderBottomColor: 'gray', marginBottom: 10 }}/>
                    <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'left'}}>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 25, color: 'gray'}}>Messages will appear here.</Text>
                        </View>
                        <View style={{marginBottom: hp(1.7), paddingTop: 2}}></View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 3, justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', marginRight: 10, marginBottom: 50, backgroundColor: '#9D4D48', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10}}>
                                    <TextInput placeholder="Type your message..." placeholderTextColor="white" style={{color: 'white', fontSize: hp(2), flex: 1, marginRight: 2 }} />
                                    <TouchableOpacity style={{backgroundColor: '#7a2a2a', borderRadius: 20, padding: 10}}>
                                        <Feather name="send" size={20} color="white" />
                                        </TouchableOpacity>
                                </View>
                            </View>
                    </View>
            </View>
        </SafeAreaView>
    )

}