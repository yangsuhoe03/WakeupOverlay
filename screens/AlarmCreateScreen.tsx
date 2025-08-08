import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, } from 'react-native';


const AlarmCreateScreen = () => {

  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);


  return (
    <View style={styles.container}>

      <View style={styles.timeContainer}>
        <TouchableOpacity
          style={styles.ampmButton}
          onPress={() => setAmpm(ampm === 'AM' ? 'PM' : 'AM')}
        >
          <Text style={styles.ampmText}>{ampm}</Text>
        </TouchableOpacity>

        <Text style={styles.timeText}>{hour.toString().padStart(2, '0')}</Text>
        <Text style={styles.timeColon}>:</Text>
        <Text style={styles.timeText}>{minute.toString().padStart(2, '0')}</Text>
      </View>

      <View style={styles.infoBox}>
        <ScrollView contentContainerStyle={styles.infoScroll}>
          {/* 여기에 요일 선택, 이름 입력 등 추가 예정 */}
          <Text style={styles.placeholderText}>알람 설정 옵션 영역</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]}>
          <Text style={styles.buttonText}>저장</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default AlarmCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 20,
  },
  ampmButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 10,
  },
  ampmText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  timeColon: {
    fontSize: 48,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  infoBox: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  infoScroll: {
    padding: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});