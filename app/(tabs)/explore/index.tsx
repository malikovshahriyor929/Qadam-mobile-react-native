import { useEffect, useState } from "react";
import { Frown, Search, X } from "lucide-react-native";
import GymPodCard from "@/components/location/gymPodCard/GymPodCard";
import useDebounce from "@/shared/debounse";
import { useQuery } from "@tanstack/react-query";
import { Myasxios } from "@/shared/generics";
import { GymPodCardSkeleton } from "@/components/location/gymPodCard/skeleton";
import { t } from "i18next";
import LocationTracker from "@/components/location/myloaction";
import Toast from "react-native-toast-message";
import Header from "@/components/headerforAll";
import { Input } from "tamagui";
import { Pressable, Text, View } from "react-native";
import { HallType } from "@/types";
import { DrawerDialogDemo } from "@/components/explore/drawer";
const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [timeSelection, setTimeSelection] = useState<{
    start: string | null;
    end: string | null;
    selectingStart: boolean;
  }>({ start: null, end: null, selectingStart: true });
  let params = {
    search: "",
    startTime: "",
    endTime: "",
    latitude: location?.latitude,
    longitude: location?.longitude,
  };
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["location"],
    queryFn: async () =>
      await Myasxios.get(
        "/locations",
        Object.keys(params).length > 0
          ? {
            params,
          }
          : {}
      )
        .then((res) => res.data)
        .catch((err) => {
          if (err?.response?.status === 500 || err?.code === "ECONNABORTED") {
            Toast.show({
              type: "error",
              text1: t("booking_temporarily_unavailable")
            })
          }
        }),
  });
  if (debouncedValue.trim() !== "") {
    params.search = debouncedValue.trim();
  }

  if (timeSelection.start && timeSelection.end) {
    params = {
      ...params,
      startTime: timeSelection.start.slice(0, 19) + ".000Z",
      endTime: timeSelection.end.slice(0, 19) + ".000Z",
    };
  }
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
  useEffect(() => {
    refetch();
  }, [refetch, debouncedValue]);
  const iks = () => {
    setTimeSelection({
      start: null,
      end: null,
      selectingStart: true,
    });
    params = {
      ...params,
      startTime: "",
      endTime: "",
    };
    refetch();
  };
  return (
    <View className="flex flex-col min-h-screen bg-white pb-20 ">
      <LocationTracker setLocation={ setLocation } />
      <Header title={ t("explore.title") } />
      <View className="px-4 py-4">
        <View className="relative mb-4">
          {/* <Controller name="search" rules={ { required: true } } render={ ({ field: { onChange } }) =>
            <View>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={ t("explore.searchPlaceholder") }
                className="pl-10"
                value={ searchQuery }
                onChangeText={ setSearchQuery }
              />
            </View>
          } /> */}
          <View className="relative ">
            <View className=" absolute left-3 top-1/2 transform -translate-y-1/2">

              <Search size={ 16 } className=" text-muted-foreground w-4 h-4" />
            </View>
            <Input
              className="pl-10 !bg-transparent placeholder:capitalize "
              bg={ "$colorTransparent"   }
              pl={ 35 }
              value={ searchQuery }
              onChangeText={ setSearchQuery }
              placeholder={ t("explore.searchPlaceholder") }
            />
          </View>
        </View>
        <View className="mb-2 flex-row justify-between items-center">
          <Text className="font-semibold text-[16px]">{ t("explore.allPods") }</Text>
          <View className="flex-row items-center gap-2">
            { timeSelection.start && timeSelection.end && (
              <Pressable onPress={ () => iks() }>
                <X size={ 16 } />
              </Pressable>
            ) }
            <Pressable

              onPress={ () => setOpen(!open) }
            >
              <Text
                className="text-sm text-gym-400">
                { t("explore.filter") }
              </Text>
            </Pressable>
          </View>
        </View>
        { isLoading ? (
          Array(5)
            .fill(1)
            .map((_, i) => (
              <View key={ i }>
                <GymPodCardSkeleton />
              </View>
            ))
        ) : isError ? (
          <View className="text-center py-8 text-red-500">
            { t("explore.error") }{ " " }
          </View>
        ) : data?.data?.length > 0 ? (
          <>
            { data.data.map((value: HallType, i: number) => (
              <View key={ i }>
                <GymPodCard { ...value } />
              </View>
            )) }
          </>
        ) : (
          <View className="flex flex-col items-center justify-center py-12 text-center">
            <Frown className="w-12 h-12 text-gray-400 mb-4" />
            <Text>{ t("explore.noPodsFound") }</Text>
            <Text className="text-gray-500 mt-1">
              { searchQuery || timeSelection.start
                ? t("explore.adjustFilters")
                : t("explore.noPodsAvailable") }
            </Text>
            {/* { searchQuery && (
              <Pressable
                className="mt-4  "
                onPress={ () => {
                  setSearchQuery("")
                  setTimeSelection({
                    start: null,
                    end: null,
                    selectingStart: true,
                  });
                  refetch()
                } }
              >
                <Text className="text-sm text-primary  hover:text-primary/90">
                  { t("explore.clearFilters") }
                </Text>
              </Pressable>
            ) } */}
          </View>
        ) }
      </View>
      <DrawerDialogDemo
        setOpen={ setOpen }
        open={ open }
        setTimeSelection={ setTimeSelection }
        timeSelection={ timeSelection }
        refetch={ refetch }
      />
    </View>
  );
};

export default Explore;
