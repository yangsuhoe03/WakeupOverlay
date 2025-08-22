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
    fun closeYoutubeOverlay() {
        val intent = Intent("com.wakeupoverlay.CLOSE_OVERLAY_ACTIVITY")
        reactApplicationContext.sendBroadcast(intent)
    }

    @ReactMethod
    fun closeAlarmRingingOverlay() {
        val intent = Intent("com.wakeupoverlay.CLOSE_ALARM_RINGING_ACTIVITY")
        reactApplicationContext.sendBroadcast(intent)
    }

    @ReactMethod
    fun showOverlay() {
        val context = currentActivity
        if (context != null) {
            val intent = Intent(context, OverlayActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } else {
            Log.e("OverlayModule", "Could not get current activity to show overlay.")
        }
    }
}
