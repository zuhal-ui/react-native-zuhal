import * as React from 'react'
import { View } from 'react-native'

const RadioButtonContext = React.createContext<{
  value: string
  onValueChange: (item: string) => void
}>(null as any)

interface Props {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => void
  /**
   * Value of the currently selected radio button.
   */
  value: string
  /**
   * React elements containing radio buttons.
   */
  children: React.ReactNode
}

export const RadioButtonGroup: React.FC<Props> = ({
  value,
  onValueChange,
  children,
}) => {
  return (
    <RadioButtonContext.Provider value={{ value, onValueChange }}>
      <View accessible accessibilityRole="radiogroup">
        {children}
      </View>
    </RadioButtonContext.Provider>
  )
}

export const useRadio = () => {
  return React.useContext(RadioButtonContext)
}

RadioButtonGroup.displayName = 'RadioButton.Group'
