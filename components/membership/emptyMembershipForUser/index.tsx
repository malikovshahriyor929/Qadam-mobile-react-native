
import { Zap, Lock } from "lucide-react-native";
import { t } from "i18next";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const EmptyMembership = () => {
  const router = useRouter();

  return (
    <View className=" flex-col items-center justify-center ">
      <View className="w-full text-center rounded-xl p-4">
        <View className="mx-auto flex-row h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-3">
          <Lock color={ "#dc2626" } className="h-5 w-5 text-red-600" />
        </View>
        <Text className="text-center text-lg font-bold text-foreground ">
          { t("membership.noMembership") }
        </Text>
        <Text className="text-md text-center text-gray-500 mb-4 leading-tight">
          { t("membership.subscribePrompt") }
        </Text>
        <View className="gap-2 mb-4">
          <View className="flex-row items-start gap-3 ">
            <Zap color={ "#2A2F35" } size={ 20 } className="mt-0.5  flex-shrink-0" />
            <Text className="text-xs text-left leading-tight">
              { t("membership.benefits.allPods") }
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Zap color={ "#2A2F35" } size={ 20 } className="mt-0.5  flex-shrink-0" />
            <Text className="text-xs text-left leading-tight">
              { t("membership.benefits.priorityBooking") }
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Zap color={ "#2A2F35" } size={ 20 } className="mt-0.5  flex-shrink-0" />
            <Text className="text-xs text-left leading-tight">
              { t("membership.benefits.perks") }
            </Text>
          </View>
        </View>
        <Pressable
          className="bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4"
          onPress={ () => router.push("/(tabs)/profile/membership") }
        >
          <Text className="text-primary-foreground font-bold">
            { t("membership.viewPlans") }
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EmptyMembership;
