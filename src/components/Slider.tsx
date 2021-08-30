import * as React from 'react'
import {
  ColorValue,
  View,
  ViewStyle,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { neutral200, neutral900 } from '../styles/colors'
interface Props {
  /**
   * Used to style and layout the `Slider`.  See `StyleSheet.js` and
   * `DeprecatedViewStylePropTypes.js` for more info.
   */
  style?: ViewStyle

  /**
   * Initial value of the slider. The value should be between minimumValue
   * and maximumValue, which default to 0 and 1 respectively.
   * Default value is 0.
   *
   * *This is not a controlled component*, you don't need to update the
   * value during dragging.
   */
  value?: number

  /**
   * Step value of the slider. The value should be
   * between 0 and (maximumValue - minimumValue).
   * Default value is 0.
   */
  step?: number

  /**
   * Initial minimum value of the slider. Default value is 0.
   */
  minimumValue?: number

  /**
   * Initial maximum value of the slider. Default value is 100.
   */
  maximumValue?: number

  /**
   * The color used for the track to the left of the button.
   * Overrides the default blue gradient image on iOS.
   */
  minimumTrackTintColor?: ColorValue

  /**
   * The color used for the track to the right of the button.
   * Overrides the default blue gradient image on iOS.
   */
  maximumTrackTintColor?: ColorValue
  /**
   * The color used to tint the default thumb images on iOS, or the
   * color of the foreground switch grip on Android.
   */
  thumbTintColor?: ColorValue
  /**
   * Assigns a single image for the track. Only static images are supported.
   * The center pixel of the image will be stretched to fill the track.
   */
  trackImage?: ImageSourcePropType

  /**
   * Assigns a minimum track image. Only static images are supported. The
   * rightmost pixel of the image will be stretched to fill the track.
   */
  minimumTrackImage?: ImageSourcePropType

  /**
   * Assigns a maximum track image. Only static images are supported. The
   * leftmost pixel of the image will be stretched to fill the track.
   */
  maximumTrackImage?: ImageSourcePropType

  /**
   * If true the user won't be able to move the slider.
   * Default value is false.
   */
  disabled?: boolean

  /**
   * Callback continuously called while the user is dragging the slider.
   */
  onValueChange?: (value: number) => void

  /**
   * Callback that is called when the user touches the slider,
   * regardless if the value has changed. The current value is passed
   * as an argument to the callback handler.
   */

  onSlidingStart?: (value: number) => void

  /**
   * Callback that is called when the user releases the slider,
   * regardless if the value has changed. The current value is passed
   * as an argument to the callback handler.
   */
  onSlidingComplete?: (value: number) => void

  /**
   * Used to locate this view in UI automation tests.
   */
  testID?: string

  /**
   * Sets an image for the thumb. Only static images are supported.
   */
  thumbImage?: ImageSourcePropType

  /**
   * If true the slider will be inverted.
   * Default value is false.
   */
  inverted?: boolean

  /**
   * A string of one or more words to be announced by the screen reader.
   * Otherwise, it will announce the value as a percentage.
   * Requires passing a value to `accessibilityIncrements` to work correctly.
   * Should be a plural word, as singular units will be handled.
   */
  accessibilityUnits?: string

  /**
   * An array of values that represent the different increments displayed
   * by the slider. All the values passed into this prop must be strings.
   * Requires passing a value to `accessibilityUnits` to work correctly.
   * The number of elements must be the same as `maximumValue`.
   */
  accessibilityIncrements?: Array<string>
}

type CTX = {
  startX: number
  startY: number
}

let SLIDER_WIDTH = 500
let TRACK_DIMENSION = 50
let CONSTANT_MINIMUM_VALUE = 0
let CONSTANT_MAXIMUM_VALUE = SLIDER_WIDTH - TRACK_DIMENSION

export const Slider = ({
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  ...props
}: Props) => {
  const x = useSharedValue<number>(0)
  const pressed = useSharedValue(false)

  const _onValueChange = (value: number) => {
    onValueChange?.(
      ((value - CONSTANT_MINIMUM_VALUE) * (maximumValue - minimumValue)) /
        (CONSTANT_MAXIMUM_VALUE - CONSTANT_MINIMUM_VALUE) +
        minimumValue
    )
  }

  const eventHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: CTX) => {
      pressed.value = true
      ctx.startX = x.value
    },
    onActive: (e, ctx) => {
      let value = ctx.startX + e.translationX
      if (value <= SLIDER_WIDTH - TRACK_DIMENSION && value >= 0) {
        x.value = value
      } else if (value >= SLIDER_WIDTH - TRACK_DIMENSION) {
        x.value = SLIDER_WIDTH - TRACK_DIMENSION
      } else if (value <= 0) {
        x.value = 0
      }
      runOnJS(_onValueChange)(x.value)
    },
    onEnd: () => {
      pressed.value = false
      // x.value = withSpring(0)
    },
  })

  const trackStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: x.value,
      },
    ],
  }))
  const lineStyle = useAnimatedStyle(() => ({
    width: x.value,
  }))
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.line} />
      <Animated.View style={[styles.lineFilled, lineStyle]} />
      <PanGestureHandler onGestureEvent={eventHandler}>
        <Animated.View style={[styles.track, trackStyle]} />
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: SLIDER_WIDTH,
    height: 40,
  },
  line: {
    backgroundColor: neutral200,
    width: SLIDER_WIDTH,
    height: '15%',
    borderRadius: 10,
  },
  lineFilled: {
    backgroundColor: neutral900,
    height: '15%',
    borderRadius: 10,
    position: 'absolute',
  },
  track: {
    borderRadius: 100,
    backgroundColor: '#fff',
    width: TRACK_DIMENSION,
    height: TRACK_DIMENSION,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
})
