import { useQuery } from "@tanstack/react-query";
import GymPodCard from "./gymPodCard/GymPodCard";
import LocationTracker from "./myloaction";
import { GymPodCardSkeleton } from "./gymPodCard/skeleton";
import { useEffect, useState } from "react";
import { Myasxios } from "@/shared/generics";
import { HallType } from "@/types";
import { View } from "react-native";

const Location = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  let params = {
    search: "",
    startTime: "",
    endTime: "",
    latitude: location?.latitude,
    longitude: location?.longitude,
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["location"],
    queryFn: async () =>
      Myasxios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/locations`, {
        params,
      })
        .then((res) => res.data),
  });
  useEffect(() => {
    refetch();
    if (location) {
      params = {
        ...params,
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }
  }, [location?.latitude, location?.longitude]);
  return (
    <View>
      { !isLoading && !isError
        ? data?.data?.map((value: HallType, i: number) => (
          <View key={ i }>
            <GymPodCard { ...value } />
          </View>
        ))
        : Array(5)
          .fill(1)
          .map((_, i) => (
            <View key={ i }>
              <GymPodCardSkeleton />
            </View>
          )) }
      <LocationTracker setLocation={ setLocation } />
    </View>
  );
};

export default Location;
