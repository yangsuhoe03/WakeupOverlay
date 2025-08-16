import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Platform, PermissionsAndroid, Modal, ActivityIndicator, Button, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { NativeModules } from 'react-native';

const { OverlayModule } = NativeModules;

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
    {
        id: '2',
        name: '헬스장 가기',
        period: '오후',
        time: '07:00',
        days: ['목', '금'],
        enabled: false,
        contentType: '주제 선택',
        topics: ['운동', '동기부여', '건강'],
    },
];



const HomeScreen = () => {

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

    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

    const handleAddAlarm = () => {
        navigation.navigate('AlarmCreate');
    };

    const alarms = dummyAlarms; //임시 추후 대체하기

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
        backgroundColor: 'rgba(205, 223, 255, 1)ff',
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
        marginTop: 24,
        alignItems: 'center',
    },
    addAlarmText: {
        fontSize: 16,
        color: '#007AFF',
    },
});