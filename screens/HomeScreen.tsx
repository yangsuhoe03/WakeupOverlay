import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';

const dummyAlarms = [ //이건 예시 나중에 데이터 저장 구현하기
    {
        id: '1',
        time: '06:30',
        days: ['월', '화', '수'],
        enabled: true,
    },
    {
        id: '2',
        time: '07:00',
        days: ['목', '금'],
        enabled: false,
    },
];



const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

    const handleAddAlarm = () => {
        navigation.navigate('AlarmCreate');
    };

    const alarms = dummyAlarms; //임시 추후 대체하기

    return (
        <View style={styles.container}>
            <View style={styles.nextAlarmBox}>
                <Text style={styles.nextAlarmTitle}>다음 알람까지</Text>
                <Text style={styles.nextAlarmTime}>6시간 40분</Text>
            </View>

            {/* 상태 박스 2개 (성공/실패, 평균 기상 시간) */}
            <View style={styles.statusBoxContainer}>
                <View style={styles.statusBox}>
                    <Text style={styles.statusText}>오늘 기상 성공! (7:05AM)</Text>
                </View>

                <View style={styles.statusBox}>
                    <Text style={styles.statusText}>
                        평균 기상 시간{'\n'}7:12{'\n'}지난 7일
                    </Text>
                </View>
            </View>

            {/* 내 알람 헤더 */}
            <View style={styles.alarmHeader}>
                <Text style={styles.alarmHeaderText}>내 알람</Text>
                <TouchableOpacity onPress={handleAddAlarm}>
                    <Text style={styles.addButton}>+ 추가</Text>
                </TouchableOpacity>
            </View>

            {/* 알람 리스트 */}
            {alarms.length > 0 ? ( //알람 리스트가 비어있지 않으면
                <FlatList
                    data={alarms}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.alarmItem}>
                            <View style={styles.alarmInfo}>
                                <Text style={styles.alarmTime}>{item.time}</Text>
                                <Text style={styles.alarmDays}>{item.days.join(', ')}</Text>
                            </View>

                            <Switch value={item.enabled} />

                            <View style={styles.alarmActions}>
                                <TouchableOpacity>
                                    <Text style={styles.actionButton}>수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.actionButton}>삭제</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : ( //알람 리스트가 비어있다면
                <View style={styles.emptyAlarmContainer}>
                    <TouchableOpacity>
                        <Text style={styles.addAlarmText}>알람 추가</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    nextAlarmBox: {
        backgroundColor: '#E8F0FE',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    nextAlarmTitle: {
        fontSize: 16,
        color: '#555',
    },
    nextAlarmTime: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statusBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 16,
    },
    statusBox: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
    },
    alarmHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    alarmHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        fontSize: 16,
        color: '#007AFF',
    },
    alarmItem: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        elevation: 1,
    },
    alarmInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    alarmTime: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    alarmDays: {
        fontSize: 14,
        color: '#777',
        alignSelf: 'center',
    },
    alarmActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        fontSize: 14,
        color: '#007AFF',
    },
    emptyAlarmContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    addAlarmText: {
        fontSize: 16,
        color: '#007AFF',
    },
});