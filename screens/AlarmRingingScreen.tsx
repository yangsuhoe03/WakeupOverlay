import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, NativeModules } from 'react-native';
import notifee from '@notifee/react-native';

const { OverlayModule } = NativeModules;

const AlarmRingingScreen = (props: any) => {
  const [notificationId, setNotificationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('[AlarmRingingScreen] useEffect triggered.');
    const getInitialNotification = async () => {
      // Check if the app was launched by a notification
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        console.log('App launched by notification:', JSON.stringify(initialNotification, null, 2));
        setNotificationId(initialNotification.notification.id);
      } else {
        // Fallback for foreground navigation case
        const idFromNav = props.route?.params?.notificationId;
        if (idFromNav) {
          console.log('Notification ID from navigation params:', idFromNav);
          setNotificationId(idFromNav);
        }
      }
    };

    getInitialNotification();
  }, [props.route?.params?.notificationId]);

  const handleDismiss = async () => {
    console.log('[handleDismiss] Pressed dismiss button.');
    try {
      if (notificationId) {
        console.log(`[handleDismiss] Attempting to cancel notification with ID: ${notificationId}`);
        await notifee.cancelNotification(notificationId);
        console.log(`[handleDismiss] Successfully cancelled notification ${notificationId}.`);
      } else {
        console.log('[handleDismiss] No notificationId found, cancelling all notifications as a fallback.');
        await notifee.cancelAllNotifications();
      }

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
      <Text style={styles.subtitle}>ID: {notificationId || 'N/A'}</Text>
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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
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