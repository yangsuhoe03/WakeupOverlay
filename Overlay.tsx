import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, NativeModules, FlatList, Dimensions, View, ViewToken } from 'react-native';
import { WebView } from 'react-native-webview';

const { OverlayModule } = NativeModules;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 표시할 YouTube 동영상 ID 목록
const YOUTUBE_VIDEO_IDS = ['7reNO-Uk4eM', 'saKCaf6f5tk', '8pbGLcHEGos'];

interface YoutubePlayerProps {
  videoId: string;
  isVisible: boolean;
  onVideoEnd: (isLastVideo: boolean) => void;
  isLastVideo: boolean;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videoId, isVisible, onVideoEnd, isLastVideo }) => {
  const webViewRef = useRef<WebView>(null);
  const html = `
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
                videoId: '${videoId}',
                playerVars: {
                    'autoplay': ${isVisible ? 1 : 0},
                    'controls': 0,
                    'rel': 0,
                    'showinfo': 0,
                    'fs': 0,
                    'playsinline': 1,
                    'modestbranding': 1
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady(event) {
            if (${isVisible}) {
                event.target.playVideo();
            }
        }

        function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.ENDED) {
                window.ReactNativeWebView.postMessage('ended');
            }
        }

        // React Native로부터 메시지를 수신하여 동영상 재생/정지
        window.addEventListener('message', function(event) {
            if (event.data === 'play') {
                player.playVideo();
            } else if (event.data === 'pause') {
                player.pauseVideo();
            }
        });
    </script>
    </body>
    </html>
  `;

  const onMessage = (event: any) => {
    if (event.nativeEvent.data === 'ended') {
      onVideoEnd(isLastVideo);
    }
  };

  // isVisible prop이 변경될 때 동영상 재생/정지
  React.useEffect(() => {
    if (webViewRef.current) {
      if (isVisible) {
        webViewRef.current.postMessage('play');
      } else {
        webViewRef.current.postMessage('pause');
      }
    }
  }, [isVisible]);

  return (
      <WebView
          ref={webViewRef}
          style={styles.fullscreen}
          source={{ html }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          onMessage={onMessage}
          scrollEnabled={false}
      />
  );
};


const OverlayContent = () => {
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0);

  const handleVideoEnd = (isLastVideo: boolean) => {
    if (isLastVideo) {
      OverlayModule.closeYoutubeOverlay();
    } else {
      // 다음 동영상으로 스크롤 (옵션)
      // flatListRef.current?.scrollToIndex({ index: visibleVideoIndex + 1 });
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setVisibleVideoIndex(viewableItems[0].index as number);
    }
  }, []);

  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={YOUTUBE_VIDEO_IDS}
        renderItem={({ item, index }) => (
          <View style={{ width: screenWidth, height: screenHeight }}>
            <YoutubePlayer
              videoId={item}
              isVisible={index === visibleVideoIndex}
              onVideoEnd={handleVideoEnd}
              isLastVideo={index === YOUTUBE_VIDEO_IDS.length - 1}
            />
          </View>
        )}
        keyExtractor={(item) => item}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullscreen: {
    width: screenWidth,
    height: screenHeight,
  },
});

export default OverlayContent;
