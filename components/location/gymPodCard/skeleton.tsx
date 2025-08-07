import React from "react";
import { MapPin, Clock } from "lucide-react-native";
import { View } from "react-native";
import "../../../app/global.css"
import { shadowLg } from "@/utils/shadow";

export const Skeleton = ({ className }: { className?: string }) =>
  <View className={ ` rounded-lg animate-pulse bg-gray-200   ${className} ` } />

export const GymPodCardSkeleton: React.FC = () => {
  return (
    <View
      style={ shadowLg }
      className="  border-none shadow bg-white p-3 rounded-2xl  w-full"
    >
      <View className="relative w-full h-40 mb-3 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full animate-pulse" />
      </View>
      <View className="gap-2 ">
        <Skeleton className="h-5 w-3/4" />
        <View className=" flex-row items-center gap-2">
          <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
          <Skeleton className="h-4 w-2/3" />
        </View>
        <View className=" flex-row justify-between items-center mt-0 ">
          <View className=" flex-row items-center gap-2">
            <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
            <Skeleton className="h-4 w-16" />
          </View>
        </View>
      </View>
    </View>
  );
};
