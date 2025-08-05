import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Myasxios } from "@/shared/generics";
import { MapPin, Check, Loader2, Crown, Star } from "lucide-react-native";
import { t } from "i18next";
import { addDays } from "date-fns";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { HallType, Membership2Type } from "@/types";
import Toast from "react-native-toast-message";
import MembershipName from "@/components/language";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import ButtonMy from "@/shared/generics/button";
import Header from "@/components/headerforAll";
import GymCarousel from "@/components/gymDetails/carusel";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";
import DateSelector from "@/components/gymDetails/dateSelect/DateSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
function isTimeRangeAvailable(
  bookedSessions: { startTime: string; endTime: string }[],
  selectedDate: Date,
  selectedTime?: string, // "HH:00"
  durationInHours?: number
): boolean {
  if (!selectedTime) return false;
  const [hourStr] = selectedTime.split(":");
  const selectedStart = new Date(selectedDate);
  selectedStart.setHours(+hourStr, 0, 0, 0);

  const selectedEnd = new Date(selectedStart);
  if (durationInHours) {

    selectedEnd.setHours(selectedEnd.getHours() + durationInHours);
  } else {
    selectedEnd.setHours(selectedEnd.getHours());

  }

  // Har bir booked sessionni tekshiramiz
  for (const session of bookedSessions) {
    const bookedStart = new Date(
      new Date(session.startTime).getTime() - 5 * 60 * 60 * 1000
    );
    const bookedEnd = new Date(
      new Date(session.endTime).getTime() - 5 * 60 * 60 * 1000
    );

    // Agar biror booked session tanlangan interval bilan kesishsa — false
    if (
      bookedStart < selectedEnd && // boshlanishi tanlangan oxiridan oldin
      bookedEnd > selectedStart // tugashi tanlangan boshlanishidan keyin
    ) {
      return false;
    }
  }

  return true;
}
const GymPodDetail = () => {
  const [formattedTime, setFormattedTime] = useState<Date>(new Date());

  useEffect(() => {
    const getTime = async () => {
      try {
        const ress = await Myasxios.get("/locations/Time");
        const datas = ress.data;
        const tashkentDate = new Date(datas.datetime);
        setFormattedTime(tashkentDate);
      } catch (error) {
        console.error("Failed to fetch time:asdasdasdasd", error);
      }
    };
    getTime();
  }, []);
  // console.log(formattedTime);

  // let formattedTime = formattedTime;
  // useEffect(() => {
  //   formattedTime = formattedTime
  // }, [formattedTime]);

  const { id } = useLocalSearchParams()

  const router = useRouter();
  const [loading, setloading] = useState(false);
  const { data, isLoading, refetch } = useQuery<HallType>({
    queryKey: ["pods"],
    queryFn: () =>
      Myasxios.get(`/locations/${id}`).then((res) => res.data),
  });
  // const language = localStorage.getItem("language");

  const isTooLateToday = formattedTime.getHours() === 23 && formattedTime.getMinutes() > 10;
  const baseDate = isTooLateToday ? addDays(formattedTime, 1) : formattedTime;

  // Endi dates shu `baseDate` dan boshlanadi
  const dates = Array.from({ length: 7 }, (_, i) =>
    addDays(baseDate, i)
  );
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [faceOpen, setFaceOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectMyTariffs, setselectMyTariffs] = useState<number>();
  const selectedDateISO = useMemo(() => selectedDate, [selectedDate]);
  function formatToISOStringWithoutMethod(dateStr: Date) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T${selectedTime}:00.00Z`;
  }
  const { data: myTariffs = [] } = useQuery<Membership2Type[]>({
    queryKey: ["mytarifs"],
    queryFn: () =>
      Myasxios.get("/tariffs/my-tariffs").then((res) => {
        return res.data.data;
      }),
  });

  const handleBooking = async (tariffid: number) => {
    const language = await AsyncStorage.getItem("language")
    setloading(true);
    await Myasxios.post(
      "/tariffs/book",
      {
        locationId: +id,
        startTime: `${formatToISOStringWithoutMethod(selectedDateISO)}`,
        userTariffId: tariffid,
        language,
      }
    )
      .then(() => {
        refetch();
        Toast.show({
          type: "success",
          text1: t("booking_message", { time: selectedTime })
        })
        router.push("/(tabs)/booking");
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status == 402) {
          Toast.show({
            type: "error",
            text1: t("limit_reached")
          })
        }
        if (err?.response?.status == 409) {
          Toast.show({
            type: "error",
            text1: t("faceIdNotAvailable")
          })
          setFaceOpen(true);
        }
        if (err?.response?.status == 406) {
          Toast.show({
            type: "error",
            text1: t("somethingWentWrong")
          })
          setFaceOpen(true);
        }
        if (err?.response?.status == 405) {
          Toast.show({
            type: "error",
            text1: t("sessionLimitError")
          })
          setOpen(false)
        }
        if (err?.response?.status == 424) {
          Toast.show({
            type: "error",
            text1: t("no_plan")
          })
          // return router.push("/membership");  //////////////////////////////////// fix it //////////////////////////
        } else if (
          err?.response?.status === 500 ||
          err?.code === "ECONNABORTED"
        ) {
          Toast.show({
            type: "error",
            text1: t("booking_temporarily_unavailable")
          })
          // toast.error(t("contact_admin2"));
        }
      })
      .finally(() => {
        setloading(false);
      });
  };
  const title = useMemo(
    () =>
      MembershipName({
        name_eng: data?.name_eng || "",
        name_ru: data?.name_ru || "",
        name_uz: data?.name_uz || "",
      }),
    [data]
  );
  if (!isLoading && !data) {
    return (
      <View className="flex flex-col items-center justify-center h-screen text-center">
        <Text className="text-lg font-semibold">{ t("pod_not_found") }</Text>
        <Pressable onPress={ () => router.push("/(tabs)") } className="mt-4">
          <ButtonMy>
            { t("go_home") }

          </ButtonMy>
        </Pressable>
      </View>
    );
  }

  const latitude = data?.latitude;
  const longitude = data?.longitude;

  const mapUrl = `https://yandex.com/maps/?pt=${longitude},${latitude}&z=16&l=map`;
  const address = MembershipName({
    name_eng: data?.address_eng || "",
    name_ru: data?.address_ru || "",
    name_uz: data?.address_uz || "",
  });
  const trueFalseFn = () => {
    // if ((selectedTime.trim() == "") === loading) {
    //   return true;
    // } else {
    //   return false;
    // }
    return !selectedTime || loading;
  };

  return (

    <View>
      { !isLoading && !data?.connected && (
        <View className=" absolute z-20 top-0 left-0 flex items-center flex-col gap-4 justify-center size-full">
          <Text className="text-2xl font-semibold text-red-500 text-center ">
            { t("podStatus") }
          </Text>
          <Pressable onPress={ () => router.push("/(tabs)") }>
            <ButtonMy>
              { t("go_home") }
            </ButtonMy>
          </Pressable>
        </View>
      ) }
      <View
        className={ `flex flex-col min-h-screen pb-24
          ${!isLoading &&
          !data?.connected &&
          "blur-sm opacity-60 overflow-hidden"
          }
          `}
      >
        <Header title={ title } showBackButton />
        <ScrollView
          contentContainerStyle={ {
            paddingBottom: 150,
          } }>
          { !isLoading && false ? (
            <View className="relative min-h-[200px] w-[90%] mx-auto rounded-lg overflow-hidden !max-w-[400px] mt-5 object-cove">
              {/* <GymCarousel { ...data } /> */ }
            </View>
          ) : (
            <View className="mt-5  w-[100%] mx-auto h-[230px]">
              <View className=" rounded-lg animate-pulse  duration-300    bg-black/20" />
            </View>
          ) }

          <View className="px-4 py-4 relative">
            { !isLoading ? (
              <Text className="text-xl font-bold mb-1">{ title }</Text>
            ) : (
              <Skeleton className="w-[60%] h-6 bg-black/20" />
            ) }
            <View className="flex  flex-col gap-3 text-muted-foreground mb-2">
              <View className="flex-row items-center gap-1">
                <MapPin color={"#6b7280"} size={20} />
                <View className="underline truncate w-full ">
                  { !isLoading ? (
                    <Pressable onPress={ () => Linking.openURL(mapUrl) }>
                      <Text className="underline text-[#6b7280] truncate w-full text-[14px]">
                        { MembershipName({
                          name_eng: data?.address_eng || "",
                          name_ru: data?.address_ru || "",
                          name_uz: data?.address_uz || "",
                        }) }
                      </Text>
                    </Pressable>
                  ) : (
                    <Skeleton className="w-[17rem] max-[350px]:w-[13rem] h-4 bg-black/20" />
                  ) }
                </View>
              </View>
              {/* <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <MapPin className="size-5" />
              <span className="underline truncate w-full ">
                {!isLoading ? (
                  address
                ) : (
                  <Skeleton className="w-[17rem] max-[350px]:w-[13rem] h-4 mt-2 bg-black/20" />
                )}
              </span>
            </div>
            {latitude && longitude && (
              <MapDrawer
                open={open}
                onClose={() => setOpen(false)}
                latitude={latitude}
                longitude={longitude}
                address={address}
              />
            )} */}
            </View>
            <Text className="font-semibold ">{ t("select_date") }</Text>
            <View className="mb-5  relative">
              <DateSelector
                selectedDate={ selectedDate }
                selectedTime={ selectedTime }
                onSelectDate={ setSelectedDate }
                onSelectTime={ setSelectedTime }
                bookedSessions={ data?.bookedSessions }
              />
            </View>

            <Pressable
              className={ `max-w-[450px] w-full rounded-[12px] bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap flex-row  text-sm font-medium  px-4 py-4  ${!selectedTime && "bg-primary"
                } ${loading && "opacity-90 "} ` }
              disabled={ trueFalseFn() }
              onPress={ () => {
                if (
                  myTariffs?.length &&
                  !myTariffs.every(
                    (value) => value.tariff.sessionLimit == value.usedSessions
                  )
                ) {
                  setOpen(true);
                } else {
                  Toast.show({
                    type: "error",
                    text1: t("noMembership")
                  })
                  // router.push("/membership"); ////////////////////////////////////////////////////////////////////
                }
              } }
            >
              { loading ? (
                <Loader2 color={ "#D5FA48" } className="animate-spin font-bold " />
              ) : (
                <Check color={ "#D5FA48" } className="w-4 h-4 font-bold" />
              ) }
              <Text className="text-primary-foreground font-bold">
                { loading ? `${t("book_this_pod")} ...` : t("book_this_pod") }
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      {/* <FaceDrawer open={ faceOpen } setFaceOpen={ setFaceOpen } /> */ }
      {/* </View > */ }

      {/* <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="z-[999] p-6 pt-2 max-h-[80vh] mx-auto max-w-[450px] ">
          <div className="space-y-4">
            <div className="space-y-3">
              {myTariffs?.map(
                (myMembership: Membership2Type, index: number) => {
                  const remainingSessions =
                    myMembership.tariff.sessionLimit -
                    myMembership.usedSessions;
                  const isActive = new Date(myMembership.endDate) > formattedTime;
                  const isPremium = myMembership?.tariff?.name_uz
                    ?.toLowerCase()
                    ?.includes("premium");
                  const isExpiringSoon =
                    isActive &&
                    new Date(myMembership.endDate).getTime() - Date.now() <
                    3 * 24 * 60 * 60 * 1000;
                  const result = isTimeRangeAvailable(
                    data?.bookedSessions,
                    selectedDate,
                    selectedTime,
                    myMembership.tariff.sessionDurationInHours
                  );
                  const targetDate = new Date(myMembership.endDate);

                  return (
                    <div
                      onClick={() => {
                        if (result) {
                          setselectMyTariffs(myMembership.id);
                        }
                      }}
                      key={index}
                      className={` 
                        ${!result && "opacity-60 cursor-not-allowed "}
                         flex flex-col  justify-between gap-3 p-3 duration-300 transition-all rounded-lg border 
                         ${selectMyTariffs == myMembership.id && "scale-105  "}
                         ${targetDate < formattedTime && "hidden"}
                         ${myMembership.usedSessions ==
                        myMembership.tariff.sessionLimit && "hidden"
                        }
                      ${isActive
                          ? isPremium
                            ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
                            : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                        }
                    `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={` p-2 rounded-lg ${isActive
                            ? isPremium
                              ? "bg-yellow-100 border border-yellow-300 text-yellow-700"
                              : "bg-blue-100 text-blue-600"
                            : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {isPremium ? (
                            <Crown className="w-6 h-6" />
                          ) : (
                            <Star className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p
                              className={`
                               font-medium 
                              ${isActive
                                  ? isPremium
                                    ? "text-yellow-500"
                                    : "text-blue-800"
                                  : "text-gray-600"
                                }
                            `}
                            >
                              {myMembership?.tariff?.name_uz ||
                                t("myMembershipPlan")}
                            </p>
                            {isExpiringSoon && (
                              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                {t("expiringSoon")}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-20 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={` h-1.5 rounded-full 
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
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (remainingSessions /
                                      myMembership.tariff.sessionLimit) *
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <p
                              className={`
                               text-xs sm:text-sm 
                              ${isActive
                                  ? isPremium
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                                  : "text-gray-500"
                                }
                            `}
                            >
                              {remainingSessions}/
                              {myMembership.tariff.sessionLimit} {t("sessions")}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <p
                              className={`
                            text-xs mt-1 
                          ${isActive
                                  ? isPremium
                                    ? "text-yellow-500"
                                    : "text-blue-500"
                                  : "text-gray-400"
                                }
                          `}
                            >
                              {isActive ? (
                                <>
                                  {t("activeUntil")}{" "}
                                  {new Date(
                                    myMembership.endDate
                                  ).toLocaleDateString()}
                                </>
                              ) : (
                                <>
                                  {t("expiredOn")}{" "}
                                  {new Date(
                                    myMembership.endDate
                                  ).toLocaleDateString()}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
              <Button
                className={` w-full   ${"bg-primary"} ${loading && "opacity-90 "
                  } `}
                onClick={() => {
                  if (selectMyTariffs) {
                    handleBooking(selectMyTariffs);
                  } else {
                    handleBooking(myTariffs[0].id);
                  }
                }}
              >
                {loading ? (
                  <Loader2 className="animate-spin " />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {loading ? `${t("book_this_pod")} ...` : t("book_this_pod")}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer> */}

    </View >
  );
};

export default GymPodDetail;
