import * as React from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { space10 } from '../styles/spacing'
import { title24 } from '../styles/fontSize'

type StepperProps = {
  initialValue: number
  onValueChange: (value: number) => any
  step: number
  minimumValue: number
  maximumValue: number
}

type Reducer = (state: number, action: 'increment' | 'decrement') => number

// TODO:
// add theming
// add more styles for disable and other things
const Stepper: React.FC<StepperProps> = ({
  initialValue,
  onValueChange,
  minimumValue = 0,
  maximumValue = 14,
  step = 1,
}) => {
  // TODO:
  //  1 -  use icon instead of '+'
  const [value, dispatch] = React.useReducer<Reducer>(
    (currentValue: number, action: 'increment' | 'decrement') => {
      if (action === 'increment') {
        if (
          currentValue === maximumValue ||
          currentValue + step > maximumValue
        ) {
          return currentValue
        } else {
          return currentValue + step
        }
      }

      if (action === 'decrement') {
        if (
          currentValue === minimumValue ||
          currentValue - step < minimumValue
        ) {
          return currentValue
        } else {
          return currentValue - step
        }
      }

      throw new Error('action should only be `increment` or `decrement`')
    },
    initialValue
  )

  React.useEffect(() => {
    onValueChange?.(value)
  }, [value, onValueChange])

  const _increase = React.useCallback(() => {
    dispatch('increment')
  }, [])
  const _decrease = React.useCallback(() => {
    dispatch('decrement')
  }, [])

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={_decrease}>
        <Text selectable={false} style={styles.text}>
          -
        </Text>
      </Pressable>
      <Text selectable={false} style={styles.value}>
        {value}
      </Text>
      <Pressable style={styles.button} onPress={_increase}>
        <Text selectable={false} style={styles.text}>
          +
        </Text>
      </Pressable>
    </View>
  )
}

export default Stepper

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: 100,
    backgroundColor: 'gray',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
        }
      : {}),
  },
  text: {
    color: '#fff',
    fontSize: title24,
    lineHeight: 1,
  },
  value: {
    fontSize: title24,
    marginHorizontal: space10,
    width: 30,
    textAlign: 'center',
  },
})
