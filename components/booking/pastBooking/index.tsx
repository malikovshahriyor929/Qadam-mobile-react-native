// import { useState, useMemo } from "react";
// import { format, parseISO } from "date-fns";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   RotateCcw,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import MembershipName from "@/pages/membership/language";
// import { BookingType } from "@/@types";
// import { t } from "i18next";
// import { Button } from "@/components/ui/button";
// import RateDrawer from "@/components/rateDrawer";

// const ITEMS_PER_PAGE = 5;
// interface BookingProps {
//   data: {
//     available: BookingType[];
//     unavailable: BookingType[];
//   };
//   refetch: () => void;
// }
// export default function PastBookings({ data, refetch }: BookingProps) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rateOpen, setRateOpen] = useState(false);
//   const [rateId, setRateId] = useState<string | null>("");
//   const navigate = useNavigate();
//   const sortedBookings = useMemo(() => {
//     return [...(data?.unavailable || [])];
//   }, [data?.unavailable]);
//   const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
//   const paginatedBookings = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return sortedBookings.slice(start, start + ITEMS_PER_PAGE);
//   }, [sortedBookings, currentPage]);
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         pages.push(1, 2, 3, "...", totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages
//         );
//       }
//     }

//     return pages;
//   };
//   const getStatusConfig = (status: string) => {
//     const configs = {
//       expired: {
//         bg: "bg-[rgb(243,244,244)] border-gray-300",
//         badge: "bg-gray-100 text-gray-600 border-gray-200",
//         text: "text-gray-500",
//       },
//       used: {
//         bg: "bg-green-100 border-emerald-200",
//         badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
//         text: "text-emerald-600",
//       },
//       cancelled: {
//         bg: "bg-red-200 border-red-300",
//         badge: "bg-red-100 text-red-700 border-red-200",
//         text: "text-red-500",
//       },
//       pending: {
//         bg: "bg-amber-50 border-amber-200",
//         badge: "bg-amber-100 text-amber-700 border-amber-200",
//         text: "text-amber-600",
//       },
//       using: {
//         bg: "bg-primary/5 border-primary/20",
//         badge: "bg-primary/10 text-primary border-primary/20",
//         text: "text-primary",
//       },
//     };
//     return configs[status as keyof typeof configs] || configs.expired;
//   };

//   if (sortedBookings.length === 0) {
//     return (
//       <div className="text-center py-16 rounded-lg">
//         <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
//           <Calendar className="w-10 h-10 text-primary" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 mb-3">
//           {t("noPastBookings")}
//         </h3>
//         <p className="text-gray-500 text-lg">{t("gymHistoryMessage")}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 mb-5">
//       <div className="space-y-4">
//         {paginatedBookings.map((booking) => {
//           const statusConfig = getStatusConfig(booking.status);

//           return (
//             <div
//               key={booking.id}
//               className={`relative bg-white  border-2 ${statusConfig.bg} rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 group`}
//             >
//               <div className="grid grid-cols-[0.8fr_1.2fr]  gap-[5px_20px]  ">
//                 <div className=" flex flex-col justify-between">
//                   <div className="w-full h-24 sm:w- sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-lg">
//                     <img
//                     loading="lazy"
//                       src={`${import.meta.env.VITE_BASE_URL}/files/${
//                         booking.location.images[0].filename
//                       }`}
//                       alt={booking.createdAt}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>
//                   {!booking.rate && (
//                     <Button
//                       variant="outline"
//                       onClick={() => {
//                         if (booking?.endTime < new Date().toISOString()) {
//                           setRateId(booking?.id.toString());
//                           setRateOpen(true);
//                         }
//                         // booking.endTime < new Date().toISOString() &&
//                       }}
//                       className={`mr-3 px-8 max-[360px]:px-5 max-[335px]:px-3 border-primary text-primary hover:text-primary  hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full mt-2 ${
//                         booking.status == "cancelled" && "hidden"
//                       } ${
//                         !(booking.endTime < new Date().toISOString()) &&
//                         "opacity-70"
//                       } `}
//                     >
//                       {t("rate")}
//                     </Button>
//                   )}
//                 </div>

//                 <div className="w-full flex flex-col justify-between">
//                   <h3 className="font-bold text-xl line-clamp-2 truncate w-full text-wrap  text-gray-900 mb-3 leading-tight">
//                     {MembershipName({
//                       name_eng: booking.location?.name_eng,
//                       name_ru: booking.location?.name_ru,
//                       name_uz: booking.location?.name_uz,
//                     })}
//                   </h3>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center  bg-primary/15 rounded-xl">
//                         <Calendar className="w-4 h-4 text-primary" />
//                       </div>
//                       <span className="text-sm font-semibold max-[375px]:hidden  text-gray-800">
//                         {format(
//                           parseISO(booking.startTime),
//                           "EEE, MMM d, yyyy"
//                         )}
//                       </span>
//                       <span className="text-sm font-semibold hidden max-[375px]:flex  text-gray-800">
//                         {format(parseISO(booking.startTime), "dd-MM-yy")}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center justify-center bg-primary/15 rounded-xl">
//                         <Clock className="w-4 h-4 text-primary" />
//                       </div>
//                       <span className="text-sm font-semibold text-gray-800">
//                         {booking.startTime.slice(11, 16)} -{" "}
//                         {booking.endTime.slice(11, 16)}
//                       </span>
//                     </div>
//                   </div>
//                   {!booking.rate && (
//                     <div className=" mt-2 flex items-center gap-4 w-full">
//                       <button
//                         onClick={() => navigate(`/gym/${booking.location.id}`)}
//                         className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full max-[396px]:px-2   ${
//                           booking.status == "cancelled" && "hidden"
//                         }  `}
//                       >
//                         <RotateCcw className="w-4 h-4 max-[385px]:hidden" />
//                         {t("bookAgain")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 {(booking.rate || booking.status == "cancelled") && (
//                   <div className="mt-2 col-span-2 flex items-center gap-4 w-full">
//                     <button
//                       onClick={() => navigate(`/gym/${booking.location.id}`)}
//                       className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full max-[396px]:px-3 "
//                     >
//                       <RotateCcw className="w-4 h-4 max-[385px]:hidden" />
//                       {t("bookAgain")}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Enhanced Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center mt-10 gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             className="inline-flex items-center justify-center w-11 h-11 max-[365px]:size-8 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>

//           <div className="flex items-center gap-1">
//             {getPageNumbers().map((page, idx) =>
//               page === "..." ? (
//                 <span
//                   key={idx}
//                   className="px-3 py-2 text-gray-400 text-sm font-medium"
//                 >
//                   ...
//                 </span>
//               ) : (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrentPage(Number(page))}
//                   className={`inline-flex items-center justify-center w-11 h-11 max-[365px]:size-8 rounded-xl text-sm font-semibold transition-all duration-200 ${
//                     currentPage === page
//                       ? "bg-primary text-primary-foreground shadow-lg scale-105 border-2 border-primary"
//                       : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//           </div>

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             className="inline-flex items-center justify-center w-11 h-11 max-[365px]:size-8 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
//           >
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </div>
//       )}
//       <RateDrawer
//         rateOpen={rateOpen}
//         setRateOpen={setRateOpen}
//         sessionId={rateId}
//         refetch={refetch}
//       />
//     </div>
//   );
// }


import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, } from "react-native";
import { Calendar, Clock, RotateCcw } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import { t } from "i18next";
import RateDrawer from "@/components/rateDrawer";
import { BookingType } from "@/types";
import MembershipName from "@/components/language";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import SmartPagination from "@/components/smartPaginition";

