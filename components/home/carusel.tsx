// import React from "react";
// import { View, Text, Image, Dimensions } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import { useTranslation } from "react-i18next";
// import { Myasxios } from "@/shared/generics";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useQuery } from "@tanstack/react-query";
// import { GymPodCardSkeleton } from "../location/gymPodCard/skeleton";

// const { width } = Dimensions.get("window");
// type CarouselItem = {
//   file: { filename: string };
//   name_uz?: string;
//   name_ru?: string;
//   name_en?: string;
//   miniDescription_uz?: string;
//   miniDescription_ru?: string;
//   miniDescription_en?: string;
//   description_uz?: string;
//   description_ru?: string;
//   description_en?: string;
//   // add other fields as needed
// };
// export default function CarouselWithLanguage() {
//   const { i18n } = useTranslation();

//   const { data, isLoading } = useQuery({
//     queryKey: ["carouselData"],
//     queryFn: async () => {
//       const token = await AsyncStorage.getItem("access_token");
//       const res = await Myasxios.get("/posts", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data;
//     },
//   });

//   const getLocalizedText = (item: any, key: "name" | "miniDescription" | "description") => {
//     const lang = i18n.language;
//     if (lang === "uz") return item[`${key}_uz`];
//     if (lang === "ru") return item[`${key}_ru`];
//     return item[`${key}_en`];
//   };

//   if (isLoading || !data) {
//     return (
//       <View
//         className="w-full mt-4 "
//       >
//         <GymPodCardSkeleton />
//       </View>
//     );
//   }

//   return (
//     <Carousel
//       width={ width * 0.9 }
//       height={ 240 }
//       autoPlay
//       data={ data }
//       scrollAnimationDuration={ 1000 }
//       autoPlayInterval={ 3000 }
//       style={ { alignSelf: "center", display: data?.length > 0 ? "flex" : "none" } }
//       renderItem={ ({ item }: { item: CarouselItem }) => (
//         <View
//           style={ {
//             borderRadius: 16,
//             overflow: "hidden",
//             backgroundColor: "#2A2F35",
//           } }
//         >
//           <Image
//             source={ { uri: `${process.env.EXPO_PUBLIC_BASE_URL}/files/${item.file.filename}` } }
//             style={ {
//               width: "100%",
//               height: 140,
//               resizeMode: "cover",
//             } }
//           />
//           <View style={ { padding: 12 } }>
//             <Text style={ { fontSize: 18, fontWeight: "bold", color: "white" } }>
//               { getLocalizedText(item, "name") }
//             </Text>
//             <Text style={ { fontSize: 14, color: "#ccc", marginTop: 4 } }>
//               { getLocalizedText(item, "miniDescription") }
//             </Text>
//             <Text style={ { fontSize: 13, color: "#aaa", marginTop: 8 } }>
//               { getLocalizedText(item, "description") }
//             </Text>
//           </View>
//         </View>
//       ) }
//     />
//   );
// }

import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { useTranslation } from "react-i18next";
import { Myasxios } from "@/shared/generics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { GymPodCardSkeleton, Skeleton } from "../location/gymPodCard/skeleton";
import { shadowLg } from "@/utils/shadow";

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
      <View style={ styles.wrapper }>
        <View
          style={ shadowLg }
          className="  border-none shadow bg-white p-3 rounded-2xl  w-full"
        >
          <View className="relative w-full h-40 mb-3 rounded-xl overflow-hidden">
            <Skeleton className="w-full h-full animate-pulse" />
          </View>
        </View>
      </View>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <View style={ styles.wrapper }>
      <Swiper
        style={ styles.swiper }
        height={ 240 }
        width={ width * 0.9 }
        autoplay
        autoplayTimeout={ 3 }
        showsPagination
        dotStyle={ styles.dot }
        activeDotStyle={ styles.activeDot }
        paginationStyle={ styles.pagination }
        loop
      >
        { data.map((item: CarouselItem, idx: number) => (
          <View key={ idx } style={ styles.slide }>
            <Image
              source={ { uri: `${process.env.EXPO_PUBLIC_BASE_URL}/files/${item.file.filename}` } }
              style={ styles.image }
            />
            <View style={ styles.content }>
              <Text style={ styles.title }>{ getLocalizedText(item, "name") }</Text>
              <Text style={ styles.subtitle }>{ getLocalizedText(item, "miniDescription") }</Text>
              <Text style={ styles.desc }>{ getLocalizedText(item, "description") }</Text>
            </View>
          </View>
        )) }
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 12,
    alignItems: "center",
  },
  swiper: {
    // center the swiper; width is set on container below
  },
  slide: {
    width: width * 0.9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2A2F35",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    backgroundColor: "#222",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  desc: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 8,
  },
  pagination: {
    bottom: 6,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
