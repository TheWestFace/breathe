import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './app/screens/WelcomeScreen';
import SecondScreen from './app/screens/SecondScreen';
import ThirdScreen from './app/screens/ThirdScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Third" component={ThirdScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
