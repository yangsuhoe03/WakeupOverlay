import React from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '../navigation/HomeStackNavigator';
import StatsScreen from '../screens/StatsScreen';
import SettingsStackNavigator from '../navigation/SettingsStackNavigator';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

type TabBarIconProps = {
  name: string;
  label: string;
  focused: boolean;
};

function TabBarIcon({ name, label, focused }: TabBarIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        backgroundColor: focused ? '#f9edff' : 'transparent',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={name} size={24} color={focused ? '#c34cff' : '#73738c'} />
      <Text style={{ color: focused ? '#c34cff' : '#73738c', fontSize: 12 }}>
        {label}
      </Text>
    </Animated.View>
  );
}

type RootTabParamList = {
  HomeTab: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const baseTabBarStyle = {
  backgroundColor: '#ffffffff',
  borderTopWidth: 0,
  height: 80,
  paddingBottom: 10,
  paddingTop: 5,
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: baseTabBarStyle,
        tabBarIconStyle: {
          width: 90,  // 넉넉하게
          height: 60,
        },
        tabBarButton: ({ ref, ...props }) => {
          // Remove delayLongPress if it's null to satisfy TouchableOpacityProps
          const { delayLongPress, ...restProps } = props as any;
          const filteredProps =
            delayLongPress === null
              ? restProps
              : { delayLongPress, ...restProps };
          return (
            <TouchableOpacity
              {...filteredProps}
              activeOpacity={1}   // 터치 시 투명도 안 바뀌게
              style={props.style} // 기존 스타일 유지
            />
          );
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          const isHome = routeName === 'Home';
          return {
            tabBarStyle: isHome ? baseTabBarStyle : { display: 'none' },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="home" label="홈" focused={focused} />
            ),
          };
        }}
      />

      <Tab.Screen name="Stats" component={StatsScreen}
        options={{
          title: '통계',
          tabBarStyle: baseTabBarStyle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="bar-chart-2" label="통계" focused={focused} />
          ),
        }}
      />

      <Tab.Screen name="Settings" component={SettingsStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Settings';
          const isSettings = routeName === 'Settings';
          return {
            title: '설정',
            tabBarStyle: isSettings ? baseTabBarStyle : { display: 'none' },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="settings" label="설정" focused={focused} />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
}
