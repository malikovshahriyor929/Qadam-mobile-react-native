import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Myasxios } from "@/shared/generics";
import { t } from "i18next";
import { Calendar } from "lucide-react-native";
import { Text,} from "tamagui";
import { BookingType } from "@/types";
import Header from "@/components/headerforAll";
import SkeletonForBooking from "@/components/booking/skeleton";
import UpcomingBookings from "@/components/booking/upComingBooking";
import PastBookings from "@/components/booking/pastBooking";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
const Bookings = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const { data, isLoading, refetch } = useQuery<{
    available: BookingType[];
    unavailable: BookingType[];
  }>({
    queryKey: ["bookings"],
    queryFn: () =>
      Myasxios.get("/tariffs/sessions").then((res) => res.data),
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch()
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View className="h-screen flex-1">
      <Header title={ t("bookings.title") } />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={ refreshing }
            onRefresh={ onRefresh }
            colors={ ["#2A2F35"] }
            tintColor="#2A2F35"
            title="Yangilanmoqda..."
          />
        }
        contentContainerStyle={ {
          paddingBottom: 90,
          backgroundColor: "#F9F8FB"
        } }>

        <View className="flex-row p-1.5 bg-[#F4F4F5]  rounded-[10px]  mx-5 mt-4">
          <Pressable
            onPress={ () => setTab("upcoming") }
            className={ `bg-transparent  items-center w-[50%] 
             ${tab === "upcoming" ? "w-[50%] bg-white py-2 rounded-[8px]  " : " py-2 rounded-[8px] "}  ` }>
            <View>
              <Text
                style={ { fontWeight: "bold", fontSize: 14, color: tab !== "past" ? "#09090B" : "#71717A" } }
              >
                { t("bookings.upcoming") }
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={ () => setTab("past") }
            className={ `items-center w-[50%] 
             ${tab === "past" ? "w-[50%] bg-white p-2 rounded-[8px] " : "p-2 rounded-[8px] "} ` }>
            <Text
              className=" text-center text-nowrap line-clamp-1 "
              style={ { fontWeight: "bold", fontSize: 14, color: tab === "past" ? "#09090B" : "#71717A" } }
            >

              { t("pastBookings") }
            </Text>
          </Pressable>
        </View>
        <View>
          {
            tab === "upcoming" ?
              isLoading ? (
                <SkeletonForBooking pages={ 10 } />
              ) : data?.available?.length ? (
                <UpcomingBookings data={ data } refetch={ refetch } />
              ) : (
                <NoData message={ t("bookings.noUpcoming") } />
              )
              : (
                isLoading ? (
                  <SkeletonForBooking />
                ) : data?.unavailable?.length ? (
                  <PastBookings data={ data } refetch={ refetch } />
                ) : (
                  <NoData message={ t("noPastBookings") } />
                )
              )
          }
        </View>
      </ScrollView >
    </View>
  );
};

const NoData = ({ message }: { message: string }) => (
  <View className="items-center justify-center bg-white h-[calc(100vh-34vh)]    py-12 px-4  mx-5 my-4 rounded-[12px] ">
    <View className="rounded-[100%] p-5 bg-gray-200 mb-2 ">
      <Calendar size={ 40 } />
    </View>
    <Text fontSize="$6" mt={ 4 } textAlign="center" fontWeight="bold" color="$color">
      { message }
    </Text>
    <Text textAlign="center" mt={ 4 } lineHeight={ 20 } color="$gray10" fontSize="$4">
      { t("gymHistoryMessage") }
    </Text>
  </View>
);

export default Bookings;
