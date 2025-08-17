import { Myasxios } from "@/shared/generics";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import {
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Lock,
  Banknote,
} from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Pressable, ScrollView, Text, View } from "react-native";
import { shadowLg } from "@/utils/shadow";
import { MembershipType } from "@/types";
import { Sheet } from "tamagui";
import Header from "@/components/headerforAll";
import MembershipName from "@/components/language";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";


const Membership = () => {
  const router = useRouter();
  const [openDrawerLog, setopenDrawerLog] = useState(false);
  const [Id, setId] = useState<number | null>(null);
  const { data: memberships, isLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: async () => Myasxios.get("/tariffs").then((res) => res.data.data),
  });

  const subscription = async (id: string | number | null) => {
    await Myasxios.post("/tariffs/subscribe", {
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
  const handleNavigateToInfo = (id: number) => {
    // router.push({ pathname: `/(tabs)/profile/membership/[id]`, params: { id } });
    router.push(`/(tabs)/profile/membership/${id}`)
  };
  const Duration = ({ durationInDays }: { durationInDays: number }) => {
    if (durationInDays >= 30) {
      const months = Math.round(durationInDays / 30);
      return <Text>{ t("months", { count: months }) }</Text>;
    }

    return <Text>{ t("day", { count: durationInDays }) }</Text>;
  };

  if (memberships?.length == 0) {
    return (
      <View className="flex flex-col min-h-screen pb-20 bg-background">
        <Header title={ t("MembershipPlans") } showBackButton={ "/(tabs)/profile" } />
        <View className="flex-1 flex flex-col items-center justify-center px-4">
          <View style={ shadowLg }
            className="bg-white rounded-xl p-4 w-full justify-between items-center  mb-4   shadow border border-[#E4E4E7]">
            <View className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </View>

            <Text className="text-lg font-bold text-foreground mb-2">
              { t("NoPlansAvailable") }
            </Text>

            <Text className="text-sm text-muted-foreground mb-6">
              { t("CheckBackLaterForNewPlans") }
            </Text>

            <View className="space-y-4 mb-6">
              <View className="flex items-start">
                <Zap className="h-4 w-4 text-primary mt-0.5  flex-shrink-0" />
                <Text className="text-sm text-left">
                  { t("ExcitingNewPlansComingSoon") }
                </Text>
              </View>
              <View className="flex items-start">
                <Zap className="h-4 w-4 text-primary mt-0.5  flex-shrink-0" />
                <Text className="text-sm text-left">
                  { t("SubscribeForExclusiveBenefits") }
                </Text>
              </View>
            </View>

            <Pressable
              className="w-full"
              onPress={ () => router.push("/(tabs)") }
            >
              <Text>
                { t("ReturnHome") }
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View className="flex flex-col min-h-screen pb-20 bg-background">
      <Header title={ t("MembershipPlans") } showBackButton={ "/(tabs)/profile" } />

      <ScrollView className="flex-1 mb-10  ">
        <View className="px-4 py-6 space-y-6">
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">
              { t("ChooseYourPlan") }
            </Text>
            <Text className="text-muted-foreground">
              { t("SelectThePerfectPlanForYourFitnessJourney") }
            </Text>
          </View>

          <View>
            { !isLoading ? memberships?.map((membership: MembershipType) => {
              return (
                <View
                  key={ membership.id }
                  style={ shadowLg }
                  className={ `relative border-2 border-primary p-3 transition-all 
                    bg-white rounded-xl w-full justify-between items-center  mb-4 shadow `}
                >
                  <View className="p-2 w-full">
                    <View className="flex flex-col items-center   mb-4">
                      <View className="flex items-center justify-center  flex-col mt-1">
                        <Text className="text-2xl max-w-[300px] flex justify-center w-full   text-center font-bold text-foreground">
                          { MembershipName({
                            name_eng: membership.name_eng,
                            name_ru: membership.name_ru,
                            name_uz: membership.name_uz,
                          }) }
                        </Text>
                        <Text className="text-muted-foreground">
                          { t("Duration") }:
                          { Duration({
                            durationInDays: membership?.durationInDays,
                          }) }
                        </Text>
                      </View>
                      <View className="flex  items-center gap-3 mt-3">
                        <Text className="text-2xl max-[357px]:text-xl font-bold text-primary">
                          { Number(membership.price)
                            .toLocaleString()
                            .replace(/,/g, " ") }
                          <Text className="text-2xl max-[357px]:text-xl font-bold text-primary">
                            { t("currency") }
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <View className="mb-6 gap-3 ">
                      <View className="flex-row gap-2">
                        <CheckCircle className="w-5 h-5 text-primary " />
                        <Text className="font-bold text-[16px]">{ membership.sessionLimit }</Text>
                        <Text className="font-bold text-[16px]">
                          { t("sessions") } { t("days2") }
                        </Text>
                        <Text className="font-bold text-[16px]"> { membership.durationInDays }</Text>
                        <Text className="font-bold text-[16px]">
                          { t("days") }
                        </Text>
                      </View>
                      <View className="flex-row  gap-2">
                        <Clock className="w-5 h-5 text-primary " />
                        <Text className="font-bold text-[16px]">
                          60 { membership.sessionDurationInMinutes }
                        </Text>
                        <Text className="font-bold text-[16px]">
                          { t("minutes") + " " + t("perSession") }
                        </Text>
                      </View>

                      <View>
                        { MembershipName({
                          name_eng: membership.description_eng,
                          name_ru: membership.description_ru,
                          name_uz: membership.description_uz,
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
                    <View className="flex-row gap-2 ">
                      <Pressable
                        className=" bg-primary flex-row w-[60%] px-4 py-3 rounded-xl items-center justify-center gap-2  text-white"
                        onPress={ () => {
                          setId(membership.id);
                          setopenDrawerLog(!openDrawerLog);
                        } }
                      >
                        <Text className="text-primary-foreground font-bold text-[14px]">
                          { t("GetStarted") }
                        </Text>
                        <Zap color={ "#D5FA48" } className=" w-4 h-4" />
                      </Pressable>
                      <Pressable
                        className=" flex-row rounded-xl w-[40%] px-3 py-2 items-center justify-center gap-2 bg-primary"
                        onPress={ () => handleNavigateToInfo(membership.id) }
                      >
                        <Text className="text-primary-foreground font-bold text-[14px]">
                          { t("LearnMore") }
                        </Text>
                        <ArrowRight color={ "#D5FA48" } className=" w-3 h-3 max-[377px]:hidden" />
                      </Pressable>
                    </View>
                  </View>

                  { MembershipName({
                    name_eng: membership.name_eng,
                    name_ru: membership.name_ru,
                    name_uz: membership.name_uz,
                  })?.includes("Premium") && (
                      <View className="bg-gradient-to-r from-primary/10 to-primary/5 py-2 px-6 text-center text-sm text-primary">
                        <Text>
                          { t("SpecialOffer") } - { t("Save20Percent") }
                        </Text>
                      </View>
                    ) }
                </View>
              );
            }) :
              <View className=" py-5 gap-4">
                { [...Array(4)].map((_, i) => (
                  <View key={ i }
                    style={ shadowLg }
                    className="bg-white rounded-xl p-4 py-8 w-full justify-between   mb-4   shadow border border-[#E4E4E7]">
                    <View className="flex items-center justify-between mb-3 gap-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-8 w-20" />
                    </View>
                    <View className="gap-4 mb-6 items-start">
                      { [...Array(4)].map((_, j) => (
                        <View key={ j } className="flex-row items-center">
                          <Skeleton className="h-6 w-6 rounded-full mr-2" />
                          <Skeleton className="h-6 w-40" />
                        </View>
                      )) }
                    </View>
                    <View className="flex-row gap-2">
                      <Skeleton className="h-10 w-[60%]" />
                      <Skeleton className="h-10 w-[40%]" />
                    </View>
                  </View>
                )) }
              </View> }
          </View>
        </View>
      </ScrollView>
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
                  subscription(Id);
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

export default Membership;
