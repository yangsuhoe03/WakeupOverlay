import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const AlarmCreateScreen = () => {

  const navigation = useNavigation();

  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);

  const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b)
    );
  };

  const getRepeatText = () => {
    if (selectedDays.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const month = tomorrow.getMonth() + 1;
      const date = tomorrow.getDate();
      const dayName = daysKor[tomorrow.getDay()];
      return `내일 - ${month}월 ${date}일 (${dayName})`;
    } else {
      const selectedNames = selectedDays.map((d) => daysKor[d]);
      return `매주 ${selectedNames.join(', ')}`;
    }
  };

  return (
    <View style={styles.container}>

      {/* 시간 선택 영역 */}
      <View style={styles.timeContainer}>
        <Picker
          selectedValue={ampm}
          onValueChange={(value) => setAmpm(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>

        <Picker
          selectedValue={hour}
          onValueChange={(value) => setHour(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <Picker.Item key={h} label={h.toString()} value={h} />
          ))}
        </Picker>

        <Picker
          selectedValue={minute}
          onValueChange={(value) => setMinute(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <Picker.Item
              key={m}
              label={m.toString().padStart(2, '0')}
              value={m}
            />
          ))}
        </Picker>
      </View>

      {/* 중앙 옵션 박스 */}
      <View style={styles.infoBox}>
        <ScrollView contentContainerStyle={styles.infoScroll}>
          <Text style={styles.repeatText}>{getRepeatText()}</Text>

          <View style={styles.daysContainer}>
            {daysKor.map((day, index) => {
              const isSelected = selectedDays.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      isSelected && styles.dayButtonTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
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
  picker: {
    flex: 1,
  },
  pickerItem: {
    fontSize: 26,
    height: 150,
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
  repeatText: { fontSize: 16, fontWeight: '500', marginBottom: 12 },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayButtonText: { fontSize: 16, color: '#333' },
  dayButtonTextSelected: { color: '#fff' },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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