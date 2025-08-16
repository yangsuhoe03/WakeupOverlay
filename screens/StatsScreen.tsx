import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const StatsScreen = () => {
  // 더미 데이터
  const weeklyRecords = [
    { day: '월', wakeUp: '7:05', watched: 2 },
    { day: '화', wakeUp: '실패', watched: 0 },
    { day: '수', wakeUp: '7:12', watched: 1 },
    { day: '목', wakeUp: '7:08', watched: 3 },
    { day: '금', wakeUp: '7:00', watched: 1 },
    { day: '토', wakeUp: '7:15', watched: 2 },
    { day: '일', wakeUp: '7:20', watched: 2 },
  ];

  const progressBar = (value: number, total: number) => {
    const percent = (value / total) * 100;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 제목 */}
      <Text style={styles.title}>기상 통계</Text>
      <Text style={styles.subtitle}>나의 기상 패턴을 확인해보세요</Text>

      {/* 2x2 박스 */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>이번 주 성공률</Text>
          <Text style={styles.gridValue}>86%</Text>
          <Text style={styles.gridSub}>6/7일 성공</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>평균 기상 시간</Text>
          <Text style={styles.gridValue}>7:40</Text>
          <Text style={styles.gridSub}>목표 7:30</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>평균 영상 시청</Text>
          <Text style={styles.gridValue}>2.1개</Text>
          <Text style={styles.gridSub}>기상까지</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>연속 성공</Text>
          <Text style={styles.gridValue}>4일</Text>
          <Text style={styles.gridSub}>현재 기록</Text>
        </View>
      </View>

      {/* 이번 주 기록 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>이번 주 기록</Text>
        {weeklyRecords.map((item, index) => (
          <View key={index} style={styles.weekRow}>
            <Text style={styles.weekDay}>{item.day}</Text>
            <Text style={styles.weekTime}>{item.wakeUp}</Text>
            <Text style={styles.weekWatch}>{item.watched}개</Text>
          </View>
        ))}
      </View>

      {/* 월간 목표 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>월간 목표</Text>

        {/* 첫 번째 목표 */}
        <View style={styles.goalRow}>
          <Text style={styles.goalText}>7:30 이전 기상</Text>
          <Text style={styles.goalValue}>15/30일</Text>
        </View>
        {progressBar(15, 30)}

        {/* 두 번째 목표 */}
        <View style={styles.goalRow}>
          <Text style={styles.goalText}>영상 3개 이하로 기상</Text>
          <Text style={styles.goalValue}>22/30일</Text>
        </View>
        {progressBar(22, 30)}
      </View>
    </ScrollView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
  },
  gridTitle: { fontSize: 14, color: '#777', marginBottom: 4 },
  gridValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  gridSub: { fontSize: 12, color: '#999' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  weekDay: { fontSize: 14, fontWeight: '500' },
  weekTime: { fontSize: 14, color: '#555' },
  weekWatch: { fontSize: 14, color: '#555' },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  goalText: { fontSize: 14, fontWeight: '500' },
  goalValue: { fontSize: 14, fontWeight: '500' },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});