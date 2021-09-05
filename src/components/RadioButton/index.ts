import RadioButtonComponent from './RadioButton'
import { RadioButtonGroup } from './RadioButtonGroup'

type RadioButtonType = typeof RadioButtonComponent
type RadioButtonGroup = typeof RadioButtonGroup

interface CombinedTypes extends RadioButtonType, RadioButtonGroup {}

export const RadioButton: CombinedTypes = Object.assign(RadioButtonComponent, {
  Group: RadioButtonGroup,
})
