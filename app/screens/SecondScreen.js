import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function SecondScreen() {
  // Create an animated value for the ball's position along the path
  const ballPosition = useRef(new Animated.Value(0)).current;

  const pathRef = useRef(null);

  const [ballCoords, setBallCoords] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState('Inhale'); // Tracks current phase: 'Inhale', 'Hold', 'Exhale'
  const [countdown, setCountdown] = useState(4); // Countdown for each phase
  const countdownRef = useRef(countdown); // Using ref to track countdown value

  useEffect(() => {
    // Get the total length of the path (infinity symbol)
    const pathLength = pathRef.current.getTotalLength();

    // Set the initial ball position to the start of the path (position 0)
    const initialPoint = pathRef.current.getPointAtLength(0);
    setBallCoords({
      x: initialPoint.x,
      y: initialPoint.y,
    });

    // Start the animation loop for the ball
    Animated.loop(
      Animated.timing(ballPosition, {
        toValue: pathLength,
        duration: 9000, // The ball will take 7 seconds to complete the path once
        useNativeDriver: false, // Not using native driver for position updates
      })
    ).start();

    // Update ball position based on path length continuously
    const updateBallPosition = () => {
      const position = ballPosition._value;

      // Get point at current position along the path
      const point = pathRef.current.getPointAtLength(position);

      setBallCoords({
        x: point.x,
        y: point.y,
      });
    };

    const intervalId = setInterval(updateBallPosition, 15); // Update position every 16ms (60fps)
    return () => clearInterval(intervalId); // Cleanup interval when component unmounts
  }, [ballPosition]);

  useEffect(() => {
    // Phase durations
    const phaseDurations = {
      Inhale: 4,
      Hold: 7,
      Exhale: 8,
    };
  
    // Function to cycle through phases
    const cycleBreathing = (phase) => {
      let currentPhase = phase;
      let currentCountdown = phaseDurations[currentPhase];
  
      // Set initial phase and countdown
      setPhase(currentPhase);
      setCountdown(currentCountdown);
  
      // Set interval to decrement the countdown every second
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1; // Decrease countdown by 1
          } else {
            clearInterval(countdownInterval); // Stop countdown when it reaches 1
  
            // Transition to the next phase
            switch (currentPhase) {
              case 'Inhale':
                currentPhase = 'Hold';
                break;
              case 'Hold':
                currentPhase = 'Exhale';
                break;
              case 'Exhale':
                currentPhase = 'Inhale';
                break;
            }
  
            // Update the phase and countdown for the next phase
            setPhase(currentPhase);
            setCountdown(phaseDurations[currentPhase]);
  
            // Start the countdown for the next phase
            cycleBreathing(currentPhase); // Recurse to next phase
          }
          return prevCountdown; // Return the updated countdown
        });
      }, 1000); // Decrement countdown every second
  
      // Cleanup interval when component unmounts or effect is re-run
      return () => clearInterval(countdownInterval);
    };
  
    // Start the first cycle with "Inhale"
    cycleBreathing('Inhale');
  
    return () => clearTimeout(); // Cleanup timeouts when component unmounts
  }, []);

  return (
    <View style={styles.container}>
      <Svg width="500px" height="250px" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
        <Path
          ref={pathRef}
          stroke="#00c6ff"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M250,125c40,40,60,62,100,62s60-24,60-60s-24-60-60-60c-40,0-55,30-90,62-35,35-60,62-100,62s-60-24-60-60s24-60,60-60S210,85,250,125z"
          strokeDasharray="10,30"
          strokeDashoffset={ballPosition} // Apply the animated dashoffset
        />
        <Path
          opacity="0.1"
          fill="none"
          stroke="#f5981c"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M250,125c40,40,60,62,100,62s60-24,60-60s-24-60-60-60c-40,0-55,30-90,62-35,35-60,62-100,62s-60-24-60-60s24-60,60-60S210,85,250,125z"
        />
        {/* Animated Ball */}
        <Animated.View
          style={[
            styles.ball,
            {
              position: 'absolute',
              left: ballCoords.x - 15, // Ball position updated
              top: ballCoords.y - 15, // Ball position updated
            },
          ]}
        />
      </Svg>

      {/* Breathing Cycle Text */}
      <View style={styles.textContainer}>
        <Text style={styles.phaseText}>{phase}</Text>
        <Text style={styles.countdownText}>{countdown}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E3C1', // Pastel sand color
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 30,
    height: 30,
    backgroundColor: '#00c6ff',
    borderRadius: 15,
  },
  textContainer: {
    position: 'absolute',
    bottom: 50, // Position the text container below the infinity path
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  countdownText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ff5733',
  },
});

export default SecondScreen;
