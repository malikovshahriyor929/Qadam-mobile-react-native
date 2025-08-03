import React from 'react'
import { Text, View } from 'react-native'

const ButtonMy = ({ children, type = "text", className }: { children: React.ReactNode, type: string, className?: string }) => {
  return (
    <View className={`bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4 ${className} `}>
      {type == "text" ?
        <Text className='text-primary-foreground font-bold'>{children}</Text>
        : children
      }
    </View>
  )
}

export default ButtonMy