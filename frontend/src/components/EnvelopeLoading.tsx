import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Dimensions, Image } from 'react-native';
import Svg, { Polygon, Circle, Line, Ellipse } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Envelope dimensions - keep proportionate
const ENVELOPE_WIDTH = SCREEN_WIDTH * 0.78;
const ENVELOPE_HEIGHT = ENVELOPE_WIDTH * 0.55;
const FLAP_HEIGHT = ENVELOPE_HEIGHT * 0.6;
const FLAP_WIDTH = ENVELOPE_WIDTH;

const LETTER_W = ENVELOPE_WIDTH * 0.50;
const LETTER_H = LETTER_W * 1.7;

// Center envelope vertically
const ENVELOPE_Y_CENTER = (SCREEN_HEIGHT - ENVELOPE_HEIGHT) / 2;

const EnvelopeBack = () => (
  <Svg
    width={ENVELOPE_WIDTH}
    height={ENVELOPE_HEIGHT}
    viewBox="0 0 560 320"
  >
    {/* Body — flat top, V notch cut into TOP edge (open mouth faces up) */}
    <Polygon
      points="0,0 280,160 560,0 560,320 0,320"
      fill="#EDE8D9"
      stroke="#D4C9A8"
      strokeWidth="1.5"
    />
    {/* Left fold line from top-left corner to V center */}
    <Line x1="0" y1="0" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="1" opacity="0.5"/>
    {/* Right fold line from top-right corner to V center */}
    <Line x1="560" y1="0" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="1" opacity="0.5"/>
    {/* Bottom fold line */}
    <Line x1="0" y1="320" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.3"/>
    <Line x1="560" y1="320" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.3"/>
    {/* Paper texture */}
    <Line x1="40" y1="240" x2="520" y2="240"
      stroke="#D4C9A8" strokeWidth="0.4" opacity="0.3"/>
    <Line x1="40" y1="280" x2="520" y2="280"
      stroke="#D4C9A8" strokeWidth="0.3" opacity="0.2"/>
  </Svg>
);

const EnvelopeFlap = () => (
  <Svg
    width={ENVELOPE_WIDTH}
    height={ENVELOPE_HEIGHT * 0.6}
    viewBox="0 0 560 200"
  >
    {/* Flap — flat top edge, triangle pointing DOWN to center bottom */}
    <Polygon
      points="0,0 560,0 280,200"
      fill="#EDE8D9"
      stroke="#D4C9A8"
      strokeWidth="1.5"
    />
    {/* Left slope line */}
    <Line x1="0" y1="0" x2="280" y2="200"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.4"/>
    {/* Right slope line */}
    <Line x1="560" y1="0" x2="280" y2="200"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.4"/>
    {/* Texture lines */}
    <Line x1="30" y1="30" x2="530" y2="30"
      stroke="#D4C9A8" strokeWidth="0.4" opacity="0.25"/>
    <Line x1="80" y1="70" x2="480" y2="70"
      stroke="#D4C9A8" strokeWidth="0.3" opacity="0.2"/>
    <Line x1="140" y1="110" x2="420" y2="110"
      stroke="#D4C9A8" strokeWidth="0.3" opacity="0.15"/>
    {/* Wax seal at tip */}
    <Circle cx="280" cy="175" r="20"
      fill="#7B1D1D" stroke="#5C1010" strokeWidth="1.5"/>
    <Circle cx="280" cy="175" r="14"
      fill="#8B2020" stroke="#6D1414" strokeWidth="0.8"/>
    <Circle cx="275" cy="170" r="4"
      fill="#A03030" opacity="0.5"/>
  </Svg>
);

const EnvelopeBottom = () => (
  <Svg
    width={ENVELOPE_WIDTH}
    height={ENVELOPE_HEIGHT}
    viewBox="0 0 560 320"
  >
    {/* Left side flap */}
    <Polygon
      points="0,0 0,320 280,160"
      fill="#E8E2D0"
      stroke="#D4C9A8"
      strokeWidth="1"
    />
    {/* Right side flap */}
    <Polygon
      points="560,0 560,320 280,160"
      fill="#E4DEC8"
      stroke="#D4C9A8"
      strokeWidth="1"
    />
    {/* Bottom flap — triangle pointing UP from bottom */}
    <Polygon
      points="0,320 560,320 280,160"
      fill="#EDE8D9"
      stroke="#D4C9A8"
      strokeWidth="1"
    />
    {/* Center crease lines */}
    <Line x1="0" y1="320" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.4"/>
    <Line x1="560" y1="320" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.4"/>
    <Line x1="0" y1="0" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.3"/>
    <Line x1="560" y1="0" x2="280" y2="160"
      stroke="#D4C9A8" strokeWidth="0.8" opacity="0.3"/>
  </Svg>
);

