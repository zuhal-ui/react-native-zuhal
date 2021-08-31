import React, { useRef, useState, useCallback } from 'react'
import {
  StyleSheet,
  TextInput as NativeInput,
  View,
  Animated,
  TextStyle,
  Text,
  Pressable,
  ViewStyle,
} from 'react-native'
import { configureFonts } from '../styles/fonts'
import Icon from './FeatherIcon'
import { neutral400, white, primary300, secondary300 } from '../styles/colors'

interface Input extends ViewStyle, TextStyle {}

type Props = {
  /**
   * this will call ever time you type with input and take the newest value of input
   */
  onChange?: (value: string) => void
  /**
   * this will help you to change the style of error text
   */
  errorTextStyle?: TextStyle
  /**
   * this object will apply to labe above of input
   */
  labelStyle?: TextStyle
  /**
   * this will overwrite the original style of input
   */
  style?: Input
  /**
   * this label will show right above of input
   */
  label?: string
  /**
   * this will show inside of input and will gone after you start typing
   */
  placeholder?: string
  /**
   * this will change the input color to red and show you error message
   */
  error?: string
  /**
   * test id for testing the input
   */
  testID?: string
  /**
   * this show that could you type something in input or not
   */
  editable?: boolean
}

const AnimatedComponent = Animated.createAnimatedComponent(Pressable)

const font = configureFonts()

/**
 *
 */
export const TextInput = ({
  error,
  placeholder,
  label,
  onChange,
  style,
  testID,
  editable = true,
  ...rest
}: Props) => {
  /**
   * this state check that is input focused or not
   */
  const [isSelected, setSelected] = useState(false)
  // this will hold the value of input
  const [value, setValue] = useState('')
  // this is the animated value of placeholder
  const labelPosition = useRef(new Animated.Value(0)).current
  // this is to focus the input when some one press the placeholder inside it
  const inputRef = useRef<NativeInput>(null)

  /**
   * this will raise the placeholder when input is focused
   */
  const labelRaise = useCallback(() => {
    if (style?.height && typeof style?.height === 'number') {
      // this calculate the value to animate the placeholder
      const animatedValue = (-1 * style?.height) / 2
      Animated.timing(labelPosition, {
        toValue: animatedValue,
        duration: 120,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(labelPosition, {
        toValue: -25,
        duration: 120,
        useNativeDriver: true,
      }).start()
    }
  }, [labelPosition, style?.height])

  /**
   * this will take down the placeholder when input loss the focus (if input were empty)
   */
  const labelDown = useCallback(() => {
    Animated.timing(labelPosition, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start()
  }, [labelPosition])

  const inputFocus = useCallback(() => {
    inputRef?.current?.focus()
  }, [])

  /**
   * call when input is focused
   */
  const handleFocus = useCallback(() => {
    setSelected(true)
    labelRaise()
  }, [labelRaise])

  /**
   * call when the input loss its focus
   */
  const handlerBlur = useCallback(() => {
    setSelected(false)
    if (!value.length) {
      labelDown()
    }
  }, [value.length, labelDown])

  const handleChange = useCallback(
    (event) => {
      if (editable) {
        if (onChange) {
          onChange(event.nativeEvent?.text)
        }
        setValue(event.nativeEvent?.text)
      }
    },
    [onChange, editable]
  )

  // this is the color of input border and placeholder
  const color = error ? primary300 : isSelected ? secondary300 : neutral400

  // this will calculate the above space of component
  let top = 15
  if (style?.height && typeof style?.height === 'number') {
    if (style?.lineHeight && typeof style?.lineHeight === 'number') {
      top = (style?.height - style?.lineHeight) / 2
    } else {
      top = (style?.height - 20) / 2
    }
  } else if (style?.lineHeight && typeof style?.lineHeight === 'number') {
    top = (50 - style?.lineHeight) / 2
  }
  const animatedContainer: ViewStyle = {
    position: 'absolute',
    top: top,
    right: 12,
    paddingHorizontal: 10,
    backgroundColor: white,
    // @ts-ignore
    transform: [{ translateY: labelPosition }],
  }
  const placeholderStyle: TextStyle = {
    color,
    lineHeight: style?.lineHeight ?? 20,
    fontSize: isSelected ? 13 : 15,
    ...font.medium,
  }

  const inputStyle: TextStyle = {
    borderColor: color,
    borderWidth: error || isSelected ? 1.7 : 1,
  }

  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel="type in"
      accessibilityState={{ selected: isSelected, disabled: !editable }}
      accessibilityHint="type your desired value"
    >
      {label ? <Text style={styles.labelStyle}>{label}</Text> : null}
      <NativeInput
        style={[styles.input, inputStyle, style]}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handlerBlur}
        onChange={handleChange}
        selectionColor={color}
        placeholder={
          isSelected || label
            ? placeholder
              ? placeholder
              : 'شماره تماس را وارد کنید'
            : ''
        }
        value={value}
        {...rest}
      />
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={20} color={primary300} />
          <Text style={styles.errorText}>
            {typeof error === 'string'
              ? error
              : 'شماره تماس در سیستم موجود نمی باشد'}
          </Text>
        </View>
      ) : null}
      {!label ? (
        <AnimatedComponent onPress={inputFocus} style={animatedContainer}>
          <Text style={placeholderStyle}>{placeholder ?? 'شماره تماس '}</Text>
        </AnimatedComponent>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  labelStyle: {
    color: neutral400,
    textAlign: 'right',
    marginEnd: 2,
    marginBottom: 4,
    ...font.medium,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: neutral400,
    borderRadius: 5,
    textAlign: 'right',
    paddingHorizontal: 14,
    ...font.medium,
  },
  errorContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4,
    marginStart: 2,
  },
  errorText: {
    color: primary300,
    marginEnd: 4,
    // ...font.light,
  },
})
