import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './navigation/AppNavigator';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import notifee, { EventType } from '@notifee/react-native';

// Define the param list for the stack navigator
export type RootStackParamList = {
  Main: undefined;
  AlarmRinging: { notificationId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>(); // Use the param list here

function App(): React.JSX.Element {
  // Properly type the ref
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      const { notification } = detail;

      if (type === EventType.DELIVERED && notification && notification.android && notification.android.fullScreenAction) {
        console.log('Foreground alarm received, navigating to AlarmRingingScreen');
        // The type is now correctly inferred, and this call is safe
        navigationRef.current?.navigate('AlarmRinging', {
          notificationId: notification.id,
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={AppNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;