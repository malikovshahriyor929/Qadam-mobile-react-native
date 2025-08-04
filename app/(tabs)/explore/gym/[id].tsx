import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function GetDetails() {
  const { id } = useLocalSearchParams()

  return (
    <View>
      <Text className='text-2xl'>{ id }</Text>
    </View>
  )
}
