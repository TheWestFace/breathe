import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text, Dimensions } from 'react-native';

function ThirdScreen() {
  const sizeAnim = useRef(new Animated.Value(1)).current; // Initial size of the blue circle
  const greyCircleAnim = useRef(new Animated.Value(1)).current; // Initial size of the grey circle
  const [phase, setPhase] = useState('Breathe In'); // Track the current phase
  const [countdown, setCountdown] = useState(4); // Initial countdown for "Inhale"

  // Get the window dimensions for the grey circle to expand to full screen
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const animationSequence = Animated.sequence([
      // Blue and grey circle animation (synchronized)
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: 2, // Grow to double the size
          duration: 4000, // 4 seconds
          useNativeDriver: false,
        }),
        Animated.timing(greyCircleAnim, {
          toValue: 2, // Expand to a larger size, but not the entire screen
          duration: 4000, // 4 seconds
          useNativeDriver: false,
        }),
      ]),
      // Hold phase (grey circle shrinks to the size of the blue circle)
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: 2, // Hold the size
          duration: 7000, // 7 seconds
          useNativeDriver: false,
        }),
        Animated.timing(greyCircleAnim, {
          toValue: 2, // Shrink grey circle to match the size of the blue circle
          duration: 7000, // 7 seconds
          useNativeDriver: false,
        }),
      ]),
      // Exhale phase (both circles shrink together)
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: 1, // Shrink back to original size
          duration: 8000, // 8 seconds
          useNativeDriver: false,
        }),
        Animated.timing(greyCircleAnim, {
          toValue: 1, // Shrink grey circle together with blue circle
          duration: 8000, // 8 seconds
          useNativeDriver: false,
        }),
      ]),
    ]);

    const phaseSequence = [
      { phase: 'Breathe In', duration: 4000, countdown: 4 },
      { phase: 'Hold', duration: 7000, countdown: 7 },
      { phase: 'Breathe Out', duration: 8000, countdown: 8 },
    ];

    const animateWithPhases = async () => {
      while (true) {
        for (let i = 0; i < phaseSequence.length; i++) {
          const { phase, duration, countdown } = phaseSequence[i];
          setPhase(phase); // Update the phase text
          setCountdown(countdown); // Reset the countdown

          for (let t = countdown; t > 0; t--) {
            setCountdown(t); // Update countdown each second
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          await new Promise((resolve) =>
            setTimeout(resolve, duration - countdown * 1000)
          );
        }
      }
    };

    Animated.loop(animationSequence).start(); // Start the animation sequence
    animateWithPhases(); // Start the phase text and countdown updates

    return () => {
      sizeAnim.stopAnimation(); // Cleanup animation on unmount
      greyCircleAnim.stopAnimation(); // Cleanup grey circle animation on unmount
    };
  }, [sizeAnim, greyCircleAnim]);

  return (
    <View style={styles.container}>
      {/* View for the animated grey and blue circles */}
      <View style={styles.circleContainer}>
        {/* Animated grey circle that expands and shrinks with the blue circle */}
        <Animated.View
          style={[
            styles.greyCircle,
            {
              width: greyCircleAnim.interpolate({
                inputRange: [1, 2],
                outputRange: [100, 250], // Grey circle expands to a larger size (but not screen size)
              }),
              height: greyCircleAnim.interpolate({
                inputRange: [1, 2],
                outputRange: [100, 250], // Grey circle expands to a larger size (but not screen size)
              }),
              borderRadius: greyCircleAnim.interpolate({
                inputRange: [1, 2],
                outputRange: [50, 125], // Border radius adjusted for larger size
              }),
            },
          ]}
        />
        {/* Animated blue ball */}
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [{ scale: sizeAnim }], // Scale the blue ball using the animation value
            },
          ]}
        >
          <Text style={styles.countdownText}>{countdown}</Text>
        </Animated.View>
      </View>
      {/* Text below the circles */}
      <Text style={styles.phaseText}>{phase}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Position the circle container independently from the text
  },
  greyCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(220, 220, 220, 0.5)', // Lighter grey color for the expanding circle
  },
  ball: {
    width: 100, // Initial size
    height: 100, // Initial size
    borderRadius: 50, // Makes it circular
    backgroundColor: '#A3C9E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phaseText: {
    position: 'absolute', // Absolute positioning to place it at the top
    top: 200, // Position it 20px from the top
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A3C9E2',
  },
});

export default ThirdScreen;
