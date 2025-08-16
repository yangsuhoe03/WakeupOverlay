import React from 'react';
import { View, Text, Button, Alert, Platform, PermissionsAndroid, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { OverlayModule } = NativeModules;

interface Props {
    navigation: any; // 정확하게 타입 지정 가능
}
export default function TutorialScreen({ navigation }: Props) {

    const goToHome = () => {
        navigation.replace('MainApp'); // AppNavigator로 이동
    };


    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android' && Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'WakeupOverlay 알림 권한',
                        message: '포그라운드 서비스를 실행하고 상태를 표시하기 위해 알림 권한이 필요합니다.',
                        buttonPositive: '확인',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('권한 거부', '알림 권한이 없어 서비스를 시작할 수 없습니다.');
                    return;
                }
            }

            OverlayModule.startListener();
            Alert.alert('서비스 시작', '화면 켜짐 감지 서비스가 시작되었습니다.');
            navigation.replace('MainApp'); // 권한 승인 후 이동
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>앱 사용을 위해 권한이 필요합니다</Text>
            <Text style={styles.description}>
                알림 권한을 허용하면 화면 켜짐 감지 서비스가 정상적으로 동작합니다.
            </Text>
            <Button title="권한 허용 및 서비스 시작" onPress={requestPermissions} />
            <View style={styles.space} />
            <Button title="홈 화면으로 넘어가기" onPress={goToHome} />
        </View>


    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    space: { height: 15 },
});