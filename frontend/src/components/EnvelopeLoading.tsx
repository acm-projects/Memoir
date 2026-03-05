import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Easing, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Envelope dimensions - keep proportionate
const ENVELOPE_WIDTH = 280;
const ENVELOPE_HEIGHT = 180;
const FLAP_HEIGHT = ENVELOPE_HEIGHT * 0.65;

// Final positions
const ENVELOPE_FINAL_Y = SCREEN_HEIGHT / 2 - ENVELOPE_HEIGHT / 2 + 50; // Move envelope to bottom

export default function EnvelopeLoading({ onComplete }: { onComplete: () => void }) {
  // Animation values
  const flapRotation = useRef(new Animated.Value(0)).current;
  const flapOpacity = useRef(new Animated.Value(1)).current;
  const letterTranslateY = useRef(new Animated.Value(0)).current;
  const letterScale = useRef(new Animated.Value(1)).current;
  const envelopeTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence
    const animationSequence = Animated.sequence([
      // 1. Wait briefly before starting
      Animated.delay(500),
      
      // 2. Open the flap (rotate it back)
      Animated.timing(flapRotation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      
      // 3. Letter rises up while envelope moves down
      Animated.parallel([
        Animated.timing(letterTranslateY, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        // Fade out flap as letter rises
        Animated.timing(flapOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      
      // 4. Brief pause
      Animated.delay(200),
      
      // 5. Letter scales up slightly and envelope slides to bottom
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
        Animated.timing(envelopeTranslateY, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      
      // 6. Hold final state briefly
      Animated.delay(500),
    ]);

    animationSequence.start(() => {
      // Animation complete, transition to next screen
      onComplete();
    });

    return () => {
      animationSequence.stop();
    };
  }, []);

  // Interpolate flap rotation (0 to 180 degrees)
  const flapRotateX = flapRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Letter rises up, then moves to final centered position
  const letterY = letterTranslateY.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, -80, -SCREEN_HEIGHT * 0.15],
  });

  // Envelope slides down to bottom of screen
  const envelopeY = envelopeTranslateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, ENVELOPE_FINAL_Y],
  });

  return (
    <View style={styles.container}>
      {/* Letter - rises up and scales */}
      <Animated.View
        style={[
          styles.letterContainer,
          {
            transform: [
              { translateY: letterY },
              { scale: letterScale },
            ],
          },
        ]}
      >
        <Image 
          source={require('../../assets/images/letter.png')} 
          style={styles.letter}
          resizeMode="contain" 
        />
      </Animated.View>

      {/* Envelope container - slides down */}
      <Animated.View 
        style={[
          styles.envelopeWrapper,
          {
            transform: [{ translateY: envelopeY }],
          },
        ]}
      >
        {/* The Back/Body of Envelope */}
        <View style={styles.envelopeBack}>
          <Image 
            source={require('../../assets/images/envelope-back.png')} 
            style={styles.envelopeImage}
            resizeMode="cover" 
          />
        </View>

        {/* The Top Flap - rotates open */}
        <Animated.View
          style={[
            styles.flapContainer,
            {
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
            style={styles.flapImage}
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
    width: ENVELOPE_WIDTH,
    height: FLAP_HEIGHT,
    top: 0,
    zIndex: 30,
    transformOrigin: 'center top',
  },
  flapImage: {
    width: '100%',
    height: '100%',
  },
});