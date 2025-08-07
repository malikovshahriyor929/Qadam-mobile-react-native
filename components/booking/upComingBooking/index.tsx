import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react-native";
import { t } from "i18next";
import { Myasxios } from "@/shared/generics";
import { BookingType } from "@/types";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import MembershipName from "@/components/language";
import { Sheet } from "tamagui";
import { shadowLg } from "@/utils/shadow";
const ITEMS_PER_PAGE = 5;

export default function UpcomingBookings({
  data,
  refetch,
}: {
  data: {
    available: BookingType[];
    unavailable: BookingType[];
  };
  refetch: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const sortedBookings = useMemo(() => {
    return [...(data?.available || [])].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [data?.available]);

  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedBookings, currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };
  const cancelAbleLocation = async (book: BookingType) => {
    setLoading(true)
    await Myasxios.delete(`/tariffs/cancel/${book.id}`)
      .then(() => {
        Toast.show({
          type: "success",
          text1: (t("bookings.cancelSuccess"))
        })
        refetch();
        setCurrentPage(1);
        router.push({ pathname: "/(tabs)/explore/gym/[id]", params: { id: book.location.id } });
      })
      .catch((rej) => {
        if (rej.status === 400) {
          Toast.show({
            type: "error",
            text1: (t("cancel_notice"))
          })
        } else if (rej.status === 403) {
          Toast.show({
            type: "error",
            text1: (t("cancel_noticeNotOwner"))
          })
        } else {
          Toast.show({
            type: "error",
            text1: (t("bookings.cancelError"))
          })
        }
      }).finally(() => {
        setLoading(false)
      })

  };
  const getStatusConfig = (status: string) => {
    const configs = {
      expired: {
        bg: "bg-[rgb(243,244,244)] border-gray-300",
        badge: "bg-gray-100 text-gray-600 border-gray-200",
        text: "text-gray-500",
      },
      used: {
        bg: "bg-green-100 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        text: "text-emerald-600",
      },
      cancelled: {
        bg: "bg-red-200 border-red-300",
        badge: "bg-red-100 text-red-700 border-red-200",
        text: "text-red-500",
      },
      pending: {
        bg: "bg-amber-50 border-amber-200",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        text: "text-amber-600",
      },
      using: {
        bg: "bg-primary/5 border-primary/20",
        badge: "bg-primary/10 text-primary border-primary/20",
        text: "text-primary",
      },
    };
    return configs[status as keyof typeof configs] || configs.expired;
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] =
    useState<BookingType | null>(null);

  const openDrawer = (id: BookingType) => {
    setSelectedBookingId(id);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedBookingId(null);
  };
  return (
    <View className="my-3 rounded-lg pb-3 mx-5 !bg-transparent ">
      { paginatedBookings.map((booking, i) => {
        const statusConfig = getStatusConfig(booking.status);
        console.log(
          booking.startTime.slice(8, 10) +
          format(parseISO(booking.startTime), "dd-MM-yy").slice(2)
        );
        const imageUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/files/${booking.location.images[0].filename}`;

        return (
          <View
            key={ i }
            style={ shadowLg }
            className={ `bg-white mb-4 border-2 ${statusConfig.bg} rounded-2xl p-3 shadow` }
          >
            <View className="flex-row gap-4">
              <View className="w-[40%]">
                <Image
                  src={ imageUrl }
                  resizeMode="cover"
                  className="w-full h-28 rounded-xl"
                />
                <Pressable
                  onPress={ () => {
                    openDrawer(booking);
                  } }
                  className={ `mt-4 py-3 rounded-xl bg-primary  w-full items-center 
                      ${!booking.isYour && "hidden"}
                     ` }
                >
                  <Text className="text-primary-foreground  font-semibold text-sm">
                    { t("bookings.cancel") }
                  </Text>
                </Pressable>
              </View>

              <View className="flex-1 justify-between">
                <Text className="text-xl line-clamp-2 truncate  font-bold text-gray-900 ">
                  { MembershipName({
                    name_eng: booking.location.name_eng,
                    name_ru: booking.location.name_ru,
                    name_uz: booking.location.name_uz,
                  }) }
                </Text>

                <View className="gap-1">
                  <View className="flex-row items-center gap-2">
                    <Calendar size={ 16 } color="#1f2937" />
                    <Text className="text-sm font-semibold   text-gray-800">
                      { format(
                        parseISO(booking.startTime),
                        "EEE, MMM d, yyyy"
                      ).slice(0, 9) +
                        booking.startTime.slice(8, 10) +
                        format(
                          parseISO(booking.startTime),
                          "EEE, MMM d, yyyy"
                        ).slice(11) }
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Clock size={ 16 } color="#1f2937" />
                    <Text className="text-sm font-semibold text-gray-800">
                      { booking.startTime.slice(11, 16) } - { booking.endTime.slice(11, 16) }
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={ () => {
                    cancelAbleLocation(booking);
                  } }
                  className="mt-3 py-3 rounded-xl bg-primary  w-full items-center"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-primary-foreground  font-semibold text-sm">
                      { t("bookings.reschedule") }
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* <TouchableOpacity
                onPress={ () => {
                  cancelAbleLocation(booking);
                } }
                className="mt-3 py-3 rounded-xl bg-primary  w-full items-center"
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-primary-foreground  font-semibold text-sm">
                    { t("bookings.reschedule") }
                  </Text>
                </View>
              </TouchableOpacity> */}
          </View>
        );
      }) }
      { totalPages > 1 && (
        <View className="flex justify-center items-center mt-10 gap-2">
          <Pressable
            disabled={ currentPage === 1 }
            style={ shadowLg }
            onPress={ () => setCurrentPage((p) => Math.max(1, p - 1)) }
            className="inline-flex items-center justify-center w-11 h-11 max-[365px]:size-8 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow"
          >
            <ChevronLeft className="w-5 h-5" size={ 20 } color={ "#4b5563" } />
          </Pressable>

          <View className="flex items-center gap-1">
            { getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <Text
                  key={ idx }
                  className="px-3 py-2 text-gray-400 text-sm font-medium"
                >
                  ...
                </Text>
              ) : (
                <Pressable
                  key={ idx }
                  style={ shadowLg }
                  onPress={ () => setCurrentPage(Number(page)) }
                  className={ `inline-flex items-center justify-center w-11 h-11 max-[365px]:size-8 rounded-xl text-sm font-semibold transition-all shadow duration-200 ${currentPage === page
                    ? "bg-primary text-primary-foreground   border-2 border-primary"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-primary/10 hover:border-primary/30 shadow"
                    }` }
                >
                  <Text>
                    { page }
                  </Text>
                </Pressable>
              )
            ) }
          </View>

          <Pressable
            disabled={ currentPage === totalPages }
            style={ shadowLg }
            onPress={ () => setCurrentPage((p) => Math.min(totalPages, p + 1)) }
            className="inline-flex items-center justify-center w-11 h-11 max-[365px]:size-8 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow"
          >
            <ChevronRight className="w-5 h-5" size={ 20 } color={ "#4b5563" } />
          </Pressable>
        </View>
      ) }
      <Sheet
        open={ isDrawerOpen }
        onOpenChange={ setIsDrawerOpen }
        snapPoints={ [40] }
        dismissOnSnapToBottom
        modal
      >
        <Sheet.Handle />
        <Sheet.Overlay />
        <Sheet.Frame
          padding={ 16 }
          backgroundColor="#fff"
          borderTopLeftRadius={ 16 }
          borderTopRightRadius={ 16 }>
          <View>
            <Text className="font-black text-2xl ">{ t("bookings.cancelConfirmationTitle") }</Text>
            <Text className="text-xl font-bold text-gray-500">
              { t("bookings.cancelConfirmationMessage") }
            </Text>
          </View>
          <View className="gap-2 mt-[30%] ">
            <Pressable
              className="border-primary border items-center justify-center gap-2 whitespace-nowrap rounded-[10px]   font-medium  px-4 py-3 "
              onPress={ closeDrawer }>
              <Text className="text-black font-bold text-[16px]">
                { t("common.cancel") }
              </Text>
            </Pressable>
            <Pressable
              onPress={ () => {
                if (selectedBookingId) {
                  cancelAbleLocation(selectedBookingId);
                  closeDrawer();
                }
              } }
              className="bg-red-500   items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium  px-4 py-3 "
            >
              {
                loading && <View className="animate-spin  ">
                  <Loader2 />
                </View>
              }
              <Text className="text-white font-bold text-[16px]">
                { t("common.confirm") }
              </Text>
            </Pressable>
          </View>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
