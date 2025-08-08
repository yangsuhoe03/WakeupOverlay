import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AlarmCreateScreen from '../screens/AlarmCreateScreen';

export type HomeStackParamList = {
  Home: undefined;
  AlarmCreate: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Stack.Screen name="AlarmCreate" component={AlarmCreateScreen} options={{ title: '알람 추가' }} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;