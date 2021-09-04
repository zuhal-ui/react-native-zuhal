import * as React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { TouchableRipple } from './TouchableRipple'
// import color from 'color'
import { primary400, white, neutral400 } from '../styles/colors'
import { space2, space6, space24, space16 } from '../styles/spacing'
import FeatherIcon from '../components/FeatherIcon'

type Props = {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked'
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean
  /**
   * Function to execute on press.
   */
  onPress?: () => void
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: string
  /**
   * Custom color for checkbox.
   */
  color?: string
  /**
   * @optional
   */
  theme: ReactNativeZuhal.Theme
  /**
   * testID to be used on tests.
   */
  testID?: string
}

export const Checkbox = ({
  status,
  disabled,
  onPress,
  testID,
  color: checkedColor,
  uncheckedColor,
  ...rest
}: Props) => {
  let checked: boolean
  if (status === 'checked') {
    checked = true
  } else {
    checked = false
  }

  let backgroundColor: string
  let borderColor: string
  if (!disabled) {
    if (checked) {
      borderColor = checkedColor ? checkedColor : primary400
      backgroundColor = checkedColor ? checkedColor : primary400
    } else {
      borderColor = uncheckedColor ? uncheckedColor : primary400
      backgroundColor = white
    }
  } else {
    borderColor = neutral400
    if (checked) {
      backgroundColor = neutral400
    } else {
      backgroundColor = white
    }
  }

  const border: ViewStyle = {
    backgroundColor,
    borderColor,
  }

  return (
    <TouchableRipple
      {...rest}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ disabled, checked }}
      accessibilityLiveRegion="polite"
      testID={testID}
    >
      <View style={[styles.border, border]}>
        {checked ? (
          <FeatherIcon
            allowFontScaling={true}
            name="check"
            size={space16}
            color={white}
            direction="ltr"
          />
        ) : null}
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  border: {
    width: space24,
    height: space24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: primary400,
    borderWidth: space2,
    borderRadius: space6,
    backgroundColor: primary400,
  },
})
