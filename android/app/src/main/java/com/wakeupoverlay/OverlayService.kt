package com.wakeupoverlay

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.WindowManager
import android.widget.VideoView

class OverlayService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var overlayView: android.view.View
    private lateinit var videoView: VideoView

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            // 권한이 없는 경우, 서비스 중지. 권한 요청은 Activity에서 처리해야 함.
            stopSelf()
            return
        }

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val inflater = getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
        overlayView = inflater.inflate(R.layout.overlay_layout, null)
        videoView = overlayView.findViewById(R.id.videoView)

        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or // 잠금화면 위에 표시
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or // 잠금 해제
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON, // 화면 켜기
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.CENTER

        windowManager.addView(overlayView, params)

        val videoPath = "android.resource://" + packageName + "/" + R.raw.sample
        val uri = Uri.parse(videoPath)
        videoView.setVideoURI(uri)
        videoView.setOnCompletionListener {
            // 영상 재생이 끝나면 서비스를 중지하고 오버레이를 제거
            stopSelf()
        }
        videoView.start()
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::overlayView.isInitialized) {
            windowManager.removeView(overlayView)
        }
    }
}
