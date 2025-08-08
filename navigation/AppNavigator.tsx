import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '../navigation/HomeStackNavigator';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

type RootTabParamList = {
  HomeTab: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          if (routeName === 'AlarmCreate') {
            return { tabBarStyle: { display: 'none' } };
          }
          return {};
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: '통계' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '설정' }} />
    </Tab.Navigator>
  );
}
