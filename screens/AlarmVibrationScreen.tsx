import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlarmVibrationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>진동 선택 페이지</Text>
      {/* 여기 나중에 진동 패턴 목록, 미리보기 기능 추가 가능 */}
    </View>
  );
};

export default AlarmVibrationScreen;

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