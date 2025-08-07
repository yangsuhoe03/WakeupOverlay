import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlarmCreateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>알람 추가 화면입니다</Text>
    </View>
  );
};

export default AlarmCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});