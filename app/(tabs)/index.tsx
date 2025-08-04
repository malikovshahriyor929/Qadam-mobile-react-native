import HeaderWithProfile from '@/components/headerForHome';
import CarouselWithLanguage from '@/components/home/carusel';
import Location from '@/components/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { t } from 'i18next';
import { Info } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';


const Mainpage = () => {
  const router = useRouter();
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const lang = await AsyncStorage.getItem('language');
      console.log("TOKEN: ", token);
      if (!lang) {
        router.push("/auth/language")
      }
      if (!token && router) {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Failed to get access token:', error);
    }
  };
  const fn = async () => {
    await AsyncStorage.removeItem("access_token")
    checkToken()
  }
  const fnl = async () => {
    await AsyncStorage.removeItem("language")
    checkToken()
  }

  const fnt = () => {
    Toast.show({
      type: "success",
      text1: "This is a hot-toast style message 🎉sdasdasdasdasd",
      autoHide: true
    })
    // Toast.show({
    //   type: "info",
    //   text1: "salom",
    //   autoHide: true
    // })
    // Toast.show({
    //   type: "error",
    //   text1: "error",
    //   autoHide: false,
    // })
  }

  useEffect(() => {
    checkToken();
  }, []);




  return (
    <View className='bg-white'>
      <HeaderWithProfile />
      <ScrollView
        className=' px-4  bg-white'
        contentContainerStyle={ {
          paddingBottom: 150,
        } }>
        <Link href={ "/explore" }>
          <View className="w-full">
            <CarouselWithLanguage />
          </View>
        </Link>
        <View className='mt-3'>
          <Text className="font-semibold text-lg mb-3">{ t("home.nearby_pods") }</Text>
          <View className="mb-6">
            <Location />
          </View>
        </View>
        <View className="border border-gray-100  shadow-lg bg-white p-4 rounded-2xl ">
          <View className="">
            <View className=" flex-row items-center gap-2 mb-3">
              <Info size={ 20 } color={ "#2A2F35" } />
              <Text className="font-semibold text-lg">
                { t("home.about_gympod") }
              </Text>
            </View>
            <Text className=" text-[14px]  text-[#71717a] ">
              { t("home.desc1") }
            </Text>
          </View>
        </View>
        <Pressable onPress={ () => fn() }>
          <Text>
            clear local
          </Text>
        </Pressable>
        <Pressable onPress={ () => fnl() }>
          <Text>
            clear langaueg
          </Text>
        </Pressable>
        <Pressable onPress={ () => fnt() }>
          <Text>
            clear langaueg
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

export default Mainpage