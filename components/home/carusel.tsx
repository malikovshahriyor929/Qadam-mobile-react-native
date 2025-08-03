import React from "react";
import { View, Text, Image, Dimensions,ActivityIndicator } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useTranslation } from "react-i18next";
import { Myasxios } from "@/shared/generics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

const { width } = Dimensions.get("window");
type CarouselItem = {
  file: { filename: string };
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
  miniDescription_uz?: string;
  miniDescription_ru?: string;
  miniDescription_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  // add other fields as needed
};
export default function CarouselWithLanguage() {
  const { i18n } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["carouselData"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("access_token");
      const res = await Myasxios.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const getLocalizedText = (item: any, key: "name" | "miniDescription" | "description") => {
    const lang = i18n.language;
    if (lang === "uz") return item[`${key}_uz`];
    if (lang === "ru") return item[`${key}_ru`];
    return item[`${key}_en`];
  };

  if (isLoading || !data) {
    return (
      <View style={ { height: 240, justifyContent: "center", alignItems: "center" } }>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Carousel
      width={ width * 0.9 }
      height={ 240 }
      autoPlay
      data={ data }
      scrollAnimationDuration={ 1000 }
      autoPlayInterval={ 3000 }
      style={ { alignSelf: "center", display: data.length > 0 ? "flex" : "none" } }
      renderItem={ ({ item }: { item: CarouselItem }) => (
        <View
          style={ {
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#2A2F35",
          } }
        >
          <Image
            source={ { uri: `${process.env.EXPO_PUBLIC_BASE_URL}/files/${item.file.filename}` } }
            style={ {
              width: "100%",
              height: 140,
              resizeMode: "cover",
            } }
          />
          <View style={ { padding: 12 } }>
            <Text style={ { fontSize: 18, fontWeight: "bold", color: "white" } }>
              { getLocalizedText(item, "name") }
            </Text>
            <Text style={ { fontSize: 14, color: "#ccc", marginTop: 4 } }>
              { getLocalizedText(item, "miniDescription") }
            </Text>
            <Text style={ { fontSize: 13, color: "#aaa", marginTop: 8 } }>
              { getLocalizedText(item, "description") }
            </Text>
          </View>
        </View>
      ) }
    />
  );
}
