package com.wakeupoverlay

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class AlarmRingingActivity : ReactActivity() {

  private val TAG = "AlarmRingingActivity"

  private val closeReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == "com.wakeupoverlay.CLOSE_ALARM_RINGING_ACTIVITY") {
            Log.d(TAG, "Close broadcast received, finishing activity.")
            finish()
        }
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    Log.d(TAG, "onCreate: Activity starting.")

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        registerReceiver(closeReceiver, IntentFilter("com.wakeupoverlay.CLOSE_ALARM_RINGING_ACTIVITY"), RECEIVER_EXPORTED)
    } else {
        registerReceiver(closeReceiver, IntentFilter("com.wakeupoverlay.CLOSE_ALARM_RINGING_ACTIVITY"))
    }
    Log.d(TAG, "onCreate: Broadcast receiver registered.")

    // 화면을 켜고 잠금화면 위에 표시하도록 설정
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
        setShowWhenLocked(true)
        setTurnScreenOn(true)
        Log.d(TAG, "onCreate: Flags set for modern Android (setShowWhenLocked, setTurnScreenOn).")
    } else {
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
        )
        Log.d(TAG, "onCreate: Flags set for older Android (FLAG_SHOW_WHEN_LOCKED, etc.).")
    }
  }

  override fun onDestroy() {
      super.onDestroy()
      unregisterReceiver(closeReceiver)
      Log.d(TAG, "onDestroy: Activity destroyed and receiver unregistered.")
  }

  override fun getMainComponentName(): String = "AlarmRinging"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
      override fun getLaunchOptions(): Bundle? {
        val bundle = Bundle()
        val notification = intent.getBundleExtra("notifee_notification")

        // Log all extras in the intent
        val extras = intent.extras
        if (extras != null) {
            for (key in extras.keySet()) {
                val value = extras.get(key)
                Log.d(TAG, "Intent extra: $key = $value")
            }
        } else {
            Log.d(TAG, "Intent has no extras.")
        }

        if (notification != null) {
            Log.d(TAG, "Found 'notifee_notification' bundle.")
            val notificationId = notification.getString("id")
            bundle.putString("notificationId", notificationId)
            Log.d(TAG, "Passing notificationId to React Native: $notificationId")
        } else {
            Log.w(TAG, "'notifee_notification' bundle not found in intent.")
        }
        return bundle
      }
    }
  }
}
