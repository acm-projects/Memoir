import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const RADIUS = 70;
const SIZE = 200;
const PLANE_SIZE = 36;

export default function LoadingSpinner() {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, [angle]);

  const animatedStyle = useAnimatedStyle(() => {
    const rad = (angle.value * Math.PI) / 180;

    return {
      position: 'absolute',
      left: SIZE / 2 - PLANE_SIZE / 2,
      top: SIZE / 2 - PLANE_SIZE / 2,
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
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
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
    width: PLANE_SIZE,
    height: PLANE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  airplane: {
    width: PLANE_SIZE,
    height: PLANE_SIZE,
  },
});