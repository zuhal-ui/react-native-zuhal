import * as React from 'react'
import { Appearance, ColorSchemeName } from 'react-native'
import { ThemeProvider } from './theming'
// import { Provider as SettingsProvider, Settings } from './settings'
// import MaterialCommunityIcon from '../components/MaterialCommunityIcon'
import { DefaultTheme } from '../styles/DefaultTheme'
import { DarkTheme } from '../styles/DarkTheme'

type Props = {
  children: React.ReactNode
  theme?: ReactNativeZuhal.Theme
}

export const Provider = ({ ...props }: Props) => {
  const colorSchemeName =
    (!props.theme && Appearance?.getColorScheme()) || 'light'

  const [colorScheme, setColorScheme] =
    React.useState<ColorSchemeName>(colorSchemeName)

  const handleAppearanceChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    setColorScheme(preferences.colorScheme)
  }

  React.useEffect(() => {
    if (!props.theme) Appearance?.addChangeListener(handleAppearanceChange)
    return () => {
      if (!props.theme) Appearance?.removeChangeListener(handleAppearanceChange)
    }
  }, [props.theme])

  const getTheme = () => {
    const { theme: providedTheme } = props

    if (providedTheme) {
      return providedTheme
    } else {
      const theme = (
        colorScheme === 'dark' ? DarkTheme : DefaultTheme
      ) as ReactNativeZuhal.Theme

      return theme
    }
  }

  const { children } = props
  return <ThemeProvider theme={getTheme()}>{children}</ThemeProvider>
}
