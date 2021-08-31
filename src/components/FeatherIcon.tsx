import * as React from 'react'
import { StyleSheet, Text, TextProps, ViewProps } from 'react-native'

export type IconProps = {
  name: string
  color: string
  size: number
  direction?: 'rtl' | 'ltr'
  allowFontScaling?: boolean
}

let Feather: React.ComponentType<
  TextProps & {
    name: string
    color: string
    size: number
    pointerEvents?: ViewProps['pointerEvents']
  }
>

try {
  // Optionally require vector-icons
  Feather = require('react-native-vector-icons/Feather').default
} catch (e) {
  console.log('error is : ', e.message)

  let isErrorLogged = false

  // Fallback component for icons
  Feather = ({ name, color, size, ...rest }) => {
    if (!isErrorLogged) {
      console.warn(
        `Tried to use the icon '${name}' in a component from 'react-native-zuhal', but 'react-native-vector-icons/Feather
      ' could not be loaded.`,
        `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://Anar.github.io/react-native-zohal/icons.html.`
      )

      isErrorLogged = true
    }

    return (
      <Text
        {...rest}
        style={[styles.icon, { color, fontSize: size }]}
        // @ts-expect-error: Text doesn't support this, but it seems to affect TouchableNativeFeedback
        pointerEvents="none"
        selectable={false}
      >
        □
      </Text>
    )
  }
}

export const accessibilityProps = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants' as 'no-hide-descendants',
}

const defaultIcon = ({
  name,
  color,
  size,
  direction,
  allowFontScaling,
}: IconProps) => (
  <Feather
    allowFontScaling={allowFontScaling}
    name={name}
    color={color}
    size={size}
    style={[
      {
        transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
        lineHeight: size,
      },
      styles.icon,
    ]}
    // pointerEvents="none"
    selectable={false}
    {...accessibilityProps}
  />
)

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
})

export default defaultIcon
