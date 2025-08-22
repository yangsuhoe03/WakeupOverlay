import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, Animated, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../navigation/SettingsStackNavigator';
import Icon from 'react-native-vector-icons/Feather';
import Toggle from '../components/Toggle';
import { Linking } from 'react-native';

const SettingsScreen = () => {
  // 네비게이션 훅
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const goToAlarmRinging = () => {
    navigation.navigate('AlarmRinging');
  };

  // 토글 상태
  const [snooze, setSnooze] = useState(false);
  const [gradualVolume, setGradualVolume] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>설정</Text>

      {/* 알람 설정 */}
      <View style={styles.section}>
        <View style={styles.justrow}>
          <Icon name="bell" size={24} color="#c34cff" style={styles.nextAlarmIcon} />
          <Text style={styles.sectionTitle}>알람 설정</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingName}>스누즈 기능</Text>
            <Text style={styles.settingSub}>5분 후 다시 알람</Text>
          </View>
          <Toggle value={snooze} onChange={setSnooze} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingName}>점진적 볼륨 증가</Text>
            <Text style={styles.settingSub}>서서히 볼륨이 커집니다</Text>
          </View>
          <Toggle value={gradualVolume} onChange={setGradualVolume} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingName}>진동 알람</Text>
            <Text style={styles.settingSub}>소리와 함께 진동</Text>
          </View>
          <Toggle value={vibration} onChange={setVibration} />
        </View>
      </View>

      {/* 콘텐츠 설정 */}
      <View style={styles.section}>
        <View style={styles.justrow}>
          <Icon name="video" size={24} color="#ff66cc" style={styles.nextAlarmIcon} />
          <Text style={styles.sectionTitle}>콘텐츠 설정</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingName}>선호 콘텐츠 유형</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PreferredContent')}>
            <Text style={styles.modifyButton}>수정하기 &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagContainer}>
          {['유머', '동물', '음식', '여행', '운동', '음악'].map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingName}>자동 재생</Text>
            <Text style={styles.settingSub}>알람 후 바로 시작</Text>
          </View>
          <Toggle value={autoPlay} onChange={setAutoPlay} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Wifi에서만 재생</Text>
            <Text style={styles.settingSub}>데이터 절약</Text>
          </View>
          <Toggle value={wifiOnly} onChange={setWifiOnly} />
        </View>
      </View>

      {/* 앱 정보 */}
      <View style={styles.section}>
        <View style={styles.justrow}>
          <Icon name="info" size={24} color="#ffe76e" style={styles.nextAlarmIcon} />
          <Text style={styles.sectionTitle}>앱 정보</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.settingName}>버전</Text>
          <Text>1.0.1</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.settingName}>개발자</Text>
          <Text>royalkingkiwi</Text>
        </View>

        <TouchableOpacity style={styles.linkBox} onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSdZZg9YyR-uqNJmjbaL-d_nuYf-tmtxOu_3_ydWkUIW5cyOHA/viewform?usp=header')}>
          <Text style={styles.linkText}>문의하기</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>


  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: "#333", margin: 12, marginBottom: 20 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: { fontSize: 20, color: "#333", fontWeight: 'bold', marginBottom: 12, },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  settingText: { flex: 1, marginRight: 8 },
  settingName: { fontSize: 15, color: '#333', fontWeight: '500' },
  settingSub: { fontSize: 13, color: '#777' },
  modifyButton: { fontSize: 14, color: '#007AFF' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  tag: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { fontSize: 12, color: '#333' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  linkBox: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  linkText: { fontSize: 14, color: '#007AFF' },
  testButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextAlarmIcon: {
    alignItems: 'center',
    marginRight: 6,
  },
  justrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  toggleBackground: {
    width: 50,
    height: 26,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 2,
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
});