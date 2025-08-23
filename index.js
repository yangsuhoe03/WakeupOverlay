import 'react-native-get-random-values';

/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import OverlayContent from './Overlay'; // 오버레이 컴포넌트 임포트
import AlarmRingingScreen from './screens/AlarmRingingScreen'; // 알람 울림 화면 컴포넌트 임포트
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';

// Notifee 백그라운드 이벤트 핸들러 (라이브러리 요구사항)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Log the event
  console.log('[Notifee Background Event]', 'Type:', type, 'Detail:', JSON.stringify(detail, null, 2));

  if (notification) {
    console.log('[Notifee Background Event] Notification with ID', notification.id, 'processed.');
  }
});

// 메인 앱 등록
AppRegistry.registerComponent(appName, () => App);

// 오버레이용 컴포넌트 등록
AppRegistry.registerComponent('Overlay', () => OverlayContent);

// Wrapper component to ensure props are passed down to the AlarmRingingScreen
const AlarmRingingScreenWithProps = (props) => {
  return <AlarmRingingScreen {...props} />;
};

// 알람 울림용 컴포넌트 등록
AppRegistry.registerComponent('AlarmRinging', () => AlarmRingingScreenWithProps);
