/* eslint-disable react-native/no-inline-styles */
import * as React from 'react'
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Button } from './Button'
// import Surface from './Surface'
// import Text from './Typography/Text'
import { useTheme } from '../core/theming'

export type SnackbarProps = React.ComponentProps<any> & {
  /**
   * Whether the Snackbar is currently visible.
   */
  visible: boolean
  /**
   * Label and press callback for the action button. It should contain the following properties:
   * - `label` - Label of the action button
   * - `onPress` - Callback that is called when action button is pressed.
   */
  action?: Omit<React.ComponentProps<typeof Button>, 'children'> & {
    label: string
  }
  /**
   * The duration for which the Snackbar is shown.
   */
  duration?: number
  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void
  /**
   * Text content of the Snackbar.
   */
  children: React.ReactNode
  /**
   * Style for the wrapper of the snackbar
   */
  wrapperStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  ref?: React.RefObject<View>
  loading?: boolean
}

const DURATION_SHORT = 4000
const DURATION_MEDIUM = 7000
const DURATION_LONG = 10000

export const Snackbar = ({
  visible,
  action,
  duration = DURATION_MEDIUM,
  onDismiss,
  children,
  wrapperStyle,
  // style,
  loading,
}: // ...rest
SnackbarProps) => {
  const sharedOpacity = useSharedValue(0)
  const theme = useTheme()
  const [hidden, setHidden] = React.useState(true)
  const { colors, roundness } = theme
  const {
    style: actionStyle,
    label: actionLabel,
    onPress: onPressAction,
    ...actionProps
  } = action || {}
  const hideTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // when component unmounted
  React.useEffect(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
  }, [])

  React.useLayoutEffect(() => {
    if (visible) {
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
      setHidden(false)
      sharedOpacity.value = withTiming(1, { duration: 200 }, (isFinished) => {
        const isInfinity =
          duration === Number.POSITIVE_INFINITY ||
          duration === Number.NEGATIVE_INFINITY
        if (isFinished && !isInfinity) {
          hideTimeout.current = setTimeout(
            onDismiss,
            duration
          ) as unknown as NodeJS.Timeout
        }
      })
    } else {
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
      sharedOpacity.value = withTiming(0, { duration: 200 }, (isFinished) => {
        if (isFinished) {
          setHidden(true)
        }
      })
    }
  }, [visible, duration, onDismiss, sharedOpacity])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(sharedOpacity.value, [0, 1], [0.8, 1], {
            extrapolateLeft: Extrapolate.CLAMP,
            extrapolateRight: Extrapolate.EXTEND,
          }),
        },
      ],
      opacity: interpolate(sharedOpacity.value, [0, 1], [0.5, 1], {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.EXTEND,
      }),
    }
  })

  if (hidden) return null
  return (
    <SafeAreaView
      style={[styles.wrapper, wrapperStyle, { borderRadius: roundness }]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.onSurface,
          },
          animatedStyles,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size={16}
            color={'#fff'}
            style={styles.loadingIcon}
          />
        ) : null}
        <Text
          style={[
            styles.content,
            {
              marginStart: action ? 0 : 16,
              color: colors.surface,
            },
          ]}
        >
          {children}
        </Text>
        <Button
          onPress={() => {
            onPressAction?.()
            onDismiss()
          }}
          style={[styles.button, actionStyle]}
          color={colors.accent}
          compact
          mode="text"
          {...actionProps}
        >
          {actionLabel}
        </Button>
      </Animated.View>
    </SafeAreaView>
  )
}

/**
 * Show the Snackbar for a short duration.
 */
Snackbar.DURATION_SHORT = DURATION_SHORT

/**
 * Show the Snackbar for a medium duration.
 */
Snackbar.DURATION_MEDIUM = DURATION_MEDIUM

/**
 * Show the Snackbar for a long duration.
 */
Snackbar.DURATION_LONG = DURATION_LONG

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
    borderRadius: 4,
  },
  content: {
    marginStart: 16,
    marginVertical: 14,
    flexWrap: 'wrap',
    flex: 1,
  },
  loadingIcon: {
    marginStart: 16,
    marginVertical: 14,
    flexWrap: 'wrap',
  },
  button: {
    marginHorizontal: 8,
    marginVertical: 6,
  },
})
