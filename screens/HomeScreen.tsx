import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Platform, PermissionsAndroid, Modal, ActivityIndicator, Button, Alert, } from 'react-native';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { NativeModules } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

const { OverlayModule } = NativeModules;

async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'wakeup-alarm',
        name: 'Wakeup Alarms',
        sound: 'default', // 기본 사운드 사용
        importance: 4, // AndroidImportance.HIGH
    });

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + 10000, // 10 seconds from now
    };

    // Display a trigger notification
    await notifee.createTriggerNotification(
        {
            title: 'Wake Up!',
            body: '알람을 끄고 새로운 하루를 시작하세요!',
            android: {
                channelId,
                loopSound: true, // 사운드 반복
                // required for calls and alarms with full-screen intent
                fullScreenAction: {
                    id: 'default',
                    // Launch the app's AlarmRingingActivity when the alarm fires
                    launchActivity: 'com.wakeupoverlay.AlarmRingingActivity',
                },
            },
        },
        trigger,
    );

    Alert.alert('알람 설정 완료', '10초 뒤에 알람이 울립니다.');
}

const dummyAlarms = [
    {
        id: '1',
        name: '기상 알람',
        period: '오전',
        time: '06:30',
        days: ['월', '화', '수'],
        enabled: true,
        contentType: '자동 추천',
        topics: [],
    },
    // {
    //     id: '2',
    //     name: '헬스장 가기',
    //     period: '오후',
    //     time: '07:00',
    //     days: ['목', '금'],
    //     enabled: false,
    //     contentType: '주제 선택',
    //     topics: ['운동', '동기부여', '건강'],
    // },
];



const HomeScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const [alarms, setAlarms] = useState<any[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadAlarms = async () => {
            try {
                const existingAlarms = await AsyncStorage.getItem('@alarms');
                setAlarms(existingAlarms != null ? JSON.parse(existingAlarms) : []);
            } catch (e) {
                console.error('Failed to load alarms.', e);
                Alert.alert('오류', '알람 목록을 불러오는 데 실패했습니다.');
            }
        };

        if (isFocused) {
            loadAlarms();
        }
    }, [isFocused]);



    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            if (Platform.OS === 'android' && Platform.Version >= 33) {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                if (!granted) setShowPermissionModal(true);
            }
        };
        checkPermission();
    }, []);

    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                        {
                            title: 'WakeupOverlay 알림 권한',
                            message: '포그라운드 서비스를 실행하고 상태를 표시하기 위해 알림 권한이 필요합니다.',
                            buttonPositive: '확인',
                        }
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        OverlayModule.startListener();
                    } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                        Alert.alert('권한 거부', '알림 권한을 허용해야 정상 동작합니다.');
                    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                        Alert.alert('권한 거부됨', '설정에서 알림 권한을 수동으로 허용해야 합니다.');
                    }
                } else {
                    // Android 12 이하 → 알림 권한 불필요, 바로 서비스 시작
                    OverlayModule.startListener();
                }
            }
        } catch (err) {
            console.warn(err);
        } finally {
            setShowPermissionModal(false);
        }
    };

    //const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

    const handleAddAlarm = () => {//새 알람 추가
        navigation.navigate('AlarmCreate', {});
    };
    const handleEdit = (alarm: any) => { // 알람 수정
        // 알람 수정 화면으로 이동                                                                 
        navigation.navigate('AlarmCreate', { alarmToEdit: alarm });
    };

    const handleViewScheduledAlarms = async () => {
        try {
            const notifications = await notifee.getTriggerNotifications();
            console.log('Currently scheduled notifications:', JSON.stringify(notifications, null, 2));
            if (notifications.length > 0) {
                const notificationList = notifications.map(n => {
                    if (n.trigger.type === TriggerType.TIMESTAMP && 'timestamp' in n.trigger) {
                        return `ID: ${n.notification.id}\nTrigger: ${new Date((n.trigger as TimestampTrigger).timestamp).toLocaleString()}`;
                    } else {
                        return `ID: ${n.notification.id}\nTrigger: (타입: ${n.trigger.type})`;
                    }
                }).join('\n\n');
                Alert.alert('예약된 알람 목록', notificationList);
            } else {
                Alert.alert('예약된 알람 목록', '현재 예약된 알람이 없습니다.');
            }
        } catch (e) {
            console.error('Failed to get scheduled alarms', e);
            Alert.alert('오류', '예약된 알람을 가져오는 데 실패했습니다.');
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "알람 삭제",
            "정말로 이 알람을 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "삭제",
                    onPress: async () => {
                        try {
                            // Cancel all possible notifications for this alarm
                            // 1. The one-time alarm ID
                            await notifee.cancelNotification(id);
                            // 2. All potential weekly alarm IDs (0 for Sun, 1 for Mon, etc.)
                            for (let i = 0; i < 7; i++) {
                                await notifee.cancelNotification(`${id}-${i}`);
                            }
                            console.log(`Cancelled all notifications for alarm id: ${id}`);

                            const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
                            await AsyncStorage.setItem('@alarms', JSON.stringify(updatedAlarms));
                            setAlarms(updatedAlarms);
                        } catch (e) {
                            console.error('Failed to delete alarm.', e);
                            Alert.alert('오류', '알람을 삭제하는 데 실패했습니다.');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    //const alarms = dummyAlarms; //임시 추후 대체하기

    return (
        <View style={styles.container}>

            <Modal visible={showPermissionModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>권한이 필요합니다</Text>
                        <Text style={styles.description}>
                            알림 권한을 허용하면 화면 켜짐 감지 서비스가 정상적으로 동작합니다.
                        </Text>
                        <Button title="권한 허용 및 서비스 시작" onPress={requestPermissions} />
                    </View>
                </View>
            </Modal>


            <LinearGradient
                colors={['#ff66b3', '#d966ff']} // 원하는 색상으로 조정
                start={{ x: 0, y: 0 }}          // 시작점
                end={{ x: 1, y: 1 }}            // 끝점 (대각선)
                style={styles.nextAlarmBox}     // 기존 View 스타일 그대로 사용
            >
                <View style={styles.justrow}>
                    <Icon name="clock" size={20} color="#fff" style={styles.nextAlarmIcon} />
                    <Text style={styles.nextAlarmTitle}>다음 알람까지</Text>
                </View>
                <Text style={styles.nextAlarmTime}>6시간 40분</Text>
                <Button title="10초 뒤 알람 설정 (테스트)" onPress={() => onDisplayNotification()} />
                <Button title="예약된 알람 목록 확인" onPress={handleViewScheduledAlarms} color="#28a745" />
            </LinearGradient>
            <View style={{ marginTop: 8 }} />
            {/* 상태 박스 2개 (성공/실패, 평균 기상 시간) */}
            <View style={styles.statusBoxContainer}>
                <LinearGradient
                    colors={['#ffe04c', '#ffb366']} // 원하는 색상으로 조정
                    locations={[0, 0.8]}
                    start={{ x: 0, y: 0 }}          // 시작점
                    end={{ x: 1, y: 1 }}            // 끝점 (대각선)
                    style={styles.statusBox}     // 기존 View 스타일 그대로 사용
                >
                    <View style={styles.justrow2}>
                        <Text style={styles.statusText1}>오늘 기상</Text>
                        <Icon name="trending-up" size={24} color="#ffffffff" style={styles.nextAlarmIcon} />
                    </View>
                    <Text style={styles.statusText2}>성공!</Text>
                    <Text style={styles.statusText3}>7:05AM</Text>
                </LinearGradient>

                <LinearGradient
                    colors={['#6666ff', '#d966ff']} // 원하는 색상으로 조정
                    start={{ x: 0, y: 0 }}          // 시작점
                    end={{ x: 1, y: 1 }}            // 끝점 (대각선)
                    style={styles.statusBox}     // 기존 View 스타일 그대로 사용
                >
                    <Text style={styles.statusText1}>평균 기상 시간</Text>
                    <Text style={styles.statusText2}>7:12</Text>
                    <Text style={styles.statusText3}>지난 7일</Text>
                </LinearGradient>
            </View>

            {/* 내 알람 헤더 */}
            <View style={styles.alarmHeader}>
                <Text style={styles.alarmHeaderText}>내 알람</Text>
                <LinearGradient
                    colors={['#ff66b3', '#d966ff']} // 원하는 색상으로 조정
                    start={{ x: 0, y: 0 }}          // 시작점
                    end={{ x: 1, y: 1 }}            // 끝점 (대각선)
                    style={styles.addButtonBox}     // 기존 View 스타일 그대로 사용
                >
                    <TouchableOpacity onPress={handleAddAlarm}>
                        <Text style={styles.addButton}>+ 추가</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            {/* 알람 리스트 */}
            {
                alarms.length > 0 ? ( //알람 리스트가 비어있지 않으면
                    <FlatList
                        data={alarms}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.alarmItem}>
                                {/* 알람 이름 */}
                                <Text style={styles.alarmName}>{item.name}</Text>

                                {/* 시간 + 요일 */}
                                <View style={styles.alarmInfo}>
                                    <Text style={styles.alarmTime}>
                                        {item.period} {item.time}
                                    </Text>
                                    <Text style={styles.alarmDays}>{item.days.join(', ')}</Text>
                                </View>

                                {/* 콘텐츠 타입 + 주제 */}
                                <Text style={styles.contentType}>
                                    {item.contentType}
                                    {item.topics.length > 0 && `: ${item.topics.join(', ')}`}
                                </Text>

                                {/* 스위치 + 수정/삭제 */}
                                <Switch value={item.enabled} />
                                <View style={styles.alarmActions}>
                                    <TouchableOpacity onPress={() => handleEdit(item)}>
                                        <Text style={styles.actionButton}>수정</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                        <Text style={styles.actionButton}>삭제</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                ) : ( //알람 리스트가 비어있다면
                    <View style={styles.emptyAlarmContainer}>
                        <Text style={styles.noAlarmText}>알람이 없습니다</Text>
                        <Text style={styles.addAlarmText}>새 알람을 추가해보세요!</Text>
                    </View>
                )
            }
        </View >
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, marginBottom: 20 },
    nextAlarmBox: {
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    nextAlarmIcon: {
        marginRight: 6,
    },
    nextAlarmTitle: {
        fontSize: 16,
        color: '#ffffffff',
    },
    nextAlarmTime: {
        fontSize: 28,
        color: '#ffffffff',
        fontWeight: 'bold',
        marginTop: 6,
    },
    statusBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
    },
    statusBox: {
        flex: 1,
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'flex-start',
    },
    statusText1: {
        textAlign: 'center',
        fontSize: 14,
        color: '#ffffffff',
        marginTop: 8,
    }, statusText2: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffffff',
        marginTop: 6,
        marginBottom: 6,
    }, statusText3: {
        textAlign: 'center',
        fontSize: 14,
        color: '#ffffffff',
        marginBottom: 8,
    },
    alarmHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    alarmHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1d1d1dff',
    },
    addButtonBox: {
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    addButton: {
        fontSize: 16,
        color: '#ffffffff',
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
    alarmName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    contentType: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
        marginBottom: 8,
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
        flexDirection: 'column',
        marginTop: 24,
        alignItems: 'center',
    },
    noAlarmText: {
        fontSize: 18,
        color: '#818181ff',
        marginBottom: 8,
    },
    addAlarmText: {
        fontSize: 16,
        color: '#818181ff',
    },
    justrow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    justrow2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // 추가
    },
});