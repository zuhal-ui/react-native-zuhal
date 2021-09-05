import React, { useCallback, useRef, useState } from 'react'
import { Pressable, StyleSheet, PressableProps } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import { space14, space1 } from '../styles/spacing'
import { neutral100 } from '../styles/colors'

const AnimatedComponent = Animated.createAnimatedComponent(Pressable)
const TouchableRipple = ({ children, ...rest }: PressableProps) => {
  const [status, setStatus] = useState('idle')
  const flag = useRef('idle')
  const animatedValue = useSharedValue(0.1)

  const updateState = useCallback(
    (isFinished: boolean) => {
      if (isFinished) {
        setStatus('idle')
        setTimeout(() => {
          animatedValue.value = 0.1
          flag.current = 'idle'
        }, 25)
      }
    },
    [animatedValue]
  )

  const Animation = (callback: (isFinished: boolean) => void) => {
    return withTiming(
      0,
      {
        duration: 500,
        easing: Easing.linear,
      },
      callback
    )
  }

  const pressOut = useCallback(() => {
    if (flag?.current === 'leaved') {
      return
    } else {
      setStatus('leaved')
      flag.current = 'leaved'
      animatedValue.value = Animation((isFinished: boolean) => {
        'worklet'
        runOnJS(updateState)(isFinished)
      })
    }
  }, [animatedValue, updateState])

  const pressIn = useCallback(() => {
    if (flag?.current === 'idle') {
      setStatus('pressed')
      flag.current = 'pressed'
    } else {
      return
    }
  }, [])

  const container = useAnimatedStyle(() => {
    return {
      borderColor: status === 'leaved' ? neutral100 : 'rgba(0, 0, 0, 0)',
      backgroundColor:
        status === 'idle'
          ? 'rgba(0, 0, 0, 0)'
          : status === 'pressed'
          ? 'rgba(0, 0, 0, 0.1)'
          : `rgba(0, 0, 0, ${animatedValue.value})`,
    }
  })

  return (
    <AnimatedComponent
      {...rest}
      style={[style.container, container]}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      {children}
    </AnimatedComponent>
  )
}

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: space14,
    borderWidth: space1,
    borderRadius: 100,
  },
})

export { TouchableRipple }
