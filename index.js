/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import OverlayContent from './Overlay'; // 오버레이 컴포넌트 임포트
import AlarmRingingScreen from './screens/AlarmRingingScreen'; // 알람 울림 화면 컴포넌트 임포트
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';

// Notifee 백그라운드 이벤트 핸들러 (라이브러리 요구사항)
notifee.onBackgroundEvent(async (event) => {
  // 이 앱의 로직에서는 특별한 처리가 필요 없지만,
  // 핸들러 자체는 등록되어 있어야 합니다.
});

// 메인 앱 등록
AppRegistry.registerComponent(appName, () => App);

// 오버레이용 컴포넌트 등록
AppRegistry.registerComponent('Overlay', () => OverlayContent);

// 알람 울림용 컴포넌트 등록
AppRegistry.registerComponent('AlarmRinging', () => AlarmRingingScreen);
