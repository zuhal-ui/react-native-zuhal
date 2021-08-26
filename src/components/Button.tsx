import * as React from 'react'
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import color from 'color'
import { useTheme } from '../core/theming'
import { black, white } from '../styles/colors'

interface Props {
  icon?: React.ReactElement
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   */
  mode?: 'text' | 'outlined' | 'contained'
  /**
   * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
   */
  dark?: boolean
  /**
   * Use a compact look, useful for `text` buttons in a row.
   */
  compact?: boolean
  /**
   * Custom text color for flat button, or background color for contained button.
   */
  color?: string
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean
  /**
   * Label text of the button.
   */
  children: React.ReactNode
  /**
   * Make the label text uppercased. Note that this won't work if you pass React elements as children.
   */
  uppercase?: boolean
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string
  /**
   * @optional
   */
  theme?: ReactNativeZuhal.Theme
  /**
   * Function to execute on press.
   */
  onPress?: () => void
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void
  /**
   * Style of button's inner content.
   * Use this prop to apply custom height and width and to set the icon on the right with `flexDirection: 'row-reverse'`.
   */
  contentStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>
  /**
   * testID to be used on tests.
   */
  testID?: string
}

export const Button = ({
  //@ts-ignore
  // icon,
  loading,
  mode,
  color: buttonColor,
  style,
  contentStyle,
  disabled,
  labelStyle,
  onPress,
  onLongPress,
  children,
  uppercase,
  testID,
  compact,
  dark,
}: // theme,
// ...props
Props) => {
  // TODO: add useTheme
  const { colors, roundness, ...theme } = useTheme()

  const font = theme.fonts.medium
  let backgroundColor: string,
    borderColor: string,
    textColor: string,
    borderWidth: number
  if (mode === 'contained') {
    if (disabled) {
      backgroundColor = color(theme.dark ? white : black)
        .alpha(0.12)
        .rgb()
        .string()
    } else if (buttonColor) {
      backgroundColor = buttonColor
    } else {
      backgroundColor = colors.primary
    }
  } else {
    backgroundColor = 'transparent'
  }

  if (mode === 'outlined') {
    borderColor = color(theme.dark ? white : black)
      .alpha(0.29)
      .rgb()
      .string()
    borderWidth = StyleSheet.hairlineWidth
  } else {
    borderColor = 'transparent'
    borderWidth = 0
  }

  if (disabled) {
    textColor = color(theme.dark ? white : black)
      .alpha(0.32)
      .rgb()
      .string()
  } else if (mode === 'contained') {
    let isDark

    if (typeof dark === 'boolean') {
      isDark = dark
    } else {
      isDark =
        backgroundColor === 'transparent'
          ? false
          : !color(backgroundColor).isLight()
    }

    textColor = isDark ? white : black
  } else if (buttonColor) {
    textColor = buttonColor
  } else {
    textColor = colors.primary
  }

  const buttonStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius: roundness,
  }

  const textStyle = { color: textColor, ...font }

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.button, compact && styles.compact, buttonStyle, style]}
    >
      <View style={[styles.content, contentStyle]}>
        <Text
          selectable={false}
          numberOfLines={1}
          style={[
            styles.label,
            compact && styles.compactLabel,
            uppercase && styles.uppercaseLabel,
            textStyle,
            font,
            labelStyle,
          ]}
        >
          {children}
        </Text>
        {loading ? <ActivityIndicator size={16} /> : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    borderStyle: 'solid',
  },
  compact: {
    minWidth: 'auto',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 12,
    marginRight: -4,
  },
  iconReverse: {
    marginRight: 12,
    marginLeft: -4,
  },
  label: {
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 9,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
})
