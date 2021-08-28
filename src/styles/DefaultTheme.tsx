import {
  black,
  white,
  neutral200,
  neutral500,
  primary300,
  neutral300,
  secondary300,
  primary400,
} from './colors'
import { configureFonts } from './fonts'
import type { Theme } from '../types'

// TODO: these properties are fake. replace them with correct properties
export const DefaultTheme: Theme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: primary300,
    accent: secondary300,
    background: '#f6f6f6',
    surface: white,
    error: primary400,
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
