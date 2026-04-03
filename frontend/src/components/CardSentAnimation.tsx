import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Paper airplane SVG (identical to original)
const PaperAirplane = () => (
  <Svg width={90} height={80} viewBox="0 0 90 80">
    {/* Main top body — large triangle pointing upper right */}
    <Polygon
      points="0,65 85,5 55,65"
      fill="#EDE8D9"
      stroke="#C8B89A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Bottom tail fold — small triangle below center */}
    <Polygon
      points="20,65 55,65 35,80"
      fill="#E4DEC8"
      stroke="#C8B89A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Inner wing crease — from tail to tip area */}
    <Line x1="20" y1="65" x2="75" y2="18"
      stroke="#C8B89A" strokeWidth="1.5" opacity="0.7"/>
    {/* Fold line along bottom of main body */}
    <Line x1="0" y1="65" x2="55" y2="65"
      stroke="#C8B89A" strokeWidth="1.5" opacity="0.6"/>
    {/* Small back detail fold */}
    <Line x1="35" y1="80" x2="55" y2="65"
      stroke="#C8B89A" strokeWidth="1.2" opacity="0.5"/>
  </Svg>
);

export default function CardSentAnimation({ onComplete }: { onComplete: () => void }) {
  // Animation values
  const airplaneProgress = useRef(new Animated.Value(0)).current;
  const airplaneOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(airplaneOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(airplaneProgress, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1500),
          Animated.timing(airplaneOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(100),
    ]);
    animationSequence.start(() => {
      onComplete();
    });
    return () => {
      animationSequence.stop();
    };
  }, [onComplete]);

  // Interpolations (identical to original)
  const planeX = airplaneProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      -SCREEN_WIDTH * 0.4,
      SCREEN_WIDTH * 0.4,
    ],
  });

  const planeY = airplaneProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      SCREEN_HEIGHT * 0.35,
      SCREEN_HEIGHT * 0.2,
      SCREEN_HEIGHT * 0.08,
      -SCREEN_HEIGHT * 0.02,
      -SCREEN_HEIGHT * 0.08,
    ],
  });

  const planeRotate = airplaneProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      '-2deg',
      '-3deg',
      '-4deg',
      '-3deg',
      '-2deg',
    ],
  });

  return (
    <View style={styles.container}>
      {/* Trail dots */}
      {[20, 34, 48, 62].map((offset, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            zIndex: 48,
            opacity: Animated.multiply(
              airplaneOpacity,
              new Animated.Value([0.6, 0.4, 0.25, 0.12][i])
            ),
            transform: [
              { translateX: Animated.subtract(planeX, new Animated.Value(offset)) },
              { translateY: planeY },
            ],
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#EDE8D9',
            }}
          />
        </Animated.View>
      ))}
      {/* Paper airplane */}
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 50,
          opacity: airplaneOpacity,
          transform: [
            { translateX: planeX },
            { translateY: planeY },
            { rotate: planeRotate },
          ],
        }}
      >
        <PaperAirplane />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C7A67',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
