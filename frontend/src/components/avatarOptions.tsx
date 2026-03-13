import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AvatarOptProps {
    imageSource: any; 
    onSelect: () => void;
    isSelected: boolean;
  }

  export const AvatarOptions: React.FC<AvatarOptProps> = ({ imageSource, onSelect, isSelected }) => {

    const borderWidth = useSharedValue(2);


    return(
        <Pressable onPress = {onSelect} >

        <View style = {[styles.avatarCircle,
            
            {borderWidth: isSelected? 3 : 2,}
            
        ]}>
        
        
        <Image source={imageSource} style={styles.avatarImage} />
        </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    avatarCircle:{
        width : 100,
        height : 100,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D2B994',
        borderStyle: 'solid',
        borderColor: '#590502'
    },

    avatarImage:{
        width : 70,
        height : 70,
        resizeMode : 'contain',
    }
})