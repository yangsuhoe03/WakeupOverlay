import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlarmSoundScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림음 조절 페이지</Text>
      {/* 여기 나중에 알림음 목록, 미리듣기, 볼륨조절 등을 추가 가능 */}
    </View>
  );
};

export default AlarmSoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});