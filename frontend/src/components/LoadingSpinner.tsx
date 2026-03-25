import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const RADIUS = 200;

export default function LoadingSpinner() {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const rad = (angle.value * Math.PI) / 180;
    return {
      position: 'absolute',
      transform: [
        { translateX: RADIUS * Math.cos(rad) },
        { translateY: RADIUS * Math.sin(rad) },
        { rotate: `${angle.value}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Animated.View style={[styles.planeWrapper, animatedStyle]}>
        <Image
          source={require('../../assets/images/paper-airplane.png')}
          style={styles.airplane}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: '#c8b89a',
    borderStyle: 'dashed',
  },
  planeWrapper: {
    width: 40,
    height: 40,
    overflow: 'hidden',
  },
  airplane: {
  width: 1500,
  height: 150,
  position: 'absolute',
  top: -20,   // shift up to show the airplane
  left: -20,  // shift left to show the airplane
},
});