import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ContentPlayerScreen from './ContentPlayerScreen';

const AlarmRingingScreen = () => {
  const [isAlarmStopped, setIsAlarmStopped] = useState(false);

  const handleStopAlarm = () => {
    // 알람 끄는 로직 (소리 멈추기 등)
    setIsAlarmStopped(true);
  };

  if (isAlarmStopped) {
    // 알람 끈 후에는 바로 컨텐츠 재생 화면 표시
    return <ContentPlayerScreen />;
  }

  // 알람 울리는 화면
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ 알람 울림!</Text>
      <TouchableOpacity style={styles.stopButton} onPress={handleStopAlarm}>
        <Text style={styles.stopButtonText}>알람 끄기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlarmRingingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  stopButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  stopButtonText: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: 'bold',
  },
});