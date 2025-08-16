package com.wakeupoverlay

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import android.content.pm.ServiceInfo
import java.util.Calendar


class WakeupListenerService : Service() {

    private val CHANNEL_ID = "WakeupListenerChannel"
    private val TAG = "WakeupListenerService"

    private val screenStateReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == Intent.ACTION_SCREEN_ON) {
                Log.d(TAG, "Screen ON event received.")

                // --- 시간 확인 로직 시작 ---
                val calendar = Calendar.getInstance()
                val currentHour = calendar.get(Calendar.HOUR_OF_DAY) // 24시간 형식
                val currentMinute = calendar.get(Calendar.MINUTE)

                // SharedPreferences에서 저장된 시간 불러오기
                val prefs = context?.getSharedPreferences("TimeSettings", Context.MODE_PRIVATE)
                // 저장된 값이 없으면 기본값으로 8시 30분을 사용
                val targetHour = prefs?.getInt("hour", 8) ?: 8
                val targetMinute = prefs?.getInt("minute", 30) ?: 30

                Log.d(TAG, "Current time: $currentHour:$currentMinute, Target time: $targetHour:$targetMinute")

                // 현재 시간이 목표 시간 이후인지 확인
                if (currentHour > targetHour || (currentHour == targetHour && currentMinute >= targetMinute)) {
                    Log.d(TAG, "Time condition met. Starting overlay.")
                    val overlayIntent = Intent(context, OverlayActivity::class.java)
                    overlayIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context?.startActivity(overlayIntent)
                } else {
                    Log.d(TAG, "Time condition not met. Not starting overlay.")
                }
                // --- 시간 확인 로직 끝 ---
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        val notification = createNotification()
        ServiceCompat.startForeground(
            this,
            1,
            notification,
            ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
    )

        val filter = IntentFilter(Intent.ACTION_SCREEN_ON)
        registerReceiver(screenStateReceiver, filter)
        Log.d(TAG, "Service created and screen receiver registered.")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 서비스가 시스템에 의해 종료될 경우, 재시작되도록 설정
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy: Service is being destroyed.")
        unregisterReceiver(screenStateReceiver)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Wakeup Listener Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("WakeupOverlay")
            .setContentText("화면 켜짐을 감지하고 있습니다.")
            .setSmallIcon(android.R.drawable.ic_dialog_info) // 안드로이드 기본 정보 아이콘으로 변경
            .build()
    }
}
