import React from "react";
import { MapPin, Clock, CircleAlert, Star } from "lucide-react-native";
import { t } from "i18next";
import { format } from "date-fns";
import { HallType } from "@/types";
import { Link, useLocalSearchParams } from "expo-router";
import MembershipName from "@/components/language";
import { Image, Text, View } from "react-native";
import { shadowLg } from "@/utils/shadow";
export interface GymPodProps {
  id: string;
  name: string;
  location: string;
  image: string;
  capacity: number;
  nextAvailable: string;
  distance?: string;
}

const GymPodCard: React.FC<HallType> = ({
  id,
  name_eng,
  name_ru,
  name_uz,
  address_eng,
  address_ru,
  address_uz,
  images,
  distance,
  averageRate,
  connected,
  bookedSessions,
}) => {
  const { pathname } = useLocalSearchParams();
  interface Availability {
    isAvailableNow: boolean;
  }

  // interface BookedSession {
  //   endTime: string;
  // }

  function formatEndTimeToLocal(
    endTimeUTC: string | undefined,
    availability: Availability = { isAvailableNow: false }
  ): string {
    if (availability.isAvailableNow) {
      const date = new Date();
      return format(
        date.getTime() + 1 * 60 * 60 * 1000,
        "dd-MM-yyyy  -  HH:00"
      );
    } else {
      const date = new Date(endTimeUTC as string);
      return format(
        date.getTime() - 5 * 60 * 60 * 1000,
        "dd-MM-yyyy  -  HH:mm"
      );
    }
  }

  const formatted = formatEndTimeToLocal(
    bookedSessions[bookedSessions.length - 1]?.endTime
  );
  return (
    <>
      <Link href={ `${connected ? `(tabs)/explore/gym/${id}` : pathname}` as any }>
        <View
          style={ shadowLg }
          className="relative shadow  bg-white p-3  rounded-2xl ">
          <View
            className={ ` border-none 
          
            `}
          >
            <View className="relative w-full h-40 mb-3 rounded-xl overflow-hidden">
              <Image
                src={ `${process.env.EXPO_PUBLIC_BASE_URL}/files/${images[0].filename
                  }` }
                alt={ name_eng }
                className={ `w-full h-full object-cover   ${!connected && "opacity-50  blur-[4px]"
                  }  ` }
              />
              { !connected && (
                <View className="absolute top-0 !blur-0 z-20 left-0 w-full h-full flex items-center justify-center gap-2 px-4  ">
                  <CircleAlert className="text-red-500 font-bold text-2xl max-[410px]:hidden" />
                  <Text className=" text-xl text-center  font-semibold text-red-500 opacity-100">
                    { t("podStatus") }
                  </Text>
                </View>
              ) }
              { distance && (
                <View className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Text className=" text-xs font-medium">
                    { Number(distance) >= 1000
                      ? `${(Number(distance) / 1000).toFixed(1)} km`
                      : `${Number(distance).toFixed(0)} m` }
                  </Text>
                </View>
              ) }
            </View>
            <View >
              <Text className="font-semibold text-xl mb-1 truncate w-[95%] line-clamp-1">
                { MembershipName({
                  name_eng: name_eng,
                  name_ru: name_ru,
                  name_uz: name_uz,
                }) }
              </Text>
              <View className="flex-row items-center *:text-[#71717a] text-sm gap-1 ">
                <MapPin size={ 17 } color={ "#71717a" } />
                <Text className=" truncate w-[80%] line-clamp-1 text-[#71717a]" >
                  { MembershipName({
                    name_eng: address_eng,
                    name_ru: address_ru,
                    name_uz: address_uz,
                  }) }
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center text-sm ">
                  <Clock size={ 17 } color={ "#71717a" } />
                  <Text className="text-[#71717a]">{ formatted }</Text>
                </View>
                <View className="flex-row items-center text-sm gap-1 ">
                  <Star fill={ "#eab308" } color={ "#eab308" } size={ 16 } className="w-3.5 h-3.5  !text-yellow-500" />
                  <Text className="text-[#71717a]">{ averageRate === 0 ? 5 : averageRate.toFixed(1) } </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Link>
    </>
  );
};

export default GymPodCard;
