import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, } from "react-native";
import { Calendar, Clock, RotateCcw } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import { t } from "i18next";
import RateDrawer from "@/components/rateDrawer";
import { BookingType } from "@/types";
import MembershipName from "@/components/language";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import SmartPagination from "@/components/smartPaginition";
import { shadowLg } from "@/utils/shadow";

const ITEMS_PER_PAGE = 5;

interface BookingProps {
  data: {
    available: BookingType[];
    unavailable: BookingType[];
  };
  refetch: () => void;
}

export default function PastBookings({ data, refetch }: BookingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rateOpen, setRateOpen] = useState(false);
  const [rateId, setRateId] = useState<string>("");
  const router = useRouter();

  const sortedBookings = useMemo(() => {
    return [...(data?.unavailable || [])];
  }, [data?.unavailable]);
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedBookings, currentPage]);

  const getStatusConfig = (status: string) => {
    const configs = {
      expired: {
        bg: "bg-gray-100 border-gray-300",
        text: "text-gray-500",
      },
      used: {
        bg: "bg-green-100 border-green-300",
        text: "text-green-600",
      },
      cancelled: {
        bg: "bg-red-200 border-red-300",
        text: "text-red-500",
      },
      pending: {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-600",
      },
      using: {
        bg: "bg-blue-100 border-blue-200",
        text: "text-blue-600",
      },
    };
    return configs[status as keyof typeof configs] || configs.expired;
  };

  if (sortedBookings.length === 0) {
    return (
      <View className="items-center py-16 rounded-lg">
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
          <Calendar size={ 40 } color="#3b82f6" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-3">
          { t("noPastBookings") }
        </Text>
        <Text className="text-gray-500 text-lg">{ t("gymHistoryMessage") }</Text>
      </View>
    );
  }

  return (
    <ScrollView className=" my-5 px-4 bg-[#F9F8FB] ">
      {
        paginatedBookings.map((booking, i) => {
          const statusConfig = getStatusConfig(booking.status);
          const imageUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/files/${booking.location.images[0].filename}`;
          return (
            <View
              key={ i }
              style={ shadowLg }
              className={ `bg-white mb-4 border-2 ${statusConfig.bg} rounded-2xl p-3 shadow` }
            >
              <View className="flex-row gap-4">
                <View className="w-[40%]">
                  <Image
                    src={ imageUrl }
                    resizeMode="cover"
                    className="w-full h-28 rounded-xl"
                  />
                  { !booking.rate && (
                    <Pressable
                      onPress={ () => {
                        if (booking.endTime < new Date().toISOString()) {
                          setRateId(booking.id.toString());
                          setRateOpen(true);
                        }
                      } }
                      className={ `mt-4 py-3 rounded-xl bg-primary  w-full items-center ${booking.status === "cancelled" ? "hidden" : ""}` }
                    >
                      <Text className="text-primary-foreground  font-semibold text-sm">
                        { t("rate") }
                      </Text>
                    </Pressable>
                  ) }
                </View>

                <View className="flex-1 justify-between">
                  <Text className="text-2xl line-clamp-2 truncate  font-bold text-gray-900 mb-2">
                    { MembershipName({
                      name_eng: booking.location.name_eng,
                      name_ru: booking.location.name_ru,
                      name_uz: booking.location.name_uz,
                    }) }
                  </Text>

                  <View className="gap-1">
                    <View className="flex-row items-center gap-2">
                      <Calendar size={ 16 } color="#1f2937" />
                      <Text className="text-sm font-semibold   text-gray-800">
                        { format(parseISO(booking.startTime), "EEE, MMM d, yyyy") }
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Clock size={ 16 } color="#1f2937" />
                      <Text className="text-sm font-semibold text-gray-800">
                        { booking.startTime.slice(11, 16) } - { booking.endTime.slice(11, 16) }
                      </Text>
                    </View>
                  </View>

                  { !booking.rate && (
                    <TouchableOpacity
                      onPress={ () => router.push({ pathname: "/(tabs)/explore/gym/[id]", params: { id: booking.location.id } }) }
                      className={ `mt-2 py-3 rounded-xl bg-primary  w-full items-center ${booking.status === "cancelled" ? "hidden" : ""
                        }` }
                    >
                      <View className="flex-row items-center gap-2">
                        <RotateCcw size={ 16 } color="#D5FA48" />
                        <Text className="text-primary-foreground  font-semibold text-sm">
                          { t("bookAgain") }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) }
                </View>
              </View>

              {
                (booking.rate || booking.status === "cancelled") && (
                  <TouchableOpacity
                    onPress={ () => router.push({ pathname: "/(tabs)/explore/gym/[id]", params: { id: booking.location.id } }) }
                    className="mt-3 py-3 rounded-xl bg-primary  w-full items-center"
                  >
                    <View className="flex-row items-center gap-2">
                      <RotateCcw size={ 16 } color="#D5FA48" />
                      <Text className="text-primary-foreground  font-semibold text-sm">
                        { t("bookAgain") }
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            </View>
          );
        })
      }

      < SmartPagination
        page={ currentPage }
        onChange={ setCurrentPage }
        totalPages={ totalPages }
      />

      <RateDrawer
        rateOpen={ rateOpen }
        setRateOpen={ setRateOpen }
        sessionId={ rateId }
        refetch={ refetch }
      />
    </ScrollView >
  );
}