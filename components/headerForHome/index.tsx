import { useEffect, useState } from "react";
import { t } from "i18next";
import { userType } from "@/types";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, Myasxios } from "@/shared/generics";
import { Image, Pressable, Text, View } from "react-native";
// interface HeaderProps {
//   title: string;
//   showBackButton?: boolean;
// }

const HeaderWithProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<userType>();
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return null;
    }
    try {
      const response = await Myasxios.get("/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { populate: "balance" },
        }
      );
      setUserData(response.data);
      return response.data;
    } catch {
      return null;
    }
  };
  useEffect(() => {
    fetchData()
  }, []);
  // const handleBack = () => {
  //   if (location.pathname === "/") {
  //     return;
  //   }
  //   router.back();
  // };
  const quotes = t("quotes", { returnObjects: true }) as string[];
  const date = new Date();
  const index = date.getDate() % quotes.length;
  return (
    <View
      className="flex-row items-center justify-between h-[60px] px-4  shadow-lg bg-white !rounded-b-lg sticky top-0 z-[999] safe-top"
      style={ {
        borderBottomEndRadius: 13,
        borderBottomStartRadius: 13,
        backgroundColor: "white"
      } }
    >
      <Pressable
        onPress={ () => router.push("/profile") }
        className="flex-row items-center gap-3 bg-white"
      >
        { userData && userData?.avatarUrl !== null ? (
          <Image
            src={ `${process.env.EXPO_PUBLIC_BASE_URL}${userData?.avatarUrl}` }
            alt="asdasd"
            className="object-cover h-12 w-12 rounded-full border-2 border-gym-400 "
          />
        ) : (
          <View className="h-12 w-12 rounded-full border-2 border-gym-400 items-center justify-center">
            <Text className="uppercase !text-black ">
              { userData && userData.firstName[0] + userData.lastName[0] }
            </Text>
          </View>
        )
        }
        <View className=" gap-0">
          <View className="flex-row items-center gap-1 ">
            <Text className="text-lg font-medium ">{ t("Hey") }, </Text>
            <Text className="w-fit max-w-[260px] max-[423px]:max-w-[240px] max-[400px]:max-w-[200px] max-[380px]:max-w-[180px]  max-[370px]:max-w-[150px] max-[350px]:max-w-[150px]  truncate max-00px] text-lg font-medium  ">
              { userData?.firstName } { userData?.lastName }
            </Text>
            <Text className="text-lg font-medium max-[345px]:hidden ml-2">👋</Text>
          </View>

          <Text className="text-gray-500 w-[260px] truncate line-clamp-1">{ quotes[index] }</Text>
        </View>
      </Pressable>
      <View className="flex-row- flex-row justify-center"></View>
    </View>
  );
};

export default HeaderWithProfile;