const ITEMS_PER_PAGE = 5;

interface BookingProps {
  data: {
    available: BookingType[];
    unavailable: BookingType[];
  };
  refetch: () => void;
}

export default function PastBookings({ data, refetch }: BookingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rateOpen, setRateOpen] = useState(false);
  const [rateId, setRateId] = useState<string>("");
  const router = useRouter();

  const sortedBookings = useMemo(() => {
    return [...(data?.unavailable || [])];
  }, [data?.unavailable]);
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedBookings, currentPage]);

  const getStatusConfig = (status: string) => {
    const configs = {
      expired: {
        bg: "bg-gray-100 border-gray-300",
        text: "text-gray-500",
      },
      used: {
        bg: "bg-green-100 border-green-300",
        text: "text-green-600",
      },
      cancelled: {
        bg: "bg-red-200 border-red-300",
        text: "text-red-500",
      },
      pending: {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-600",
      },
      using: {
        bg: "bg-blue-100 border-blue-200",
        text: "text-blue-600",
      },
    };
    return configs[status as keyof typeof configs] || configs.expired;
  };

  if (sortedBookings.length === 0) {
    return (
      <View className="items-center py-16 rounded-lg">
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
          <Calendar size={ 40 } color="#3b82f6" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-3">
          { t("noPastBookings") }
        </Text>
        <Text className="text-gray-500 text-lg">{ t("gymHistoryMessage") }</Text>
      </View>
    );
  }

  return (
    <ScrollView className=" my-5 px-4 bg-[#F9F8FB] ">
      {
        paginatedBookings.map((booking, i) => {
          const statusConfig = getStatusConfig(booking.status);
          const imageUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/files/${booking.location.images[0].filename}`;
          return (
            <View
              key={ i }
              className={ `bg-white mb-4 border-2 ${statusConfig.bg} rounded-2xl p-3 shadow` }
            >
              <View className="flex-row gap-4">
                <View className="w-[40%]">
                  <Image
                    src={ imageUrl }
                    resizeMode="cover"
                    className="w-full h-28 rounded-xl"
                  />
                  { !booking.rate && (
                    <Pressable
                      onPress={ () => {
                        if (booking.endTime < new Date().toISOString()) {
                          setRateId(booking.id.toString());
                          setRateOpen(true);
                        }
                      } }
                      className={ `mt-4 py-3 rounded-xl bg-primary  w-full items-center ${booking.status === "cancelled" ? "hidden" : ""}` }
                    >
                      <Text className="text-primary-foreground  font-semibold text-sm">
                        { t("rate") }
                      </Text>
                    </Pressable>
                  ) }
                </View>

                <View className="flex-1 justify-between">
                  <Text className="text-2xl line-clamp-2 truncate  font-bold text-gray-900 mb-2">
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
                        { format(parseISO(booking.startTime), "EEE, MMM d, yyyy") }
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Clock size={ 16 } color="#1f2937" />
                      <Text className="text-sm font-semibold text-gray-800">
                        { booking.startTime.slice(11, 16) } - { booking.endTime.slice(11, 16) }
                      </Text>
                    </View>
                  </View>

                  { !booking.rate && (
                    <TouchableOpacity
                      onPress={ () => router.push({ pathname: "/(tabs)/explore/gym/[id]", params: { id: booking.location.id } }) }
                      className={ `mt-2 py-3 rounded-xl bg-primary  w-full items-center ${booking.status === "cancelled" ? "hidden" : ""
                        }` }
                    >
                      <View className="flex-row items-center gap-2">
                        <RotateCcw size={ 16 } color="#D5FA48" />
                        <Text className="text-primary-foreground  font-semibold text-sm">
                          { t("bookAgain") }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) }
                </View>
              </View>

              {
                (booking.rate || booking.status === "cancelled") && (
                  <TouchableOpacity
                    onPress={ () => router.push({ pathname: "/(tabs)/explore/gym/[id]", params: { id: booking.location.id } }) }
                    className="mt-3 py-3 rounded-xl bg-primary  w-full items-center"
                  >
                    <View className="flex-row items-center gap-2">
                      <RotateCcw size={ 16 } color="#D5FA48" />
                      <Text className="text-primary-foreground  font-semibold text-sm">
                        { t("bookAgain") }
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            </View>
          );
        })
      }

      < SmartPagination
        page={ currentPage }
        onChange={ setCurrentPage }
        totalPages={ totalPages }
      />

      <RateDrawer
        rateOpen={ rateOpen }
        setRateOpen={ setRateOpen }
        sessionId={ rateId }
        refetch={ refetch }
      />
    </ScrollView >
  );
}