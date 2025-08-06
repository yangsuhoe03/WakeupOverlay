import React from 'react';
import { View, Button, NativeModules, StyleSheet, Modal } from 'react-native';
import { WebView} from 'react-native-webview';
import { useState } from 'react';


const youtubeIframeHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background-color: black;
        }
        #player {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }
      </style>
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
            videoId: '2HNvSIQl3vg',
            playerVars: {
              autoplay: 1,
              playsinline: 1,
              rel: 0,
              modestbranding: 1,
              mute: 1
            },
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange
              }
            }
          });
        }
        function onPlayerReady(event) {
          event.target.playVideo();
          event.target.unMute();
        }

        function onPlayerStateChange(event) {
          // 여기에 상태변화 로직 추가 가능
        } 
      </script>
    </head>
    <body>
      <div id="player"></div>
    </body>
  </html>
`;
;



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
