package com.wakeupoverlay

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class OverlayModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "OverlayModule"
    }

    @ReactMethod
    fun startOverlay() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactApplicationContext)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + reactApplicationContext.packageName)
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            return
        }

        val serviceIntent = Intent(reactApplicationContext, OverlayService::class.java)
        reactApplicationContext.startService(serviceIntent)
    }

    @ReactMethod
    fun stopOverlay() {
        val serviceIntent = Intent(reactApplicationContext, OverlayService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }
}
