import DefaultTheme from './DefaultTheme'
import { white, pinkA100, neutral700, neutral900, neutral500 } from './colors'
import type { Theme } from '../types'

// TODO: these properties are fake. replace them with correct properties
const DarkTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
    primary: '#BB86FC',
    accent: '#03dac6',
    background: '#121212',
    surface: '#121212',
    error: '#CF6679',
    onSurface: '#FFFFFF',
    text: white,
    disabled: neutral900,
    placeholder: neutral700,
    backdrop: neutral500,
    notification: pinkA100,
  },
}

export default DarkTheme
