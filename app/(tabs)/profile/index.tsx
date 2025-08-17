import {
  LogOut,
  CreditCard,
  Crown,
  Star,
  ChevronRight,
  Settings,
  MessageCircle,
  Eye,
  UserCog,
} from "lucide-react-native";
import { t } from "i18next";
import { Myasxios } from "@/shared/generics";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { Membership2Type, userType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Header from "@/components/headerforAll";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage, Button, Sheet } from "tamagui";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";
import PaymentType from "@/components/profile/paymentTypeDrawer";
import { shadowLg } from "@/utils/shadow";
import EmptyMembership from "@/components/membership/emptyMembershipForUser";
import EditProfile from "@/components/settings/profileEdit";
// import { LuUserCog } from "react-icons/lu";
interface Tariff {
  avatar: string;
  name_eng: string;
  name_ru: string;
  name_uz: string;
  price: string;
  sessionLimit: number;
  userCount: number;
}

interface User {
  id: number;
  firstName: string;
  phoneNumber: string;
}

export interface TariffInfoProps {
  startDate: string;
  endDate: string;
  usedSessions: number;
  tariff: Tariff;
  users: User[];
}
const Profile = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>("");
  const [role, setRole] = useState<string | null>("");
  const [userData, setUserData] = useState<userType>();
  const [EditUser, setEditUser] = useState<userType>();
  const [EditOpener, setEditOpener] = useState(false);
  const [openDrawerLog, setopenDrawerLog] = useState(false);
  const [amountForPayment, setAmountForPayment] = useState<number | string>("");
  const [openForPayment, setOpenForPayment] = useState(false);
  const [openForTypePayment, setOpenForTypePayment] = useState(false);
  const [openForAdminReq, setOpenForAdminReq] = useState(false);
  const [isOpenSelectedTarif, setIsOpenSelectedTarif] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [phoneDrawerOpen, setPhoneDrawerOpen] = useState(false);
  const [selectedTarif, setSelectedTarif] = useState<Partial<Membership2Type> | null>(null);
  // const token = Cookies.get("access_token");
  // const role = Cookies.get("role");
  const tokens = async () => {
    const access = await AsyncStorage.getItem("access_token");
    const role = await AsyncStorage.getItem("role");
    setRole(role)
    setToken(access)
  }
  useEffect(() => {
    tokens()
  }, []);
  // const role = async () => {
  //   const access = await AsyncStorage.getItem("role");
  //   console.log(access);

  //   return access?.toString()
  // }
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (token == null) {
        router.push("/auth/login");
        return null;
      }
      try {
        const response = await Myasxios.get(
          process.env.EXPO_PUBLIC_BASE_URL + "/users/me",
          {
            params: { populate: "balance" },
          }
        );
        return response.data;
      } catch (error) {
        return null;
      }
    },
    // retry: false,
    // enabled: !!token,
  });
  useEffect(() => {
    if (data) {
      setUserData(data);
      refetch();
    }
  }, [data, refetch]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await Myasxios.patch("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Toast.show({
        type: "success",
        text1: (t("avatar_updated"))
      })
      if (userData) {
        setUserData({
          ...userData,
          avatarUrl: response.data.url,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: (t("upload_failed"))
      })
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload(file);
    }
  };
  const handleLogout = async () => {
    Toast.show({
      type: "success",
      text1: (t("logout"))
    })
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("role");
    router.push("/auth/login");
  };
  const { data: memberfip, refetch: refetchMemberShip } = useQuery({
    queryKey: ["memberfip"],
    queryFn: async () =>
      axios
        .get(`${process.env.EXPO_PUBLIC_BASE_URL}/tariffs/my-tariffs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data.data),
  });

  // const {} = useQuery({
  //   queryKey: ["paymanet"],
  //   queryFn: async () =>

  // });

  return (
    <View className="relative h-screen bg-[#F9F8FB] ">
      <Header title={ t("profile") } />
      <ScrollView contentContainerStyle={ {
        paddingBottom: 120
      } }>
        <View className=" flex-col  bg-[#F9F8FB]">
          <View className="px-4 py-4">
            {/* profile */ }
            { !isLoading ? (
              <View className="flex-row items-center mb-6">
                {/* <input
              type="file"
              ref={ fileInputRef }
              onChange={ handleFileChange }
              accept="image/*"
              className="hidden"
            /> */}
                {/* <Avatar
              onPress={ () => fileInputRef.current?.click() }
              className=""
            > */}
                { userData?.avatarUrl ? (
                  <Image
                    src={ `${process.env.EXPO_PUBLIC_BASE_URL}${userData.avatarUrl}` }
                    alt="User profile picture"
                    className="object-cover h-20 w-20 border-2 rounded-full border-gym-400"
                  />
                )
                  : (
                    <View className="flex items-center h-20 w-20 justify-center rounded-full border ">
                      <Text className="text-center">
                        { (userData?.firstName?.[0] || "").toUpperCase() }
                        { (userData?.lastName?.[0] || "").toUpperCase() }
                      </Text>
                    </View>
                  )
                }
                <View className="ml-4 max-[334px]:ml-2">
                  <Text className="text-xl font-semibold max-[360px]:text-lg">
                    { userData?.firstName + " " + userData?.lastName }
                  </Text>
                  <Text className="text-muted-foreground">
                    { userData?.phoneNumber }
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center mb-6">
                <Skeleton className="size-[64px] rounded-[100%] bg-black/20" />

                <View className="ml-4 max-[334px]:ml-2 w-[70%] gap-2">
                  <Skeleton className="!w-[80%] bg-black/20 h-5 !rounded-[12px] " />
                  <Skeleton className="w-[65%] bg-black/20 h-4 !rounded-[12px] " />
                </View>
              </View>
            ) }
            { userData && !isLoading ? (
              <View style={ shadowLg } className="bg-white rounded-xl p-4 mb-4 max-[350px]:p-3 shadow border border-[#E4E4E7]">
                <View className="flex-row items-center">
                  <View className="items-center justify-center  h-12 w-12 max-[350px]:size-9 max-[350px]:mr-2  bg-primary/90  text-primary-foreground rounded-full mr-3">
                    <CreditCard color={ "#D5FA48" } />
                  </View>
                  <View>
                    <Text className="text-[14px] font-medium text-gray-600">
                      { t("availableBalance") }
                    </Text>

                    <View className="flex-row gap-1 items-end">
                      <Text className="text-[18px] font-black">
                        { Number(userData?.balance?.amount)
                          .toLocaleString()
                          .replace(",", " ")
                          .replace(",", " ")
                          .replace(",", " ") }
                      </Text>
                      <Text className="text-[18px] font-bold">
                        { t("currency") }
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={ () => setOpenForTypePayment(true) }
                    className="ml-auto  p-2 px-3 rounded-xl bg-[#F9F8FB] border border-[#E4E4E7] "
                  >
                    <Text className="text-[16px]">
                      { t("addFunds") }
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={ shadowLg } className="bg-white rounded-xl p-4 mb-4 max-[350px]:p-3 shadow border border-[#E4E4E7]">
                <View className="flex-row items-center">
                  <View className="items-center justify-center  h-12 w-12 max-[350px]:size-9 max-[350px]:mr-2  bg-primary/90  text-primary-foreground rounded-full mr-3">
                    <CreditCard color={ "#D5FA48" } />
                  </View>
                  <View>
                    <Text className="text-[14px] font-medium text-gray-600">
                      { t("availableBalance") }
                    </Text>

                    <View className="flex-row gap-1 items-end">
                      <Skeleton className="w-28 h-5 rounded-xl " />
                      <Text className="text-[18px] font-bold">
                        { t("currency") }
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    className="ml-auto  p-2 px-3 rounded-xl bg-[#F9F8FB] border border-[#E4E4E7] "
                  >
                    <Text className="text-[16px]">
                      { t("addFunds") }
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) }
            {/* settings */ }
            <View style={ shadowLg } className="bg-white rounded-xl p-2 mb-4  shadow border border-[#E4E4E7]">
              <Pressable
                onPress={ () => router.push("/(tabs)/profile/setting") }
                className="flex-row items-center justify-between w-full rounded-[12px] p-2 "
              >
                <View className="flex-row items-center gap-2">
                  <Settings />
                  <Text className="text-lg font-medium ">{ t("settings") }</Text>
                </View>
                <ChevronRight />
              </Pressable>
            </View>
            {/* sendRequest */ }
            {/* <View className="  mb-4 p-3 rounded-[12px] hidden">
              <View className="flex-row items-center p-3">
                <Pressable
                  onPress={ () => setOpenForAdminReq(!openForAdminReq) }
                  className="flex-row items-center justify-between w-full "
                >
                  <View className="flex-row items-center gap-2">
                    <UserCog size={ 20 } />
                    <Text className="text-lg font-medium ">{ t("sendRequest") }</Text>
                  </View>
                  <ChevronRight />
                </Pressable>
              </View>
            </View> */}
            {/* contact_with_admin */ }
            { role == "user" && (
              <View style={ shadowLg } className="bg-white rounded-xl p-2 mb-4 shadow border border-[#E4E4E7]  ">
                <Pressable
                  onPress={ () => router.push("/(tabs)/profile/chat") }
                  className="flex-row items-center justify-between w-full cursor-pointer p-2 "
                >
                  <View className="flex-row items-center gap-2">
                    <MessageCircle size={ 20 } />
                    <Text className="text-lg font-medium ">
                      { t("contact_with_admin") }
                    </Text>
                  </View>
                  <ChevronRight />
                </Pressable>
              </View>
            ) }
            <View className="bg-white rounded-xl p-4 mb-4  shadow border border-[#E4E4E7]">
              <View style={ shadowLg } className="flex-row items-center mb-3  justify-between">
                <Text className="font-semibold ">{ t("memberships") }</Text>
                <Pressable onPress={ () => router.push("/(tabs)/profile/membership") }>
                  <View className="pb-2">
                    <Text className="font-semibold  text-[14px] text-primary">
                      { t("allMemberships") }
                    </Text>
                  </View>
                </Pressable>
              </View>
              { memberfip?.length ? (
                <View className="gap-3">
                  { memberfip.map((myMembership: Membership2Type, index: number) => {
                    const remainingSessions =
                      myMembership.tariff.sessionLimit - myMembership.usedSessions;
                    const isActive = new Date(myMembership.endDate) > new Date();
                    const isPremium = myMembership?.tariff?.name_uz
                      ?.toLowerCase()
                      ?.includes("premium");
                    const isExpiringSoon =
                      isActive &&
                      new Date(myMembership.endDate).getTime() - Date.now() <
                      3 * 24 * 60 * 60 * 1000;
                    const endDate = new Date(myMembership.endDate);
                    const now = new Date();
                    const isExpired = endDate < now;

                    return (
                      <Pressable
                        onPress={ () => setSelectedTarif(myMembership) }
                        key={ index }
                        className={ ` flex flex-col justify-between p-3 rounded-xl border
                         ${isActive
                            ? isPremium
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                          }
                         `}
                      >
                        <View className="flex-row items-center gap-3">
                          <View
                            className={ `p-2 rounded-xl
                              ${isActive
                                ? isPremium
                                  ? "bg-yellow-100 border border-yellow-300"
                                  : "bg-blue-100"
                                : "bg-gray-200"
                              }  ` }
                          >
                            { isPremium ? (
                              <Crown color={ "#a16207" } className="w-6 h-6 text-yellow-700" />
                            ) : (
                              <Star
                                color={ isActive ? "#2563eb" : "#6b7280" }
                                className={ `w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"
                                  }` }
                              />
                            ) }
                          </View>

                          <View>
                            <View className="flex-row items-center gap-2">
                              <Text
                                className={ `
                               font-medium 
                              ${isActive
                                    ? isPremium
                                      ? "text-yellow-500"
                                      : "text-blue-800"
                                    : "text-gray-600"
                                  }
                            `}
                              >
                                { myMembership?.tariff?.name_uz ||
                                  t("myMembershipPlan") }
                              </Text>
                              { isExpiringSoon && (
                                <Text className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                  { t("expiringSoon") }
                                </Text>
                              ) }
                            </View>

                            <View className="flex-row items-center gap-2 mt-1">
                              <View className="w-20 bg-gray-200 rounded-full h-1.5">
                                <View
                                  className={ ` h-1.5 rounded-full 
                                ${remainingSessions >
                                      myMembership.tariff.sessionLimit * 0.3
                                      ? isPremium
                                        ? "bg-yellow-500"
                                        : "bg-blue-500"
                                      : "bg-red-500"
                                    }
                                ${myMembership.tariff.sessionLimit >= 10 &&
                                    "!bg-green-500"
                                    } ${(remainingSessions /
                                      myMembership.tariff.sessionLimit) *
                                    100 ==
                                    0 && "!bg-red-500"
                                    }
                              `}
                                  style={ {
                                    width: `${Math.min(
                                      100,
                                      (remainingSessions /
                                        myMembership.tariff.sessionLimit) *
                                      100
                                    )}%`,
                                  } }
                                />
                              </View>
                              <Text
                                className={ `
                               text-xs sm:text-sm 
                              ${isActive
                                    ? isPremium
                                      ? "text-yellow-600"
                                      : "text-blue-600"
                                    : "text-gray-500"
                                  }
                            `}
                              >
                                { remainingSessions }/
                                { myMembership.tariff.sessionLimit } { t("sessions") }
                              </Text>
                            </View>

                            <View className="flex-row items-center justify-between">
                              <Text
                                className={ `
                            text-xs mt-1 
                          ${isActive
                                    ? isPremium
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                                    : "text-gray-400"
                                  }
                          `}
                              >
                                { isActive ? (
                                  <Text>
                                    { t("activeUntil") }{ " " }
                                    { new Date(
                                      myMembership.endDate
                                    ).toLocaleDateString() }
                                  </Text>
                                ) : (
                                  <Text>
                                    { t("expiredOn") }{ " " }
                                    { new Date(
                                      myMembership.endDate
                                    ).toLocaleDateString() }
                                  </Text>
                                ) }
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          className={ `flex-row items-center gap-3 ${isExpired && "hidden"
                            } ${myMembership.tariff.userCount > 1 ? "flex" : "hidden"
                            } 
                    
                      `}
                        >
                          <Pressable
                            onPress={ () => {
                              setPhoneDrawerOpen(true);
                              setSelectedUser(myMembership.id);
                            } }
                            className="w-full disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={
                              !memberfip?.some(
                                (value: Membership2Type) => value.tariff.userCount > 1
                              ) ||
                              myMembership.tariff.userCount -
                              myMembership.users.length <=
                              0
                            }
                          >
                            <Text>
                              { t("inviteFriend") }
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={ () => setIsOpenSelectedTarif(true) }
                            className=""
                          >
                            <Eye size={ 20 } className="*:size-10" />
                          </Pressable>
                        </View>
                      </Pressable>
                    );
                  }) }
                </View>
              ) : (
                <EmptyMembership />
              ) }
            </View>

            <Pressable
              className=" flex-row items-center w-full gap-3 p-3 mt-3 text-destructive hover:bg-muted rounded-lg"
              onPress={ () => setopenDrawerLog(!openDrawerLog) } >
              <LogOut color={ "#ef4444" } className="w-5 h-5 mr-3" />
              <Text className="text-red-500 text-lg">{ t("signOut") }</Text>
            </Pressable>
          </View>
          {/* logout */ }
          <Sheet
            modal
            open={ openDrawerLog }
            onOpenChange={ setopenDrawerLog }
            snapPoints={ [35] }
            dismissOnSnapToBottom
            animation="medium"
          >
            <Sheet.Overlay />
            <Sheet.Handle />

            <Sheet.Frame className="items-center justify-center p-6 space-y-4">
              <View className="flex items-center justify-center p-6 h-full mb-2 gap-1">
                <LogOut size={ 40 } color="red" />
                <Text className="text-lg font-semibold">{ t("logout_title") }</Text>
                <Text className="text- text-gray-500 text-center">
                  { t("logout_description") }
                </Text>

                <View className="flex-row gap-3 mt-4">
                  <Pressable
                    onPress={ () => setopenDrawerLog(false) }
                    className="px-6 py-4 rounded-xl border  border-[#E4E4E7]"
                  >
                    <Text className="text-[14px]">
                      { t("bookings.cancel") }
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={ () => {
                      handleLogout()
                      setopenDrawerLog(false)
                    } }
                    className="px-6 py-4 rounded-xl bg-red-500 "
                  >
                    <Text className=" text-white text-[14px]">
                      { t("logout2") }
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Sheet.Frame>
          </Sheet>
          {/* <EditProfile
           setEditOpener={ setEditOpener }
           EditOpener={ EditOpener }
           setEditUser={ setEditUser }
           EditUser={ EditUser }
           refetch={ refetch }
         /> */}
          {/*
          <InputDrawerForAdmin
            setOpenForAdminReq={ setOpenForAdminReq }
            openForAdminReq={ openForAdminReq }
          />
          <InviteDrawer
            data={ memberfip }
            selectedUser={ selectedUser }
            phoneDrawerOpen={ phoneDrawerOpen }
            refetchMemberShip={ refetchMemberShip }
            setPhoneDrawerOpen={ setPhoneDrawerOpen }
          />
          <TariffDrawer
            data={ selectedTarif }
            isOpenSelectedTarif={ isOpenSelectedTarif }
            setIsOpenSelectedTarif={ setIsOpenSelectedTarif }
          /> 
          */}
          <PaymentType
            setAmountForPayment={ setAmountForPayment }
            amountForPayment={ amountForPayment }
            setOpenForPayment={ setOpenForPayment }
            openForPayment={ openForPayment }
            setOpenForTypePayment={ setOpenForTypePayment }
            openForTypePayment={ openForTypePayment }
          />
        </View>
      </ScrollView>

    </View>
  );
};

export default Profile;
