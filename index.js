/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import OverlayContent from './Overlay'; // 오버레이 컴포넌트 임포트
import {name as appName} from './app.json';

// 메인 앱 등록
AppRegistry.registerComponent(appName, () => App);

// 오버레이용 컴포넌트 등록
AppRegistry.registerComponent('Overlay', () => OverlayContent);
