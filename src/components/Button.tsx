import * as React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  title: string
  icon: React.ReactElement
}

export const Button = ({ title, icon }: Props) => {
  return (
    <Pressable>
      <Text>{title}</Text>
      {icon}
    </Pressable>
  )
}
