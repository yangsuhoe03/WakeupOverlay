import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Alert, NativeModules } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';

const AlarmCreateScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'AlarmCreate'>>();
  const { alarmToEdit } = route.params || {};

  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);

  const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const [alarmName, setAlarmName] = useState('');

  React.useEffect(() => {
    if (alarmToEdit) {
      const [h, m] = alarmToEdit.time.split(':');
      const period = alarmToEdit.period === '오전' ? 'AM' : 'PM';
      
      setAlarmName(alarmToEdit.name);
      setAmpm(period);
      setHour(parseInt(h, 10));
      setMinute(parseInt(m, 10));
      setSelectedDays(alarmToEdit.days.map((day: string) => daysKor.indexOf(day)).filter((i: number) => i !== -1));
      setAutoRecommend(alarmToEdit.contentType === '자동 추천');
      setTopics(alarmToEdit.topics || []);
    }
  }, [alarmToEdit]);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b)
    );
  };

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState('기본 알림음');


  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [selectedVibration, setSelectedVibration] = useState('기본 진동');

  const toggleSound = () => setSoundEnabled((prev) => !prev);
  const toggleVibration = () => setVibrationEnabled((prev) => !prev);

  const [autoRecommend, setAutoRecommend] = useState(true);
  const [topics, setTopics] = useState<string[]>([]);
  const [alarmList, setAlarmList] = useState<any[]>([]);
  const [alarmId, setAlarmId] = useState(1);

  const scheduleAlarm = async (alarmData: any) => {
    console.log('Scheduling alarm with notifee:', alarmData);
  
    const channelId = await notifee.createChannel({
      id: 'wakeup-alarm',
      name: 'Wakeup Alarms',
      sound: 'default',
      importance: 4, // AndroidImportance.HIGH
    });
  
    const pickerHour = parseInt(alarmData.time.split(':')[0], 10);
    const pickerMinute = parseInt(alarmData.time.split(':')[1], 10);
    let hour24 = pickerHour;
    if (alarmData.period === '오후' && pickerHour !== 12) {
      hour24 += 12;
    } else if (alarmData.period === '오전' && pickerHour === 12) {
      hour24 = 0;
    }
  
    // If no days are selected, schedule a one-time alarm for the next occurrence
    if (alarmData.days.length === 0) {
      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(hour24, pickerMinute, 0, 0);
  
      if (triggerDate.getTime() <= now.getTime()) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }
  
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
      };
  
      await notifee.createTriggerNotification(
        {
          id: alarmData.id, // Use the main alarm ID
          title: alarmData.name,
          body: '알람을 끄고 새로운 하루를 시작하세요!',
          android: { channelId, loopSound: true, fullScreenAction: { id: 'default', launchActivity: 'com.wakeupoverlay.AlarmRingingActivity' } },
        },
        trigger,
      );
      console.log(`One-time alarm scheduled for ${triggerDate.toString()}`);
      Alert.alert('알람 저장됨', `다음 알람: ${triggerDate.toLocaleString()}`);
      return;
    }
  
    // If days are selected, schedule a weekly repeating alarm for each selected day
    for (const dayName of alarmData.days) {
      const dayIndex = daysKor.indexOf(dayName);
      if (dayIndex === -1) continue;
  
      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(hour24, pickerMinute, 0, 0);
  
      // Find the next date for the selected day of the week
      const currentDay = now.getDay(); // 0 (Sun) - 6 (Sat)
      let dayDifference = dayIndex - currentDay;
      if (dayDifference < 0 || (dayDifference === 0 && triggerDate.getTime() <= now.getTime())) {
        dayDifference += 7;
      }
      triggerDate.setDate(now.getDate() + dayDifference);
  
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
        repeatFrequency: RepeatFrequency.WEEKLY,
      };
  
      // Create a unique ID for each day's notification
      const notificationId = `${alarmData.id}-${dayIndex}`;
  
      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: alarmData.name,
          body: `매주 ${dayName}요일 알람입니다!`,
          android: { channelId, loopSound: true, fullScreenAction: { id: 'default', launchActivity: 'com.wakeupoverlay.AlarmRingingActivity' } },
        },
        trigger,
      );
      console.log(`Weekly alarm for ${dayName} scheduled for ${triggerDate.toString()}`);
    }
    Alert.alert('알람 저장됨', `매주 ${alarmData.days.join(', ')}요일에 알람이 울립니다.`);
  };


  const handleSave = async () => {
    if (alarmName.trim() === '') {
      Alert.alert('알림', '알람 이름을 입력해주세요.');
      return;
    }

    const alarmData = {
      id: alarmToEdit?.id || `alarm-${new Date().getTime()}`,
      name: alarmName || '알람',
      period: ampm === 'AM' ? '오전' : '오후',
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      days: selectedDays.map(dayIndex => daysKor[dayIndex]),
      enabled: alarmToEdit?.enabled ?? true,
      contentType: autoRecommend ? '자동 추천' : '주제 선택',
      topics: topics,
    };

    try {
      // If editing, cancel all possible previous notifications for this alarm
      if (alarmToEdit) {
        // Cancel the potential one-time alarm
        await notifee.cancelNotification(alarmToEdit.id);
        // Cancel all potential weekly alarms
        for (let i = 0; i < 7; i++) {
          await notifee.cancelNotification(`${alarmToEdit.id}-${i}`);
        }
      }

      const existingAlarmsJson = await AsyncStorage.getItem('@alarms');
      const existingAlarms = existingAlarmsJson ? JSON.parse(existingAlarmsJson) : [];
      
      let updatedAlarms;
      if (alarmToEdit) {
        updatedAlarms = existingAlarms.map((alarm: any) => 
          alarm.id === alarmToEdit.id ? alarmData : alarm
        );
      } else {
        updatedAlarms = [...existingAlarms, alarmData];
      }

      await AsyncStorage.setItem('@alarms', JSON.stringify(updatedAlarms));
      
      await scheduleAlarm(alarmData);

      navigation.goBack();
    } catch (e) {
      console.error('Failed to save or schedule alarm.', e);
      Alert.alert('오류', '알람을 저장하거나 예약하는 데 실패했습니다.');
    }
  };

  const handleSelectSound = () => {
    navigation.navigate('AlarmSound');
  };
  const handleSelectVibration = () => {
    navigation.navigate('AlarmVibration');
  };

  const handleAddTopic = () => {
    // 간단하게 Alert + prompt처럼 구현 (실제 앱에서는 Modal이나 TextInput)
    Alert.prompt(
      "주제 추가",
      "어떤 주제를 추가할까요?",
      (text) => {
        if (text && text.trim() !== '') {
          setTopics((prev) => [...prev, text.trim()]);
        }
      }
    );
  };
  const handleSelectTopic = () => {
    if (!autoRecommend) {
      navigation.navigate('TopicSelect'); // 단순 이동만
    }
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

          <TextInput
            style={styles.alarmNameInput}
            placeholder="알람 이름"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={alarmName}
            onChangeText={setAlarmName}
          />

          <View style={styles.soundRow}>
            <TouchableOpacity style={styles.soundButton} onPress={handleSelectSound}>
              <Text style={styles.soundLabel}>알림음</Text>
              <Text style={styles.soundName}>{selectedSound}</Text>
            </TouchableOpacity>
            <Switch value={soundEnabled} onValueChange={toggleSound} />
          </View>

          <View style={styles.soundRow}>
            <TouchableOpacity style={styles.soundButton} onPress={handleSelectVibration}>
              <Text style={styles.soundLabel}>진동</Text>
              <Text style={styles.soundName}>{selectedVibration}</Text>
            </TouchableOpacity>
            <Switch value={vibrationEnabled} onValueChange={toggleVibration} />
          </View>

          <View style={styles.soundRow}>
            <Text style={styles.soundLabel}>자동 추천 콘텐츠</Text>
            <Switch
              value={autoRecommend}
              onValueChange={setAutoRecommend}
            />
          </View>

          {/* 주제 선택 영역 */}
          <View style={[
            styles.topicContainer,
            autoRecommend && styles.topicDisabled
          ]}>
            <View style={styles.topicHeader}>
              <Text style={styles.soundLabel}>주제 선택</Text>
              <TouchableOpacity
                onPress={handleSelectTopic}
                disabled={autoRecommend}
                style={[styles.addButton, autoRecommend && { opacity: 0.5 }]}
              >
                <Text style={styles.addButtonText}>선택</Text>
              </TouchableOpacity>
            </View>

            {/* 주제 목록 */}
            {topics.length === 0 ? (
              <Text style={styles.placeholderText}>선택된 주제가 없습니다.</Text>
            ) : (
              topics.map((topic, idx) => (
                <Text key={idx} style={styles.topicItem}>{topic}</Text>
              ))
            )}
          </View>

        </ScrollView>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
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
  alarmNameInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  soundButton: {
    flex: 1,
  },
  soundLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  soundName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  topicContainer: {
    marginTop: 12,
    paddingVertical: 8,
  },
  topicDisabled: {
    opacity: 0.4,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topicItem: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
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