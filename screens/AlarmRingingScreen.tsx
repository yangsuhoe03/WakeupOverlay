import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, NativeModules } from 'react-native';
import notifee from '@notifee/react-native';

const { OverlayModule } = NativeModules;

const AlarmRingingScreen = () => {
  const handleDismiss = async () => {
    console.log('[handleDismiss] Pressed dismiss button.');
    try {
      console.log('[handleDismiss] Attempting to cancel all notifications...');
      await notifee.cancelAllNotifications();
      console.log('[handleDismiss] Successfully cancelled all notifications.');

      console.log('[handleDismiss] Showing YouTube overlay...');
      OverlayModule.showOverlay();

      console.log('[handleDismiss] Closing this alarm screen...');
      OverlayModule.closeAlarmRingingOverlay();
    } catch (e) {
      console.error('[handleDismiss] An error occurred:', e);
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
    marginBottom: 100,
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
