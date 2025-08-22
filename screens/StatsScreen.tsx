import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FlipInEasyX } from 'react-native-reanimated';

const StatsScreen = () => {
  // 더미 데이터
  const weeklyRecords = [
    { day: '월요일', wakeUp: '7:05', watched: 2 },
    { day: '화요일', wakeUp: '실패', watched: 0 },
    { day: '수요일', wakeUp: '7:12', watched: 1 },
    { day: '목요일', wakeUp: '7:08', watched: 3 },
    { day: '금요일', wakeUp: '7:00', watched: 1 },
    { day: '토요일', wakeUp: '7:15', watched: 2 },
    { day: '일요일', wakeUp: '7:20', watched: 2 },
  ];

  const progressBar = (value: number, total: number) => {
    const percent = (value / total) * 100;
    return (
      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={['#ff66b3', '#d966ff']} // 원하는 그라데이션 색상
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressBarFill,
            { width: `${percent}%` },
          ]}
        />
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
        <LinearGradient
          colors={['#ff66b3', '#d966ff']} // 원하는 색상으로 조정
          start={{ x: 0, y: 0 }}          // 시작점
          end={{ x: 1, y: 1 }}            // 끝점 (대각선)
          style={styles.gridItem}     // 기존 View 스타일 그대로 사용
        >
          <Text style={styles.gridTitle}>이번 주 성공률</Text>
          <Text style={styles.gridValue}>86%</Text>
          <Text style={styles.gridSub}>6/7일 성공</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#6666ff', '#d966ff']} // 원하는 색상으로 조정
          start={{ x: 0, y: 0 }}          // 시작점
          end={{ x: 1, y: 1 }}            // 끝점 (대각선)
          style={styles.gridItem}     // 기존 View 스타일 그대로 사용
        >
          <Text style={styles.gridTitle}>평균 기상 시간</Text>
          <Text style={styles.gridValue}>7:40</Text>
          <Text style={styles.gridSub}>목표 7:30</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#ffe04c', '#ffb366']} // 원하는 색상으로 조정
          locations={[0, 0.8]}
          start={{ x: 0, y: 0 }}          // 시작점
          end={{ x: 1, y: 1 }}            // 끝점 (대각선)
          style={styles.gridItem}     // 기존 View 스타일 그대로 사용
        >
          <Text style={styles.gridTitle}>평균 영상 시청</Text>
          <Text style={styles.gridValue}>2.1개</Text>
          <Text style={styles.gridSub}>기상까지</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#ff66b3', '#d966ff']} // 원하는 색상으로 조정
          start={{ x: 0, y: 0 }}          // 시작점
          end={{ x: 1, y: 1 }}            // 끝점 (대각선)
          style={styles.gridItem}     // 기존 View 스타일 그대로 사용
        >
          <Text style={styles.gridTitle}>연속 성공</Text>
          <Text style={styles.gridValue}>4일</Text>
          <Text style={styles.gridSub}>현재 기록</Text>
        </LinearGradient>
      </View>

      {/* 이번 주 기록 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>이번 주 기록</Text>
        {weeklyRecords.map((item, index) => {
          let circleColor = '#aaa'; // 기본 회색
          let timeColor = '#000'; // 기본 검정색
          if (item.wakeUp === '실패') {
            circleColor = '#ef4444'; // 실패  
            timeColor = "#ef4444"
          } else if (item.wakeUp !== '' && item.wakeUp !== undefined) {
            circleColor = '#c34cff'; // 성공
          }

          return (
            <View key={index} style={styles.weekRow}>
              {/* 동그라미 아이콘 */}
              <View style={styles.justrow}>
                <View style={[styles.statusCircle, { backgroundColor: circleColor }]} />
                <Text style={styles.weekDay}>{item.day}</Text>
              </View>
              <View style={styles.justrow}>
                <Text style={[styles.weekTime, { color: timeColor }]}>{item.wakeUp}</Text>
                <Text style={styles.weekWatch}>{item.watched}개</Text>
              </View>
            </View>
          );
        })}
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
      <View style={styles.blank} />
    </ScrollView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 10, marginBottom: 12, textAlign: 'center', color: '#000000ff' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 22,
    alignItems: 'flex-start',
    marginBottom: 8,
    elevation: 1,
  },
  gridTitle: { fontSize: 14, color: '#ffffffff', marginBottom: 8, },
  gridValue: { fontSize: 28, color: '#ffffffff', fontWeight: 'bold', marginBottom: 6 },
  gridSub: { fontSize: 14, color: '#ffffffff' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  sectionTitle: { fontSize: 18, color: '#000000ff', fontWeight: 'bold', marginBottom: 8 },
  weekRow: {
    backgroundColor: '#fcfcfcff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  justrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  weekDay: { fontSize: 16, color: '#000000ff', fontWeight: '300' },
  weekTime: { fontSize: 14, color: '#202020ff', marginHorizontal: 24 },
  weekWatch: { fontSize: 14, color: '#696969ff' },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  goalText: { fontSize: 16, color: '#131313ff' },
  goalValue: { fontSize: 14, color: '#696969ff' },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  blank: {
    marginTop: 32,
  },
});