import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

export const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <View className="max-w-[450px] h-full w-full mx-auto px-4 pt-2 space-y-2 bg-white">
      <Pressable className="p-3 mt-10">
        <Link href={"/auth/login"}>
          <ArrowLeft />
        </Link>
      </Pressable>

      <View className="rounded-2xl">
        <View className="p-4 text-sm">
          <Text className="text-lg font-semibold mb-2">{t("terms.title")}</Text>
          <View className="space-y-2 list-decimal list-inside text-muted-foreground">
            {Array.from({ length: 9 }).map((_, idx) => (
              <Text key={idx}>{t(`terms.items.${idx + 1}`)}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TermsAndConditions;
