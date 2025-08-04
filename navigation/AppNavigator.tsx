import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
/*
import IntroScreen from '../screens/IntroScreen';
import TopicSelectionScreen from '../screens/TopicSelectionScreen';
import AlarmSettingScreen from '../screens/AlarmSettingScreen';
import AlarmRingingScreen from '../screens/AlarmRingingScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import StatsScreen from '../screens/StatsScreen';
*/
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            
            {/* <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="TopicSelection" component={TopicSelectionScreen} />
            <Stack.Screen name="AlarmSetting" component={AlarmSettingScreen} />
            <Stack.Screen name="AlarmRinging" component={AlarmRingingScreen} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} /> */}
            
        </Stack.Navigator>
    );
}