const LetterCard = () => (
  <View style={letterCardStyles.card}>
    <Image
      source={require('../../assets/images/logoMemoir.png')}
      style={letterCardStyles.logo}
      resizeMode="contain"
    />
  </View>
);

const letterCardStyles = StyleSheet.create({
  card: {
    width: LETTER_W,
    height: LETTER_H,
    backgroundColor: '#EDE8D9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A390E',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  logo: {
    width: '78%',
    height: '55%',
  },
});

const EnvelopeGapFiller = () => (
  <Svg
    width={ENVELOPE_WIDTH}
    height={ENVELOPE_HEIGHT * 0.65}
    viewBox="0 0 560 210"
  >
    {/* Triangle pointing DOWN — fills the V gap perfectly */}
    <Polygon
      points="0,0 560,0 280,210"
      fill="#EDE8D9"
      stroke="#D4C9A8"
      strokeWidth="0"
    />
  </Svg>
);

export default function EnvelopeLoading({ onComplete }: { onComplete: () => void }) {
  // Animation values
  const flapRotation = useRef(new Animated.Value(0)).current;
  const flapOpacity = useRef(new Animated.Value(1)).current;
  const envelopeBackOpacity = useRef(new Animated.Value(1)).current;
  const letterTranslateY = useRef(new Animated.Value(0)).current;
  const letterScale = useRef(new Animated.Value(0.9)).current;
  const letterOpacity = useRef(new Animated.Value(0)).current;
  const envelopeOpacity = useRef(new Animated.Value(1)).current;
  const gapFillerOpacity = useRef(new Animated.Value(1)).current;

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
        Animated.timing(gapFillerOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      // Final zoom / fade phase: letter scales and recenters, envelope fades out
      Animated.parallel([
        Animated.timing(letterScale, {
          toValue: 1.3,
          duration: 900, // was 1100
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(letterOpacity, {
          toValue: 0,
          duration: 1050, // was 1300
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(letterTranslateY, {
          toValue: 2,
          duration: 900, // was 1100
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(envelopeOpacity, {
          toValue: 0,
          duration: 400, // was 500
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(envelopeBackOpacity, {
          toValue: 0,
          duration: 450, // was 550
          useNativeDriver: true,
        }),
        Animated.timing(gapFillerOpacity, {
          toValue: 0,
          duration: 350, // was 400
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
    ]);

    animationSequence.start(() => {
      onComplete();
    });

    return () => {
      animationSequence.stop();
    };
  }, [onComplete]);

  // Interpolate flap rotation (0 to -180 degrees)
  const flapRotateX = flapRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  // Letter rises from the V gap, then above envelope, then recenters
  const letterY = letterTranslateY.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      ENVELOPE_HEIGHT * 0.08,
      -(ENVELOPE_HEIGHT * 0.65),
      0,
    ],
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
        <LetterCard />
      </Animated.View>

      {/* Envelope container - stays centered */}
      <Animated.View 
        style={[
          styles.envelopeWrapper,
          {
            top: ENVELOPE_Y_CENTER,
            opacity: envelopeOpacity,
          },
        ]}
      >
        {/* Static front face of envelope */}
        <View style={styles.envelopeBottom}>
          <EnvelopeBottom />
        </View>

        {/* The Back/Body of Envelope */}
        <Animated.View style={[styles.envelopeBack, { opacity: envelopeBackOpacity }]}>
          <EnvelopeBack />
        </Animated.View>

        {/* Gap filler to close V seam visually */}
        <Animated.View
          style={{
            position: 'absolute',
            top: -(ENVELOPE_HEIGHT * 0.012),
            left: 0,
            zIndex: 11,
            opacity: gapFillerOpacity,
          }}
        >
          <EnvelopeGapFiller />
        </Animated.View>

        {/* The Top Flap - rotates open */}
        <Animated.View
          style={[
            styles.flapContainer,
            {
              width: ENVELOPE_WIDTH,
              height: FLAP_HEIGHT,
              left: 0,
              top: -(FLAP_HEIGHT * 0.02),
              transform: [
                { translateY: -(FLAP_HEIGHT / 2) },
                { perspective: 1200 },
                { rotateX: flapRotateX },
                { translateY: FLAP_HEIGHT / 2 },
              ],
              opacity: flapOpacity,
            },
          ]}
        >
          <EnvelopeFlap />
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
    width: LETTER_W,
    height: LETTER_H,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    left: (SCREEN_WIDTH - LETTER_W) / 2,
    top: (SCREEN_HEIGHT - LETTER_H) / 2,
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
  envelopeBottom: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
    zIndex: 12,
  },
  envelopeBack: {
    position: 'absolute',
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
    zIndex: 10,
  },
  flapContainer: {
    position: 'absolute',
    zIndex: 15,
  },
});