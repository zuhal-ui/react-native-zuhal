import { DefaultTheme } from './DefaultTheme'
import {
  white,
  neutral500,
  primary100,
  primary300,
  black,
  neutral200,
  neutral300,
  primary400,
} from './colors'
import type { Theme } from '../types'

// TODO: these properties are fake. replace them with correct properties
export const DarkTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
    primary: primary100,
    accent: primary300,
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
}
