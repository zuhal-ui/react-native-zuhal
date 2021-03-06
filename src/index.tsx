export default {
  multiply(a: number, b: number) {
    return Promise.resolve(a * b)
  },
}

export { ThemeProvider, useTheme, withTheme } from './core/theming'
export { Provider } from './core/Provider'
export { Button } from './components/Button'
export { RadioButton } from './components/RadioButton/index'
export { Snackbar } from './components/Snackbar'
export { default as Stepper } from './components/Stepper'
export { Switch } from './components/Switch'
export { Slider } from './components/Slider'
export { TextInput } from './components/TextInput'
export { Checkbox } from './components/Checkbox'
export { DarkTheme } from './styles/DarkTheme'
export { DefaultTheme } from './styles/DefaultTheme'
export { configureFonts } from './styles/fonts'
export { TouchableRipple } from './components/TouchableRipple'
