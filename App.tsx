import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  NativeModules,
  TextInput,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import AppNavigator from './navigation/AppNavigator';

const {OverlayModule} = NativeModules;

type RootStackParamList = {
  Setup: undefined;
  Main: undefined;
};

type SetupScreenProps = NativeStackScreenProps<RootStackParamList, 'Setup'>;

function SetupScreen({navigation}: SetupScreenProps): React.JSX.Element {
  const [initialHour, setInitialHour] = useState<number | null>(null);
  const [initialMinute, setInitialMinute] = useState<number | null>(null);

  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  useEffect(() => {
    // 네이티브 모듈에서 저장된 시간을 불러옵니다.
    OverlayModule.getTime().then((time: {hour: number; minute: number}) => {
      setInitialHour(time.hour);
      setInitialMinute(time.minute);
      setHour(String(time.hour));
      setMinute(String(time.minute));
    });
  }, []);

  const handleSaveTime = () => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      Alert.alert('입력 오류', '시간은 0-23, 분은 0-59 사이로 입력해주세요.');
      return;
    }

    OverlayModule.saveTime(h, m);
    setInitialHour(h);
    setInitialMinute(m);
    Alert.alert('저장 완료', `알람 시간이 ${h}시 ${m}분으로 저장되었습니다.`);
  };

  const requestPermissionsAndStart = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'WakeupOverlay 알림 권한',
            message:
              '포그라운드 서비스를 실행하고 상태를 표시하기 위해 알림 권한이 필요합니다.',
            buttonPositive: '확인',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            '권한 거부',
            '알림 권한이 없어 서비스를 시작할 수 없습니다.',
          );
          return;
        }
      }
      OverlayModule.startListener();
      Alert.alert('서비스 시작', '화면 켜짐 감지 서비스가 시작되었습니다.');
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.content}>
        <Text style={styles.title}>Wakeup Overlay 설정</Text>

        <View style={styles.timeSettingContainer}>
          <Text style={styles.settingTitle}>알람 시간 설정</Text>
          {initialHour !== null ? (
            <Text style={styles.currentTimeText}>
              현재 설정된 시간: {String(initialHour).padStart(2, '0')}:{
                String(initialMinute).padStart(2, '0')
              }
            </Text>
          ) : (
            <Text style={styles.currentTimeText}>저장된 시간이 없습니다.</Text>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={hour}
              onChangeText={setHour}
              placeholder="시간 (0-23)"
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              style={styles.input}
              value={minute}
              onChangeText={setMinute}
              placeholder="분 (0-59)"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <Button title="시간 저장" onPress={handleSaveTime} />
        </View>

        <View style={styles.serviceControlContainer}>
          <Button
            title="감지 서비스 시작"
            onPress={requestPermissionsAndStart}
          />
          <View style={styles.space} />
          <Button
            title="감지 서비스 중지"
            onPress={() => OverlayModule.stopListener()}
            color="#FF6347"
          />
        </View>
        <View style={styles.space} />
        <Button title="홈으로 이동" onPress={() => navigation.navigate('Main')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  timeSettingContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  currentTimeText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    width: 80,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
  },
  colon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  serviceControlContainer: {
    width: '80%',
    marginBottom: 30,
  },
  space: {
    height: 15,
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Setup">
        <Stack.Screen
          name="Setup"
          component={SetupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={AppNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;