import { View, Text, TouchableOpacity} from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { Entypo } from '@expo/vector-icons';
import { Image } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ChatRoomHeader({ user, router }) {
  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerStyle: {
        backgroundColor: '#9D4D48',
        },
        headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <TouchableOpacity onPress={() => router.back()}>
                <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image
                    source={require('../../assets/images/origami-gorilla.png')}
                    style={{ height: hp(5), width: hp(5), borderRadius: 100 }}
                />
                <Text style={{ fontSize: 16, fontWeight: '500', alignItems: 'center'}}>Teju</Text>
                </View>
            </View>
        )
      }}
    />
  );
}
