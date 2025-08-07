import { shadowLg } from "@/utils/shadow";
import { Check, Info, X } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View
      style={ shadowLg }
      className="bg-white px-3 py-3  rounded-[10px] shadow min-w-[100px] mx-4 max-w-[calc(90vw)] mt-2">
      <View className="flex-row items-center gap-3">
        <View className="bg-green-500 rounded-[1000px] p-0.5">
          <Check className="font-bold" color={ "#fff" } size={ 16 } />
        </View>
        <Text className="text-green-800 font-semibold text-base">{ text1 }</Text>
      </View>
      { text2 && (
        <Text className="text-gray-600 text-sm mt-1 ml-6 hidden">{ text2 }</Text>
      ) }
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View
      style={ shadowLg }
      className="bg-white px-3 py-3 rounded-[10px] shadow  min-w-[100px] mx-4 mt-2">
      <View className="flex-row items-center gap-3">
        <View className="bg-red-500 rounded-[100px] p-0.5">
          <X className="font-bold" color={ "#fff" } size={ 16 } />
        </View>
        <Text className="text-red-800 font-semibold text-base">{ text1 }</Text>
      </View>
      { text2 && (
        <Text className="text-gray-600 text-sm mt-1 ml-6 hidden">{ text2 }</Text>
      ) }
    </View>
  ),

  info: ({ text1, text2 }: any) => (
    <View
      style={ shadowLg }
      className="bg-white px-3 py-3 rounded-[10px] shadow  min-w-[100px] mx-4 mt-2">
      <View className="flex-row items-center gap-3">
        <View className="rounded-[100px] p-0.5">
          <Info className="font-bold bg-transparent" color={ "#3b82f6" } size={ 16 } />
        </View>
        <Text className="text-blue-800 font-semibold text-base">{ text1 }</Text>
      </View>
      { text2 && (
        <Text className="text-gray-600 text-sm mt-1 ml-6 hidden">{ text2 }</Text>
      ) }
    </View>
  ),
};
