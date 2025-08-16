import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopicSelectScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>여기서 주제를 검색/선택하게 만들 예정</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, color: '#333' },
});