import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '../navigation/HomeStackNavigator';
import StatsScreen from '../screens/StatsScreen';
import SettingsStackNavigator from '../navigation/SettingsStackNavigator';
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

          const isHome = routeName === 'Home';
          return {
            tabBarStyle: isHome ? {} : { display: 'none' },
          };
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: '통계' }} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Settings';
          const isSettings = routeName === 'Settings';
          return {
            title: '설정',
            tabBarStyle: isSettings ? {} : { display: 'none' },
          };
        }}
      />
    </Tab.Navigator>
  );
}
