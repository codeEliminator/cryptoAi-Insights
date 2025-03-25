import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Animated, 
  PanResponder, 
  Dimensions, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BrowserViewProps {
  link: string;
  showWebView: boolean;
  setShowWebView: (view: boolean) => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ link, showWebView, setShowWebView }) => {
  const screenHeight = Dimensions.get('window').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const injectedJavaScript = `
    (function() {
      function blockAutoplayVideos() {
        const videos = document.querySelectorAll('video');
        const audios = document.querySelectorAll('audio');
        const iframes = document.querySelectorAll('iframe');
        
        videos.forEach(video => {
          video.autoplay = false;
          video.pause();
        });
        
        audios.forEach(audio => {
          audio.autoplay = false;
          audio.pause();
        });
        
        iframes.forEach(iframe => {
          try {
            // Try to add sandbox attribute to prevent scripts
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');
            // Try to set src to about:blank if from YouTube, Vimeo, etc.
            if (iframe.src.includes('youtube') || iframe.src.includes('vimeo')) {
              iframe.setAttribute('data-original-src', iframe.src);
              iframe.setAttribute('src', 'about:blank');
            }
          } catch (e) {
            console.log('Failed to modify iframe');
          }
        });
      }
      
      blockAutoplayVideos();
      
      const observer = new MutationObserver(() => {
        blockAutoplayVideos();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      true;
    })();
  `;

  useEffect(() => {
    if (showWebView) {
      panY.setValue(screenHeight);
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      panY.setValue(screenHeight);
    }
  }, [showWebView]);

  const resetPositionAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = () => {
    resetPositionAnim.start(() => {
      setShowWebView(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        panY.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeAnim();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  if (!showWebView) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ translateY }] }
        ]}
      >
        <View 
          style={styles.dragHandle} 
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBar} />
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={closeAnim}>
            <Ionicons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {link.replace(/^https?:\/\//, '')}
          </Text>
        </View>
        <WebView
          source={{ uri: link }}
          style={styles.webview}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
          mediaPlaybackRequiresUserAction={true}
          allowsInlineMediaPlayback={false}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  dragHandle: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D3D3D3',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    marginLeft: 15,
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  webview: {
    flex: 1,
  },
});

export default BrowserView;