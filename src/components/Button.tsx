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

interface Props {
  icon: React.ReactElement
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
  theme: ReactNativeZuhal.Theme
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
  // mode,
  // color,
  style,
  contentStyle,
  // disabled,
  labelStyle,
  onPress,
  onLongPress,
  children,
  uppercase,
  testID,
  compact,
}: // theme,
// ...props
Props) => {
  // TODO: add useTheme
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.button, style]}
    >
      <View style={[styles.content, contentStyle]}>
        <Text
          style={[
            styles.label,
            labelStyle,
            uppercase && styles.uppercaseLabel,
            compact && styles.compact,
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
