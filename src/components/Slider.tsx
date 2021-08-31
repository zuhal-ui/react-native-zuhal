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

// OldRange = (OldMax - OldMin)
// NewRange = (NewMax - NewMin)
// NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin

const _Slider = ({
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  onSlidingStart,
  onSlidingComplete,
  value: initialValue = minimumValue || 0,
  step = 0.1,
  ...props
}: Props) => {
  // convert to 0 - SLIDER_WIDTH range to know actual position of track
  const calculatedValue = React.useMemo(
    () =>
      findNumberInAnotherRange(
        [minimumValue, maximumValue],
        [CONSTANT_MINIMUM_VALUE, CONSTANT_MAXIMUM_VALUE],
        initialValue
      ),
    [initialValue, minimumValue, maximumValue]
  )
  const _step = React.useMemo(
    () =>
      findNumberInAnotherRange(
        [minimumValue, maximumValue],
        [CONSTANT_MINIMUM_VALUE, CONSTANT_MAXIMUM_VALUE],
        minimumValue + step
      ),
    [step, minimumValue, maximumValue]
  )
  const x = useSharedValue<number>(calculatedValue)
  const pressed = useSharedValue(false)

  const _onValueChange = (value: number) => {
    onValueChange?.(
      findNumberInAnotherRange(
        [CONSTANT_MINIMUM_VALUE, CONSTANT_MAXIMUM_VALUE],
        [minimumValue, maximumValue],
        value
      )
    )
  }

  const eventHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: CTX) => {
      pressed.value = true
      ctx.startX = x.value
      if (onSlidingStart)
        runOnJS(onSlidingStart)(
          findNumberInAnotherRange(
            [CONSTANT_MINIMUM_VALUE, CONSTANT_MAXIMUM_VALUE],
            [minimumValue, maximumValue],
            x.value
          )
        )
    },

    // 3.4
    onActive: (e, ctx) => {
      let value = ctx.startX + e.translationX
      let valueWithStep = Math.ceil(value / _step) * _step
      if (
        valueWithStep <= SLIDER_WIDTH - TRACK_DIMENSION &&
        valueWithStep >= 0
      ) {
        x.value = valueWithStep
      } else if (valueWithStep >= SLIDER_WIDTH - TRACK_DIMENSION) {
        x.value = SLIDER_WIDTH - TRACK_DIMENSION
      } else if (valueWithStep <= 0) {
        x.value = 0
      }
      runOnJS(_onValueChange)(x.value)
    },
    onEnd: () => {
      pressed.value = false
      if (onSlidingComplete)
        runOnJS(onSlidingComplete)(
          findNumberInAnotherRange(
            [CONSTANT_MINIMUM_VALUE, CONSTANT_MAXIMUM_VALUE],
            [minimumValue, maximumValue],
            x.value
          )
        )
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

function findNumberInAnotherRange(
  oldRange: [number, number],
  newRange: [number, number],
  number: number
) {
  let oldRangeDif = oldRange[1] - oldRange[0]
  let newRangeDif = newRange[1] - newRange[0]
  let newValue = ((number - oldRange[0]) * newRangeDif) / oldRangeDif + 0
  return newValue
}

export const Slider = React.memo(_Slider)

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
