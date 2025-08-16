package com.wakeupoverlay

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

class OverlayModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "OverlayModule"
    }

    @ReactMethod
    fun saveTime(hour: Int, minute: Int) {
        Log.d("OverlayModule", "Saving time: $hour:$minute")
        val sharedPref = reactApplicationContext.getSharedPreferences("TimeSettings", Context.MODE_PRIVATE) ?: return
        with (sharedPref.edit()) {
            putInt("hour", hour)
            putInt("minute", minute)
            apply()
        }
    }

    @ReactMethod
    fun getTime(promise: Promise) {
        val sharedPref = reactApplicationContext.getSharedPreferences("TimeSettings", Context.MODE_PRIVATE)
        val hour = sharedPref.getInt("hour", 8) // Default 8
        val minute = sharedPref.getInt("minute", 30) // Default 30
        val map = WritableNativeMap()
        map.putInt("hour", hour)
        map.putInt("minute", minute)
        promise.resolve(map)
    }

    @ReactMethod
    fun startListener() { // 이름 변경: startOverlay -> startListener
        Log.d("OverlayModule", "startListener called")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactApplicationContext)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + reactApplicationContext.packageName)
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            return
        }

        val serviceIntent = Intent(reactApplicationContext, WakeupListenerService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(serviceIntent)
        } else {
            reactApplicationContext.startService(serviceIntent)
        }
    }

    @ReactMethod
    fun stopListener() { // 이름 변경: stopOverlay -> stopListener
        Log.d("OverlayModule", "stopListener called")
        val serviceIntent = Intent(reactApplicationContext, WakeupListenerService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }

    @ReactMethod
    fun stopOverlay() { // 오버레이만 닫는 기능은 유지
        val intent = Intent("com.wakeupoverlay.CLOSE_OVERLAY_ACTIVITY")
        reactApplicationContext.sendBroadcast(intent)
    }
}
