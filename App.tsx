import React from 'react';
import { View, Button, NativeModules, StyleSheet, Modal } from 'react-native';
import { WebView} from 'react-native-webview';
import { useState } from 'react';


const youtubeIframeHTML = `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; overflow:hidden;">
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
            videoId: 'dQw4w9WgXcQ', // 기본으로 보여줄 영상 ID
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
          // 원하는 동작 넣을 수 있음
        }
      </script>
    </body>
  </html>
`;




const { OverlayModule } = NativeModules;

const App = () => {
  const [showWebView, setShowWebView] = useState(false);

  const openYouTubeOverlay = () => {
    setShowWebView(true);
  };

  const closeYouTubeOverlay = () => {
    setShowWebView(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Start YouTube Overlww" onPress={openYouTubeOverlay} />
      <View style={styles.space} />
      <Button title="Stop Overlay" onPress={closeYouTubeOverlay} />

      <Modal visible={showWebView} animationType="slide">
        <View style={styles.modalContainer}>
          <WebView
            style={styles.fullscreen}
            source={{ html: youtubeIframeHTML }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            
          />
          <Button title="Close" onPress={closeYouTubeOverlay} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;
