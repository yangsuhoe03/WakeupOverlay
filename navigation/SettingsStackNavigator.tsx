import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import ContentPlayerScreen from '../screens/ContentPlayerScreen';
import AlarmRingingScreen from '../screens/AlarmRingingScreen';
import PreferredContentScreen from '../screens/PreferredContentScreen';


export type SettingsStackParamList = {
  Settings: undefined;
  ContentPlayer: undefined;
  AlarmRinging: undefined;
  PreferredContent: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '설정', headerShown: false }} />
      <Stack.Screen name="ContentPlayer" component={ContentPlayerScreen} options={{ title: '콘텐츠 재생', headerShown: false }} />
      <Stack.Screen name="AlarmRinging" component={AlarmRingingScreen} options={{ title: '알람 울림', headerShown: false }} />
      <Stack.Screen name="PreferredContent" component={PreferredContentScreen} options={{ title: '선호 콘텐츠 유형', headerShown: false }} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;