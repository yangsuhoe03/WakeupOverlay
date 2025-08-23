import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, NativeModules, Alert } from 'react-native';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleAlarm } from '../services/AlarmService';

const { OverlayModule } = NativeModules;

const AlarmRingingScreen = () => {

  const handleDismiss = async () => {
    console.log('[handleDismiss] Pressed dismiss button.');
    try {
      // 1. Cancel all currently scheduled notifications
      console.log('[handleDismiss] Cancelling all notifications.');
      await notifee.cancelAllNotifications();

      // 2. Get all saved alarms from storage
      console.log('[handleDismiss] Fetching all saved alarms from AsyncStorage.');
      const alarmsJson = await AsyncStorage.getItem('@alarms');
      if (alarmsJson) {
        const alarms = JSON.parse(alarmsJson);
        console.log(`[handleDismiss] Found ${alarms.length} saved alarms.`);

        // 3. Re-schedule all enabled alarms
        console.log('[handleDismiss] Re-scheduling enabled alarms for the next occurrence.');
        for (const alarm of alarms) {
          if (alarm.enabled) {
            await scheduleAlarm(alarm);
          }
        }
        console.log('[handleDismiss] Finished re-scheduling alarms.');
      } else {
        console.log('[handleDismiss] No saved alarms found in AsyncStorage.');
      }

      // 4. Show the overlay and close this screen
      console.log('[handleDismiss] Showing YouTube overlay...');
      OverlayModule.showOverlay();

      console.log('[handleDismiss] Closing this alarm screen...');
      OverlayModule.closeAlarmRingingOverlay();

    } catch (e) {
      console.error('[handleDismiss] An error occurred:', e);
      Alert.alert('오류', '알람을 다시 예약하는 중 오류가 발생했습니다.');
    } finally {
      console.log('[handleDismiss] Function finished.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wake Up!</Text>
      <TouchableOpacity style={styles.button} onPress={handleDismiss}>
        <Text style={styles.buttonText}>알람 끄기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 80,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default AlarmRingingScreen;