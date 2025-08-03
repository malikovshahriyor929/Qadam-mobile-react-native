import React from "react";
import { MapPin,Clock } from "lucide-react-native";
import { View } from "react-native";

export const GymPodCardSkeleton: React.FC = () => {
  return (
    <View className="gym-card mb-4 border-none shadow-md">
      <View className="relative w-full h-40 mb-3 rounded-xl overflow-hidden">
        <View className="w-full h-full animate-pulse" />
      </View>
      <View className="space-y-2">
        <View className="h-5 w-3/4" />
        <View className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
          <View className="h-4 w-2/3" />
        </View>
        <View className="flex justify-between items-center mt-2">
          <View className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
            <View className="h-4 w-16" />
          </View>
        </View>
      </View>
    </View>
  );
};
