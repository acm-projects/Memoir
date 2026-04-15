import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Entypo } from '@expo/vector-icons';
import { Image } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ChatRoomHeader({ name, avatar, router }) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#7a1a1a' },
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={24} color="#F5EEE1" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 10 }}>
            <Image
              source={avatar ? { uri: avatar } : require('../../assets/images/origami-gorilla.png')}
              style={{ height: hp(5), width: hp(5), borderRadius: hp(2.5) }}
            />
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>{name}</Text>
          </View>
        </View>
      )
    });
  }, [name, avatar]);

  return <Stack.Screen options={{ title: '', headerStyle: { backgroundColor: '#7a1a1a' } }} />;
}