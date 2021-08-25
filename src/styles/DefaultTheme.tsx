import {
  black,
  white,
  neutral200,
  neutral500,
  neutral600,
  primary100,
  primary300,
} from './colors'
import configureFonts from './fonts'
import type { Theme } from '../types'

// TODO: these properties are fake. replace them with correct properties
const DefaultTheme: Theme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: primary100,
    accent: primary300,
    background: '#f6f6f6',
    surface: white,
    error: '#B00020',
    text: black,
    onSurface: '#000000',
    disabled: neutral500,
    placeholder: neutral200,
    backdrop: neutral600,
    notification: primary100,
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
}

export default DefaultTheme
