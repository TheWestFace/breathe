import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function WelcomeScreen({ navigation }) {
  const handleStartClick = () => {
    navigation.navigate('Third'); // Navigate to the "Second" screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleStartClick}>
        <Text style={styles.buttonLabel}>Start</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3C9E2', // Pastel blue background
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF', // White button background
    borderWidth: 3, // Border width for the button
    borderColor: '#7FB5D0', // Slightly darker pastel blue for the border
    paddingVertical: 12, // Vertical padding for the button
    paddingHorizontal: 40, // Horizontal padding for the button
    borderRadius: 12, // Rounded corners for the button
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A3C9E2', // Text color same as the background color (pastel blue)
  },
});

export default WelcomeScreen;
