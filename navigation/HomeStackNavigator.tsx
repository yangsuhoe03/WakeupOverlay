import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AlarmCreateScreen from '../screens/AlarmCreateScreen';
import AlarmSoundScreen from '../screens/AlarmSoundScreen';
import AlarmVibrationScreen from '../screens/AlarmVibrationScreen';
import TopicSelectScreen from '../screens/TopicSelectScreen ';

export type HomeStackParamList = {
  Home: undefined;
  AlarmCreate: { alarmToEdit?: any };
  AlarmSound: undefined;
  AlarmVibration: undefined;
  TopicSelect: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈', headerShown: false }} />
      <Stack.Screen name="AlarmCreate" component={AlarmCreateScreen} options={{ title: '알람 추가', headerShown: false }} />
      <Stack.Screen name="AlarmSound" component={AlarmSoundScreen} options={{ title: '알림음 선택',  }} />
      <Stack.Screen name="AlarmVibration" component={AlarmVibrationScreen} options={{ title: '진동 선택' }} />
      <Stack.Screen name="TopicSelect" component={TopicSelectScreen} options={{ title: '주제 선택' }} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;