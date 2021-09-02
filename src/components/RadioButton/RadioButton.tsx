import * as React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useRadio } from './RadioButtonGroup'

interface RadioButtonProps {
  /**
   * value of radio button
   */
  value: string
  status?: 'checked' | 'unchecked'
  disabled?: boolean
  onPress?: () => void
  /**
   * color of outer circle
   */
  color?: string
  /**
   * unchecked color
   */
  uncheckedColor?: string
}

export default function RadioButton({
  status,
  onPress,
  disabled,
  uncheckedColor,
  color,
  value,
}: RadioButtonProps) {
  const context = useRadio()
  if (!status && context) {
    status = context.value === value ? 'checked' : 'unchecked'
  }
  if (context) {
    onPress = () => context.onValueChange(value)
  }
  const scale = useSharedValue(status === 'checked' ? 0.6 : 1)
  React.useEffect(() => {
    if (status === 'checked') {
      scale.value = withTiming(0.6, { duration: 200 })
    } else {
      scale.value = withTiming(1)
    }
  }, [status, scale])

  const innerCircleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }))
  const backgroundColor =
    (status === 'checked' ? color : uncheckedColor) || '#000'

  return (
    <Pressable
      style={[styles.outer, { backgroundColor }]}
      onPress={!disabled ? onPress : undefined}
    >
      <Animated.View style={[innerCircleStyle, styles.inner]}></Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  outer: {
    width: 100,
    height: 100,
    backgroundColor: '#000',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 100,
    position: 'absolute',
  },
})
