import {
  black,
  white,
  neutral200,
  neutral500,
  primary100,
  primary300,
  neutral300,
} from './colors'
import { configureFonts } from './fonts'
import type { Theme } from '../types'

// TODO: these properties are fake. replace them with correct properties
export const DefaultTheme: Theme = {
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
    disabled: neutral200,
    placeholder: neutral500,
    backdrop: neutral300,
    notification: primary300,
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
}
