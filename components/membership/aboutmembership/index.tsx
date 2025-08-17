import { Myasxios } from "@/shared/generics";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { Zap, CheckCircle, Banknote } from "lucide-react-native";
import MembershipName from "../language";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MembershipType } from "@/types";
import Toast from "react-native-toast-message";
import Header from "@/components/headerforAll";
import { Image, Pressable, Text, View } from "react-native";
import { shadowLg } from "@/utils/shadow";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";
import { Sheet } from "tamagui";

const MembershipInfo = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [openDrawerLog, setopenDrawerLog] = useState(false);
  const [Id, setId] = useState(null);
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
      <View className="flex flex-col min-h-screen pb-20 bg-background">
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
    <View className="flex flex-col min-h-screen pb-20 bg-background">
      <Header
        title={
          MembershipName({
            name_eng: membership?.name_eng || "Membership",
            name_ru: membership?.name_ru || "Membership",
            name_uz: membership?.name_uz || "Membership",
          })
        }
        showBackButton={ "/(tabs)/profile" }
      />

      <View className="px-4 py-6">
        <View style={ shadowLg }
          className="bg-white rounded-xl overflow-hidden p-4 w-full justify-between items-center  mb-4   shadow border border-[#E4E4E7]">
          <View className="relative h-48 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
            { membership?.avatar && (
              <Image
                src={ `${process.env.EXPO_PUBLIC_BASE_URL}/files/${membership?.avatar.filename
                  }` }
                alt={ MembershipName({
                  name_eng: membership.name_eng,
                  name_ru: membership.name_ru,
                  name_uz: membership.name_uz,
                }) }
                className="w-full h-full object-cover"
              />
            ) }
            <View className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Text className="text-3xl font-bold text-white">
                { MembershipName({
                  name_eng: membership?.name_eng || "",
                  name_ru: membership?.name_ru || "",
                  name_uz: membership?.name_uz || "",
                }) }
              </Text>
            </View>
          </View>

          <View className="p-6">
            <View className="flex flex-col items-center   mb-4">
              <View className="flex items-center justify-center  flex-col mt-1">
                <Text className="text-2xl max-w-[300px] flex justify-center w-full   text-center font-bold text-foreground">
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
              <View className="flex  items-center gap-3 mt-3">
                <Text className="text-2xl max-[357px]:text-xl font-bold text-primary">
                  { Number(membership?.price)?.toLocaleString()?.replace(/,/g, " ") }{ " " }
                  { t("currency") }
                </Text>
                {/* <Text className="block text-sm text-muted-foreground">
                      {Duration({ durationInDays: membership?.durationInDays })}
                      {t("perMonth")}
                    </Text> */}
              </View>
            </View>
            <View className="grid grid-cols-2 max-[367px]:grid-cols-10 gap-4 mb-5">
              <View className="bg-secondary/50 p-4 rounded-lg max-[367px]:col-Text-4">
                <Text className="text-primary font-bold text-xl mb-1">
                  { membership?.sessionLimit }
                </Text>
                <Text className="text-sm text-muted-foreground">
                  { t("Sessions") }
                </Text>
              </View>
              <View className="bg-secondary/50 p-4 rounded-lg max-[367px]:col-Text-6">
                <Text className="text-primary font-bold text-xl mb-1">
                  60{ membership?.sessionDurationInMinutes }
                </Text>
                <Text className="text-sm text-muted-foreground">
                  { t("MinutesPerSession") }
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-8">
              <Text className="font-bold text-lg">{ t("PlanBenefits") }</Text>
              <View className="space-y-3">
                { MembershipName({
                  name_eng: membership?.description_eng || "",
                  name_ru: membership?.description_ru || "",
                  name_uz: membership?.description_uz || "",
                })
                  ?.split(" - ")
                  .map((value, i) =>
                    value !== "" ? (
                      <View key={ i }>
                        <View className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-primary mr-2" />
                          <Text>{ value }</Text>
                        </View>
                      </View>
                    ) : (
                      ""
                    )
                  ) }
              </View>
            </View>

            <Pressable
              onPress={ () => {
                if (membership) {
                  // setId(id);
                }
                setopenDrawerLog(!openDrawerLog);
              } }
              className="w-full animate-bounce duration-350"
            >
              <Text>
                { t("SubscribeNow") }
              </Text>
              <Zap className="ml-2 w-4 h-4" />
            </Pressable>
          </View>
        </View>
      </View>
      <Sheet open={ openDrawerLog } onOpenChange={ setopenDrawerLog } snapPoints={ [40] } >
        <Sheet.Handle />
        <Sheet.Overlay />
        <Sheet.Frame>
          <View className="p-6 flex flex-col items-center text-center space-y-4 min-h-[300px] z-[9999]">
            <Banknote color={ "#22c55e" } className="w-10 h-10 text-green-500" />
            <Text className="text-lg font-semibold">{ t("buy_question") }</Text>

            <View className="flex gap-3">
              <Pressable
                // variant="outline"
                onPress={ () => setopenDrawerLog(false) }
                className="px-6"
              >
                { t("bookings.cancel") }
              </Pressable>
              <Pressable
                onPress={ () => {
                  subscription(Id);
                  setopenDrawerLog(false);
                } }
                className="px-6"
              >
                { t("common.confirm") }
              </Pressable>
            </View>
          </View>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

export default MembershipInfo;
