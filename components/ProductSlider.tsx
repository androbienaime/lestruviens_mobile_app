import { useThemeColors } from '@/theme';
import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Modal,
  StatusBar,
  SafeAreaView,
  Text,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PinchGestureHandler,
  TapGestureHandler,
  PanGestureHandler,
  State,
  GestureHandlerRootView,
  GestureEvent,
  HandlerStateChangeEvent,
  PinchGestureHandlerEventPayload,
  PanGestureHandlerEventPayload,
  TapGestureHandlerStateChangeEvent
} from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const carouselWidth = screenWidth;

const MAX_ZOOM = 4;
const MIN_ZOOM = 1;
const DOUBLE_TAP_ZOOM = 2;

type Props = {
  horizontalMargin?: number;
  marginVertical?: number;
  images: string[];
  height?: number;
  scrollAnimation?: number;
  autoplay?: boolean;
  style?: ViewStyle;
};

const ProductSlider = ({
  horizontalMargin = 0,
  marginVertical = 20,
  images = [],
  height = 180,
  scrollAnimation = 800,
  autoplay = true,
  style,
  ...otherProps
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [carouselEnabled, setCarouselEnabled] = useState(true);
  const colors = useThemeColors();
  
  // Référence au carrousel en plein écran
  const fullscreenCarouselRef = useRef(null);

  const doubleTapRef = useRef(null);
  const singleTapRef = useRef(null);
  const panRef = useRef(null);
  const pinchRef = useRef(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenVisible(true);
    resetZoom();
  };

  const closeFullscreen = () => {
    setFullscreenVisible(false);
  };

  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
  };

  const handleFullscreenSnapToItem = useCallback((index: number) => {
    console.log("SNAPPED TO:", index);
    setFullscreenIndex(index);
    resetZoom();
  }, []);

  const resetZoom = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    setCarouselEnabled(true);
  };

  const isZoomed = () => {
    return scale.value > 1.01;
  };

  const updateCarouselState = () => {
    setCarouselEnabled(scale.value <= 1.01);
  };

  const onDoubleTap = ({ nativeEvent }: { nativeEvent: { state: number } }) => {
    if (nativeEvent.state === State.ACTIVE) {
      if (isZoomed()) {
        resetZoom();
      } else {
        scale.value = withSpring(DOUBLE_TAP_ZOOM);
        savedScale.value = DOUBLE_TAP_ZOOM;
        runOnJS(updateCarouselState)();
      }
    }
  };

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleSingleTap = ({ nativeEvent }: TapGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.END) {
      closeFullscreen();
    }
  };

  const handlePinch = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
    const newScale = savedScale.value * event.nativeEvent.scale;
    if (newScale >= MIN_ZOOM && newScale <= MAX_ZOOM) {
      scale.value = newScale;
      runOnJS(updateCarouselState)();
    }
  };

  const handlePinchStateChange = (event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      savedScale.value = scale.value;
      if (scale.value < MIN_ZOOM) {
        scale.value = withTiming(MIN_ZOOM);
        savedScale.value = MIN_ZOOM;
      } else if (scale.value > MAX_ZOOM) {
        scale.value = withTiming(MAX_ZOOM);
        savedScale.value = MAX_ZOOM;
      }
      runOnJS(updateCarouselState)();
    }
  };

  const handlePan = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (isZoomed()) {
      const limitX = (scale.value - 1) * screenWidth / 2;
      const limitY = (scale.value - 1) * (screenHeight * 0.8) / 2;
      let newX = savedTranslateX.value + event.nativeEvent.translationX;
      let newY = savedTranslateY.value + event.nativeEvent.translationY;
      newX = Math.max(-limitX, Math.min(newX, limitX));
      newY = Math.max(-limitY, Math.min(newY, limitY));
      translateX.value = newX;
      translateY.value = newY;
    }
  };

  const handlePanStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    }
  };

  return (
    <View style={[{ marginVertical }, style]}>
      <Carousel
        width={carouselWidth - horizontalMargin * 2}
        height={height}
        autoPlay={autoplay}
        data={images}
        autoPlayInterval={scrollAnimation}
        loop
        pagingEnabled
        onSnapToItem={handleSnapToItem}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            activeOpacity={0.9}
            onPress={() => openFullscreen(index)}
          >
            <Image
              defaultSource={require('@/assets/images/placeholder-image.png')}
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => setActiveIndex(index)}>
            <View
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="fade"
        onRequestClose={closeFullscreen}
      >
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <SafeAreaView style={styles.fullscreenContainer}>
          <GestureHandlerRootView style={styles.backdrop}>
            <TouchableOpacity style={styles.closeButton} onPress={closeFullscreen}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Carousel
              ref={fullscreenCarouselRef}
              width={screenWidth}
              height={screenHeight * 0.8}
              autoPlay={false}
              data={images}
              loop={false}
              defaultIndex={fullscreenIndex}
              pagingEnabled
              enabled={carouselEnabled}
              overscrollEnabled={carouselEnabled}
              onSnapToItem={handleFullscreenSnapToItem}
              renderItem={({ item }) => (
                <View style={styles.fullscreenImageContainer}>
                  <PinchGestureHandler
                    ref={pinchRef}
                    onGestureEvent={handlePinch}
                    onHandlerStateChange={handlePinchStateChange}
                    simultaneousHandlers={[panRef, doubleTapRef]}
                  >
                    <Animated.View style={styles.gestureContainer}>
                      <PanGestureHandler
                        ref={panRef}
                        onGestureEvent={handlePan}
                        onHandlerStateChange={handlePanStateChange}
                        simultaneousHandlers={[pinchRef, doubleTapRef]}
                        avgTouches
                        enabled={isZoomed()}
                      >
                        <Animated.View style={styles.gestureContainer}>
                          {/* <TapGestureHandler
                            ref={doubleTapRef}
                            numberOfTaps={2}
                            onHandlerStateChange={onDoubleTap}
                          > */}
                            <Animated.View style={styles.gestureContainer}>
                              <TouchableOpacity
                                // ref={singleTapRef}
                                // waitFor={doubleTapRef}
                                // numberOfTaps={2}
                                // onHandlerStateChange={onDoubleTap}
                                activeOpacity={1}
                                onPress={() => setFullscreenVisible(false)}
                              >
                                <Animated.View style={styles.fullscreenImageWrapper}>
                                  <Animated.Image
                                    source={{ uri: item }}
                                    style={[styles.fullscreenImage, animatedImageStyle]}
                                    resizeMode="contain"
                                  />
                                </Animated.View>
                              </TouchableOpacity>
                            </Animated.View>
                          {/* </TapGestureHandler> */}
                        </Animated.View>
                      </PanGestureHandler>
                    </Animated.View>
                  </PinchGestureHandler>
                </View>
              )}
            />
          </GestureHandlerRootView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ProductSlider;

const createStyles = (colors: any) => StyleSheet.create({
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.button.secondary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotInactive: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  backdrop: {
    flex: 1,
    margin: 0,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullscreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gestureContainer: {
    width: '100%',
    height: '100%',
  },
  fullscreenImageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
    textAlign: 'center',
  },
  zoomInstructions: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 10,
  },
  zoomInstructionsText: {
    color: '#fff',
    fontSize: 12,
  }
});