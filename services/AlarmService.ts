import notifee, { TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from 'react-native';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

export const scheduleAlarm = async (alarmData: any) => {
  console.log('[scheduleAlarm] Scheduling alarm with data:', alarmData);

  const channelId = await notifee.createChannel({
    id: 'wakeup-alarm',
    name: 'Wakeup Alarms',
    sound: 'default',
    importance: 4, // AndroidImportance.HIGH
  });

  const pickerHour = parseInt(alarmData.time.split(':')[0], 10);
  const pickerMinute = parseInt(alarmData.time.split(':')[1], 10);
  let hour24 = pickerHour;
  if (alarmData.period === '오후' && pickerHour !== 12) {
    hour24 += 12;
  } else if (alarmData.period === '오전' && pickerHour === 12) {
    hour24 = 0;
  }

  if (alarmData.days.length === 0) {
    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(hour24, pickerMinute, 0, 0);

    if (triggerDate.getTime() <= now.getTime()) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
    };

    const notificationId = uuidv4();
    console.log(`[scheduleAlarm] Scheduling one-time alarm. Notification ID: ${notificationId}`);

    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: alarmData.name,
        body: '알람을 끄고 새로운 하루를 시작하세요!',
        android: { 
          channelId, 
          loopSound: true, 
          pressAction: { id: 'default', launchActivity: 'com.wakeupoverlay.AlarmRingingActivity' },
          fullScreenAction: { id: 'default', launchActivity: 'com.wakeupoverlay.AlarmRingingActivity' } 
        },
      },
      trigger,
    );
    console.log(`[scheduleAlarm] One-time alarm scheduled for ${triggerDate.toString()}`);
    return;
  }

  console.log(`[scheduleAlarm] Scheduling weekly alarms for days: ${alarmData.days.join(', ')}`);
  for (const dayName of alarmData.days) {
    const dayIndex = daysKor.indexOf(dayName);
    if (dayIndex === -1) continue;

    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(hour24, pickerMinute, 0, 0);

    const currentDay = now.getDay();
    let dayDifference = dayIndex - currentDay;
    if (dayDifference < 0 || (dayDifference === 0 && triggerDate.getTime() <= now.getTime())) {
      dayDifference += 7;
    }
    triggerDate.setDate(now.getDate() + dayDifference);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    };

    const notificationId = uuidv4();
    console.log(`[scheduleAlarm] Scheduling weekly alarm for ${dayName}. Notification ID: ${notificationId}`);

    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: alarmData.name,
        body: `매주 ${dayName}요일 알람입니다!`,
        android: { 
          channelId, 
          loopSound: true, 
          pressAction: { id: 'default', launchActivity: 'com.wakeupoverlay.AlarmRingingActivity' },
          fullScreenAction: { id: 'default', launchActivity: 'com.wakeupoverlay.AlarmRingingActivity' } 
        },
      },
      trigger,
    );
    console.log(`[scheduleAlarm] Weekly alarm for ${dayName} scheduled for ${triggerDate.toString()}`);
  }
};