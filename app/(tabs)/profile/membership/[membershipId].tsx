import { Myasxios } from "@/shared/generics";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { Zap, CheckCircle, Banknote } from "lucide-react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MembershipType } from "@/types";
import Toast from "react-native-toast-message";
import Header from "@/components/headerforAll";
import { Image, Pressable, Text, View } from "react-native";
import { shadowLg } from "@/utils/shadow";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";
import { Sheet } from "tamagui";
import MembershipName from "@/components/language";

const MembershipInfo = () => {
  const { membershipId: id } = useLocalSearchParams();
  const [openDrawerLog, setopenDrawerLog] = useState(false);
  const { data: membership, isLoading } = useQuery<MembershipType>({
    queryKey: ["membership", id],
    queryFn: async () =>
      Myasxios.get(`/tariffs/${id}`).then((res) => res.data.data),
  });
  const subscription = (id: string | number | null) => {
    Myasxios.post("/tariffs/subscribe", {
      tariffId: id,
    })
      .then(() => {
        Toast.show({
          type: "success",
          text1: (t("SuccessfullySubscribed"))
        })
      })
      .catch((rej) => {
        if (rej.response.data.message.includes("Balance is not")) {
          Toast.show({
            type: "error",
            text1: (t("Balancenot"))
          })
        }
      });
  };
  if (isLoading) {
    return (
      <View className=" flex-col min-h-screen pb-20 bg-background">
        <Header title="Loading..." showBackButton={ "/(tabs)/profile" } />
        <View className="px-3 py-4">
          <View
            style={ shadowLg }
            className="bg-white rounded-xl p-4 w-full justify-between items-center  mb-4   shadow border border-[#E4E4E7]">
            <Skeleton className="h-40 w-full mb-4" />
            <View className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <View className="grid grid-cols-2 gap-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </View>
              { [...Array(6)].map((_, i) => (
                <Skeleton key={ i } className="h-4" />
              )) }
              <Skeleton className="h-15 mt-4" />
            </View>
          </View>
        </View>
      </View>
    );
  }
  const Duration = ({ durationInDays }: { durationInDays?: number }) => {

    if (durationInDays && durationInDays >= 30) {
      const months = Math.round(durationInDays / 30);
      return <Text>{ t("months", { count: months }) }</Text>;
    }

    return <Text>{ t("day", { count: durationInDays }) }</Text>;
  };

  return (
    <View className=" flex-col min-h-screen w-full pb-20 bg-background">
      <Header
        title={
          MembershipName({
            name_eng: membership?.name_eng || "Membership",
            name_ru: membership?.name_ru || "Membership",
            name_uz: membership?.name_uz || "Membership",
          })
        }
        showBackButton={ "/(tabs)/profile/membership" }
      />

      <View className="px-4 py-6 w-full">
        <View style={ shadowLg }
          className="bg-white rounded-xl overflow-hidden w-full justify-between   mb-4   shadow border border-[#E4E4E7] ">
          <View className=" h-48 bg-primary flex-row items-center justify-center">
            { membership?.avatar && (
              <Image
                src={ `${process.env.EXPO_PUBLIC_BASE_URL}/files/${membership?.avatar.filename}` }
                alt={ "sadas" }
                className="w-full h-full object-cover"
              />
            ) }
            <View className="absolute  inset-0 bg-black/30 flex-row items-center justify-center">
              <Text className="text-3xl font-bold text-white">
                { MembershipName({
                  name_eng: membership?.name_eng || "",
                  name_ru: membership?.name_ru || "",
                  name_uz: membership?.name_uz || "",
                }) }
              </Text>
            </View>
          </View>

          <View className="py-4 px-5  items-center ">
            <View className=" flex-col items-center   mb-2">
              <View className=" items-center justify-center  flex-col mt-1">
                <Text className="text-2xl max-w-[300px] flex-row justify-center w-full   text-center font-bold text-foreground">
                  { MembershipName({
                    name_eng: membership?.name_eng || "",
                    name_ru: membership?.name_ru || "",
                    name_uz: membership?.name_uz || "",
                  }) }
                </Text>
                <Text className="text-muted-foreground">
                  { t("Duration") }:{ " " }
                  { Duration({
                    durationInDays: membership?.durationInDays,
                  }) }
                </Text>
              </View>
              <View className="flex-row  items-center gap-3 mt-3">
                <Text className="text-2xl max-[357px]:text-xl font-black text-primary">
                  { Number(membership?.price)?.toLocaleString()?.replace(/,/g, " ") }{ " " }
                  { t("currency") }
                </Text>
                {/* <Text className="block text-sm text-muted-foreground">
                      {Duration({ durationInDays: membership?.durationInDays })}
                      {t("perMonth")}
                    </Text> */}
              </View>
            </View>
            <View className="flex-row w-full gap-4 mb-3">
              <View className="bg-secondary/50 w-[50%] p-4 rounded-lg ">
                <Text className="text-primary font-bold text-xl mb-1">
                  { membership?.sessionLimit }
                </Text>
                <Text className="text-sm text-muted-foreground">
                  { t("Sessions") }
                </Text>
              </View>
              <View className="bg-secondary/50 w-[50%] p-4 rounded-lg ">
                <Text className="text-primary font-bold text-xl mb-1">
                  60{ membership?.sessionDurationInMinutes }
                </Text>
                <Text className="text-sm text-muted-foreground">
                  { t("MinutesPerSession") }
                </Text>
              </View>
            </View>

            <View className="gap-2 mb-8">
              <Text className="font-bold text-lg">{ t("PlanBenefits") }</Text>
              <View>
                { MembershipName({
                  name_eng: membership?.description_eng || "",
                  name_ru: membership?.description_ru || "",
                  name_uz: membership?.description_uz || "",
                })
                  ?.split(" - ")
                  .map((value, i) =>
                    value !== "" ? (
                      <View key={ i }>
                        <View className="flex-row  items-center gap-2">
                          <Zap className="w-5 h-5 text-primary " />
                          <Text className="truncate line-clamp-5 max-w-[18rem]">{ value }</Text>
                        </View>
                      </View>
                    ) : (
                      ""
                    )
                  ) }
              </View>
            </View>

            <Pressable
              className="w-full flex-row animate-bounce duration-350 bg-primary  hover:bg-primary/90  gap-2 whitespace-nowrap rounded-xl items-center justify-center  px-4 py-4 "
              onPress={ () => {
                setopenDrawerLog(!openDrawerLog);
              } }
            >
              <Text className="text-primary-foreground font-bold">
                { t("SubscribeNow") }
              </Text>
              <Zap color={ "#D5FA48" } className=" w-4 h-4" />
            </Pressable>
          </View>
        </View>
      </View>
      <Sheet
        modal
        open={ openDrawerLog }
        onOpenChange={ setopenDrawerLog }
        snapPoints={ [30] }
        dismissOnOverlayPress
        dismissOnSnapToBottom
        animation={ "medium" }
      >
        <Sheet.Handle />
        <Sheet.Overlay />
        <Sheet.Frame>
          <View className="p-6 gap-4 items-center text-center">
            <Banknote size={ 40 } color={ "#22c55e" } className="w-10 h-10 text-green-500" />
            <Text className="text-lg font-semibold">{ t("buy_question") }</Text>

            <View className="flex-row gap-3">
              <Pressable
                onPress={ () => setopenDrawerLog(false) }
                className="rounded-xl py-3 items-center justify-center border-2 border-border   px-6"
              >
                <Text className="font-bold">
                  { t("bookings.cancel") }
                </Text>
              </Pressable>
              <Pressable
                onPress={ () => {
                  subscription(id.toString());
                  setopenDrawerLog(false);
                } }
                className="rounded-xl py-3 items-center justify-center border-2 border-primary   px-6 bg-primary"
              >
                <Text className="text-primary-foreground font-bold"> { t("common.confirm") }</Text>
              </Pressable>
            </View>
          </View>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

export default MembershipInfo;
