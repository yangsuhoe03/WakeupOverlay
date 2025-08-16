import React, { useRef } from 'react';
import { StyleSheet, NativeModules } from 'react-native';
import { WebView } from 'react-native-webview';

const { OverlayModule } = NativeModules;

//어떤 영상 보여주는 지 알려주는 부분
//이 부분은 유튜브 영상의 ID를 넣어주면 된다.
//예시로 saKCaf6f5tk를 넣어두었다. 이 부분을 바꾸면 다른 영상을 보여준다.
//유튜브 영상 ID는 유튜브 영상 URL에서 v= 다음에 나오는 부분이다.
//예시: https://www.youtube.com/watch?v=saKCaf6f5tk 에서 saKCaf6f5tk가 영상 ID이다.
const OverlayContent = () => {
  const webViewRef = useRef<WebView>(null);

  const onMessage = (event: any) => {
    if (event.nativeEvent.data === 'ended') {
      OverlayModule.stopOverlay();
    }
  };

  const youtubeIframeHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body, #player {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: black;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div id="player"></div>
        <script>
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          var player;
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              height: '100%',
              width: '100%',
              videoId: '7reNO-Uk4eM',
              playerVars: {
                'autoplay': 1,
                'controls': 0,
                'rel': 0,
                'showinfo': 0,
                'fs': 0,
                'playsinline': 0,
                'modestbranding': 1
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
              }
            });
          }

          function onPlayerReady(event) {
            event.target.playVideo();
          }

          function onPlayerStateChange(event) {
            if (event.data === 0) { // 0: Ended
              window.ReactNativeWebView.postMessage('ended');
            }
          }
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      ref={webViewRef}
      style={styles.fullscreen}
      source={{ html: youtubeIframeHTML, baseUrl: '' }} // baseUrl 추가
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsFullscreenVideo={true}
      mediaPlaybackRequiresUserAction={false}
      onMessage={onMessage}
      originWhitelist={['*']} // 모든 출처의 postMessage를 허용합니다.
    />
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default OverlayContent;
