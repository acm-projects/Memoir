import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Easing, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Envelope dimensions - keep proportionate
const ENVELOPE_WIDTH = 280;
const ENVELOPE_HEIGHT = 180;
const FLAP_HEIGHT = ENVELOPE_HEIGHT * 0.7; // Flap is smaller
const FLAP_WIDTH = ENVELOPE_WIDTH * 1.1; // Flap is wider

// Center envelope vertically
const ENVELOPE_Y_CENTER = (SCREEN_HEIGHT - ENVELOPE_HEIGHT) / 2;

export default function EnvelopeLoading({ onComplete }: { onComplete: () => void }) {
  // Animation values
  const flapRotation = useRef(new Animated.Value(0)).current;
  const flapOpacity = useRef(new Animated.Value(1)).current;
  const envelopeBackOpacity = useRef(new Animated.Value(1)).current;
  const letterTranslateY = useRef(new Animated.Value(0)).current;
  const letterScale = useRef(new Animated.Value(1)).current;
  const envelopeTranslateY = useRef(new Animated.Value(0)).current;
  const letterOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence
    const animationSequence = Animated.sequence([
      Animated.delay(500),
      Animated.timing(flapRotation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Fade in letter after flap opens
      Animated.timing(letterOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(letterTranslateY, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(flapOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(letterScale, {
          toValue: 1.8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(letterTranslateY, {
          toValue: 2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(envelopeBackOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(envelopeTranslateY, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
    ]);

    animationSequence.start(() => {
      onComplete();
    });

    return () => {
      animationSequence.stop();
    };
  }, [onComplete]);

  // Interpolate flap rotation (0 to 180 degrees)
  const flapRotateX = flapRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Letter rises up a bit, then stays centered
  const letterY = letterTranslateY.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      0, // Start at center
      -ENVELOPE_HEIGHT * 0.3, // Rise up a bit
      0, // Return to center for zoom out
    ],
  });

  // Envelope stays centered, then fades out
  const envelopeY = envelopeTranslateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0], // No vertical movement, stays centered
  });

  return (
    <View style={styles.container}>
      {/* Letter - rises up and scales */}
      <Animated.View
        style={[
          styles.letterContainer,
          {
            opacity: letterOpacity,
            transform: [
              { translateY: letterY },
              { scale: letterScale },
            ],
          },
        ]}
      >
        <View style={styles.letterWrapper}>
          <Image
            source={require('../../assets/images/letter.png')}
            style={styles.letter}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* Envelope container - stays centered */}
      <Animated.View 
        style={[
          styles.envelopeWrapper,
          {
            transform: [{ translateY: envelopeY }],
            top: ENVELOPE_Y_CENTER,
          },
        ]}
      >
        {/* The Back/Body of Envelope */}
        <Animated.View style={[styles.envelopeBack, { opacity: envelopeBackOpacity }]}>
          <Image 
            source={require('../../assets/images/envelope-back.png')} 
            style={styles.envelopeImage}
            resizeMode="cover" 
          />
        </Animated.View>

        {/* The Top Flap - rotates open */}
        <Animated.View
          style={[
            styles.flapContainer,
            {
              width: FLAP_WIDTH,
              height: FLAP_HEIGHT,
              left: -(FLAP_WIDTH - ENVELOPE_WIDTH) / 2, // Center the wider flap
              top: -ENVELOPE_HEIGHT * 0.04, // Lower the flap to remove the gap
              transform: [
                { perspective: 1000 },
                { rotateX: flapRotateX },
              ],
              opacity: flapOpacity,
            },
          ]}
        >
          <Image 
            source={require('../../assets/images/envelope-flap.png')} 
            style={[styles.flapImage, { width: FLAP_WIDTH, height: FLAP_HEIGHT }]}
            resizeMode="cover" 
          />
        </Animated.View>
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
  letterContainer: {
    position: 'absolute',
    width: ENVELOPE_WIDTH * 0.85,
    height: ENVELOPE_HEIGHT * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    left: (SCREEN_WIDTH - ENVELOPE_WIDTH * 0.85) / 2,
    top: (SCREEN_HEIGHT - ENVELOPE_HEIGHT * 1.5) / 2,
  },
  letterWrapper: {
    width: '60%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  letter: {
    width: '100%',
    height: '100%',
  },
  envelopeWrapper: {
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
    left: (SCREEN_WIDTH - ENVELOPE_WIDTH) / 2,
  },
  envelopeBack: {
    position: 'absolute',
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
  },
  envelopeImage: {
    width: '100%',
    height: '100%',
  },
  flapContainer: {
    position: 'absolute',
    // width and left are set inline for centering
    // height is set inline
    zIndex: 30,
  },
  flapImage: {
    width: '100%',
    height: '100%',
  },
});