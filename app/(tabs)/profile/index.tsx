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
import { useRouter } from "expo-router";
import { Membership2Type, userType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Header from "@/components/headerforAll";
import { Image, Pressable, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage, Button } from "tamagui";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";
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
  const token = async () => {
    const access = await AsyncStorage.getItem("access_token");
    return access?.toString()
  }
  const role = async () => {
    const access = await AsyncStorage.getItem("role");
    console.log(access);

    return access?.toString()
  }
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token()) {
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
    await AsyncStorage.removeItem("user");
    router.push("/auth/login");
  };
  const { data: memberfip, refetch: refetchMemberShip } = useQuery({
    queryKey: ["memberfip"],
    queryFn: async () =>
      axios
        .get(`${process.env.EXPO_PUBLIC_BASE_URL}/tariffs/my-tariffs`, {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        })
        .then((res) => res.data.data),
  });

  // const {} = useQuery({
  //   queryKey: ["paymanet"],
  //   queryFn: async () =>

  // });
  console.log(userData);


  return (
    <View className=" flex-col min-h-screen pb-20">
      <Header title={ t("profile") } />

      <View className="px-4 py-4">
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
            {/* </Avatar> */ }

            <View className="ml-4 max-[334px]:ml-2">
              { userData ? (
                <>
                  <Text className="text-xl font-semibold max-[360px]:text-lg">
                    { userData?.firstName + " " + userData?.lastName }
                  </Text>
                  <Text className="text-muted-foreground">
                    { userData?.phoneNumber }
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-xl font-semibold">
                    <Skeleton className="w-full h-4 rounded-xl" />
                  </Text>
                  <Text className="text-muted-foreground">
                    {/* { userData } */ }
                  </Text>
                </>
              ) }
            </View>
          </View>
        ) : (
          <>
            <View className="flex-row items-center mb-6">
              <Avatar className="h-16 w-16 border-2 border-gym-400">
                <AvatarFallback>
                  <Skeleton className="size-16 bg-black/20" />
                </AvatarFallback>
              </Avatar>

              <View className="ml-4 max-[334px]:ml-2 w-[70%] space-y-2">
                <Skeleton className="!w-[80%] bg-black/20 h-5 !rounded-lg " />
                <Skeleton className="w-[65%] bg-black/20 h-3 !rounded-lg " />
              </View>
            </View>
          </>
        ) }
        { userData && !isLoading ? (
          <View className="bg-white rounded-xl p-4 mb-4 max-[350px]:p-3 shadow-sm border border-border">
            <View className="flex-row items-center">
              <CreditCard className="h-10 w-10 max-[350px]:size-9 max-[350px]:mr-2 p-2 bg-primary/90  text-primary-foreground rounded-full mr-3" />
              <View>
                <Text className="text-sm text-muted-foreground">
                  <Text className="max-[355px]:hidden">
                    { t("availableBalance") }
                  </Text>
                  <Text className="hidden max-[355px]:flex">
                    { " " }
                    { t("availableBalance2") }
                  </Text>
                </Text>

                <Text className="text-[20px] font-bold max-[422px]:text-lg max-[370px]:text-[15px] ">
                  { Number(userData?.balance?.amount)
                    .toLocaleString()
                    .replace(",", " ")
                    .replace(",", " ")
                    .replace(",", " ") }{ " " }
                  { t("currency") }
                </Text>
              </View>
              <Pressable
                onPress={ () => setOpenForTypePayment(true) }
                className="ml-auto max-[370px]:!py-0.5 max-[370px]:px-2 border border-gray-400 "
              >
                <Text>
                  { t("addFunds") }
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-border">
            <View className="flex-row items-center">
              <CreditCard className="h-10 w-10 p-2 bg-gym-400 text-primary-foreground rounded-full mr-2" />
              <View>
                <View className="text-sm text-muted-foreground">
                  <Text className="max-[355px]:hidden">
                    { t("availableBalance") }
                  </Text>
                  <Text className="hidden max-[355px]:flex">
                    { t("availableBalance2") }
                  </Text>
                </View>
                <View className="text-lg font-bold flex-row items-center gap-1">
                  <Skeleton className="h-6 w-14 bg-black/30" /> { t("currency") }
                </View>
              </View>
              <Button variant="outlined" size="sm" className="ml-auto">
                { t("addFunds") }
              </Button>
            </View>
          </View>
        ) }
        {/* settings */ }
        <View className="mb-4 p-3 rounded-xl border ">
          <View className="flex-row items-center p-3">
            <Pressable
              onPress={ () => router.push("/(tabs)/profile/setting/index") }
              className="flex-row items-center justify-between w-full rounded-[12px] p-2 "
            >
              <View className="flex-row items-center gap-2">
                <Settings />
                <Text className="text-lg font-medium ">{ t("settings") }</Text>
              </View>
              <ChevronRight />
            </Pressable>
          </View>
        </View>
        {/* sendRequest */ }
        <View className="mb-4 p-3 rounded-[12px] hidden">
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
        </View>
        {/* contact_with_admin */ }
        {/* { role == "user" && ( */ }
        <View className="mb-4 p-2 rounded-[12px] ">
          <View className="flex-row items-center p-3">
            <Pressable
              onPress={ () => router.push("/(tabs)/profile/chat/index") }
              className="flex-row items-center justify-between w-full cursor-pointer "
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
        </View>
        {/* ) } */ }
        {/* <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-border">
          <div className="flex-row items-center  justify-between">
            <h3 className="font-semibold mb-3">{ t("memberships") }</h3>
            <Link to={ "/membership" }>
              <h3 className="font-semibold mb-3 text-sm text-primary">
                { t("allMemberships") }
              </h3>
            </Link>
          </div>
          { memberfip?.length ? (
            <div className="space-y-3">
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
                  <div
                    onClick={ () => setSelectedTarif(myMembership) }
                    key={ index }
                    className={ ` 
                         flex-row flex-col  justify-between gap-3 p-3 rounded-lg border 
                      ${isActive
                        ? isPremium
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
                          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                      }
                    `}
                  >
                    <div className="flex-row items-center gap-3">
                      <div
                        className={ ` p-2 rounded-lg ${isActive
                          ? isPremium
                            ? "bg-yellow-100 border border-yellow-300 text-yellow-700"
                            : "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-500"
                          }` }
                      >
                        { isPremium ? (
                          <Crown className="w-6 h-6" />
                        ) : (
                          <Star className="w-5 h-5" />
                        ) }
                      </div>

                      <div>
                        <div className="flex-row items-center gap-2">
                          <p
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
                          </p>
                          { isExpiringSoon && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                              { t("expiringSoon") }
                            </span>
                          ) }
                        </div>

                        <div className="flex-row items-center gap-2 mt-1">
                          <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div
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
                          </div>
                          <p
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
                          </p>
                        </div>

                        <div className="flex-row items-center justify-between">
                          <p
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
                              <>
                                { t("activeUntil") }{ " " }
                                { new Date(
                                  myMembership.endDate
                                ).toLocaleDateString() }
                              </>
                            ) : (
                              <>
                                { t("expiredOn") }{ " " }
                                { new Date(
                                  myMembership.endDate
                                ).toLocaleDateString() }
                              </>
                            ) }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={ `flex-row items-center gap-3 ${isExpired && "hidden"
                        } ${myMembership.tariff.userCount > 1 ? "flex" : "hidden"
                        } 
                    
                      `}
                    >
                      <Button
                        onClick={ () => {
                          setPhoneDrawerOpen(true);
                          setSelectedUser(myMembership.id);
                        } }
                        className="w-full disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={
                          !memberfip?.some(
                            (value) => value.tariff.userCount > 1
                          ) ||
                          myMembership.tariff.userCount -
                          myMembership.users.length <=
                          0
                        }
                      >
                        { t("inviteFriend") }
                      </Button>
                      <Button
                        onClick={ () => setIsOpenSelectedTarif(true) }
                        className=""
                      >
                        <Eye size={ 20 } className="*:size-10" />
                      </Button>
                    </div>
                  </div>
                );
              }) }
            </div>
          ) : (
            <EmptyMembership />
          ) }
        </div> */}

        {/* <button
          className="flex-row items-center w-full p-3 mt-6 text-destructive hover:bg-muted rounded-lg"
          onClick={ () => setopenDrawerLog(!openDrawerLog) }
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>{ t("signOut") }</span>
        </button> */}
      </View>
      {/* <EditProfile
        setEditOpener={ setEditOpener }
        EditOpener={ EditOpener }
        setEditUser={ setEditUser }
        EditUser={ EditUser }
        refetch={ refetch }
      />
      <PaymentType
        setAmountForPayment={ setAmountForPayment }
        amountForPayment={ amountForPayment }
        setOpenForPayment={ setOpenForPayment }
        openForPayment={ openForPayment }
        setOpenForTypePayment={ setOpenForTypePayment }
        openForTypePayment={ openForTypePayment }
      />
      <InputDrawerForAdmin
        setOpenForAdminReq={ setOpenForAdminReq }
        openForAdminReq={ openForAdminReq }
      />
      <Drawer open={ openDrawerLog } onOpenChange={ setopenDrawerLog }>
        <DrawerContent className="p-6 flex-row flex-col items-center text-center space-y-4 min-h-[300px]  z-[9999]">
          <LogOut className="w-10 h-10 text-red-500" />
          <Text className="text-lg font-semibold">{ t("logout_title") }</Text>
          <p className="text-muted-foreground text-sm">
            { t("logout_description") }
          </p>
          <div className="flex-row gap-3">
            <Button
              variant="outline"
              onClick={ () => setopenDrawerLog(false) }
              className="px-6"
            >
              { t("bookings.cancel") }
            </Button>
            <Button
              variant="destructive"
              onClick={ () => {
                handleLogout();
                setopenDrawerLog(false);
              } }
              className="px-6"
            >
              { t("logout2") }
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
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
      /> */}
    </View>
  );
};

export default Profile;
