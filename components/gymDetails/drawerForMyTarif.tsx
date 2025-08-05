// import React, { useState } from "react";
// import { Text, View, Pressable, ScrollView } from "react-native";
// import { Sheet } from "@tamagui/sheet";
// import { Check, Crown, Loader2, Star } from "lucide-react-native";
// import { t } from "i18next";
// import { Membership2Type } from "@/types";

// interface Props {
//   open: boolean;
//   setOpen: (val: boolean) => void;
//   myTariffs: Membership2Type[];
//   selectedDate: string;
//   selectedTime: string;
//   handleBooking: (id: number) => void;
//   loading: boolean;
// }

// export default function MembershipSheet({
//   open,
//   setOpen,
//   myTariffs,
//   selectedDate,
//   selectedTime,
//   handleBooking,
//   loading,
// }: Props) {
//   const [selectMyTariffs, setselectMyTariffs] = useState<number | null>(null);
//   const formattedTime = new Date();

//   return (
//     <Sheet open={open} onOpenChange={setOpen} snapPoints={[80]} dismissOnSnapToBottom>
//       <Sheet.Overlay />
//       <Sheet.Frame className="bg-white rounded-t-xl px-4 pt-3 pb-6">
//         <ScrollView className="gap-3">
//           {myTariffs?.map((myMembership, index) => {
//             const remainingSessions =
//               myMembership.tariff.sessionLimit - myMembership.usedSessions;
//             const isActive = new Date(myMembership.endDate) > formattedTime;
//             const isPremium = myMembership?.tariff?.name_uz?.toLowerCase().includes("premium");
//             const isExpiringSoon =
//               isActive &&
//               new Date(myMembership.endDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
//             const result = isTimeRangeAvailable(
//               [], // `data?.bookedSessions` ni tashqaridan bering yoki o'zgartiring
//               selectedDate,
//               selectedTime,
//               myMembership.tariff.sessionDurationInHours
//             );

//             const targetDate = new Date(myMembership.endDate);
//             const hidden =
//               targetDate < formattedTime ||
//               myMembership.usedSessions === myMembership.tariff.sessionLimit;

//             if (hidden) return null;

//             return (
//               <Pressable
//                 key={index}
//                 disabled={!result}
//                 onPress={() => result && setselectMyTariffs(myMembership.id)}
//                 className={cn(
//                   "p-3 rounded-lg border flex-col gap-3 mb-2",
//                   !result && "opacity-60",
//                   selectMyTariffs === myMembership.id && "scale-105",
//                   isActive
//                     ? isPremium
//                       ? "bg-yellow-50 border-yellow-200"
//                       : "bg-blue-50 border-blue-200"
//                     : "bg-gray-100 border-gray-200"
//                 )}
//               >
//                 <View className="flex-row items-center gap-3">
//                   <View
//                     className={cn(
//                       "p-2 rounded-lg",
//                       isActive
//                         ? isPremium
//                           ? "bg-yellow-100 border border-yellow-300 text-yellow-700"
//                           : "bg-blue-100 text-blue-600"
//                         : "bg-gray-200 text-gray-500"
//                     )}
//                   >
//                     {isPremium ? <Crown size={22} /> : <Star size={20} />}
//                   </View>

//                   <View className="flex-1">
//                     <View className="flex-row items-center gap-2">
//                       <Text
//                         className={cn(
//                           "font-medium text-base",
//                           isActive
//                             ? isPremium
//                               ? "text-yellow-500"
//                               : "text-blue-800"
//                             : "text-gray-600"
//                         )}
//                       >
//                         {myMembership.tariff.name_uz || t("myMembershipPlan")}
//                       </Text>

//                       {isExpiringSoon && (
//                         <Text className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
//                           {t("expiringSoon")}
//                         </Text>
//                       )}
//                     </View>

//                     <View className="flex-row items-center gap-2 mt-1">
//                       <View className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
//                         <View
//                           className={cn(
//                             "h-1.5 rounded-full",
//                             remainingSessions >
//                             myMembership.tariff.sessionLimit * 0.3
//                               ? isPremium
//                                 ? "bg-yellow-500"
//                                 : "bg-blue-500"
//                               : "bg-red-500",
//                             myMembership.tariff.sessionLimit >= 10 && "bg-green-500",
//                             remainingSessions === 0 && "bg-red-500"
//                           )}
//                           style={{
//                             width: `${Math.min(
//                               100,
//                               (remainingSessions / myMembership.tariff.sessionLimit) * 100
//                             )}%`,
//                           }}
//                         />
//                       </View>

//                       <Text
//                         className={cn(
//                           "text-xs",
//                           isActive
//                             ? isPremium
//                               ? "text-yellow-600"
//                               : "text-blue-600"
//                             : "text-gray-500"
//                         )}
//                       >
//                         {remainingSessions}/{myMembership.tariff.sessionLimit} {t("sessions")}
//                       </Text>
//                     </View>

//                     <Text
//                       className={cn(
//                         "text-xs mt-1",
//                         isActive
//                           ? isPremium
//                             ? "text-yellow-500"
//                             : "text-blue-500"
//                           : "text-gray-400"
//                       )}
//                     >
//                       {isActive
//                         ? `${t("activeUntil")} ${new Date(myMembership.endDate).toLocaleDateString()}`
//                         : `${t("expiredOn")} ${new Date(myMembership.endDate).toLocaleDateString()}`}
//                     </Text>
//                   </View>
//                 </View>
//               </Pressable>
//             );
//           })}

//           <Button
//             className={cn("w-full mt-2", loading && "opacity-70")}
//             onPress={() => {
//               if (selectMyTariffs) {
//                 handleBooking(selectMyTariffs);
//               } else {
//                 handleBooking(myTariffs[0].id);
//               }
//             }}
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" /> : <Check size={16} />}
//             {loading ? `${t("book_this_pod")} ...` : t("book_this_pod")}
//           </Button>
//         </ScrollView>
//       </Sheet.Frame>
//     </Sheet>
//   );
// }



//  <Sheet open={open} onOpenChange={setOpen} snapPoints={[80]} dismissOnSnapToBottom>
//       <Sheet.Overlay />
//       <Sheet.Frame className="bg-white rounded-t-xl px-4 pt-3 pb-6">
//         <ScrollView className="gap-3">
//           {myTariffs?.map((myMembership, index) => {
//             const remainingSessions =
//               myMembership.tariff.sessionLimit - myMembership.usedSessions;
//             const isActive = new Date(myMembership.endDate) > formattedTime;
//             const isPremium = myMembership?.tariff?.name_uz?.toLowerCase().includes("premium");
//             const isExpiringSoon =
//               isActive &&
//               new Date(myMembership.endDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

//             const targetDate = new Date(myMembership.endDate);
//             const hidden =
//               targetDate < formattedTime ||
//               myMembership.usedSessions === myMembership.tariff.sessionLimit;

//             if (hidden) return null;

//             const baseCardClass =
//               "p-3 rounded-lg border flex-col gap-3 mb-2 " +
//               (!isActive
//                 ? "bg-gray-100 border-gray-200"
//                 : isPremium
//                   ? "bg-yellow-50 border-yellow-200"
//                   : "bg-blue-50 border-blue-200") +
//               (!remainingSessions ? " opacity-60" : "") +
//               (selectMyTariffs === myMembership.id ? " scale-105" : "");

//             const iconBoxClass =
//               "p-2 rounded-lg " +
//               (isActive
//                 ? isPremium
//                   ? "bg-yellow-100 border border-yellow-300 text-yellow-700"
//                   : "bg-blue-100 text-blue-600"
//                 : "bg-gray-200 text-gray-500");

//             const titleTextClass =
//               "font-medium text-base " +
//               (isActive
//                 ? isPremium
//                   ? "text-yellow-500"
//                   : "text-blue-800"
//                 : "text-gray-600");

//             const barColor =
//               remainingSessions === 0
//                 ? "bg-red-500"
//                 : remainingSessions > myMembership.tariff.sessionLimit * 0.3
//                   ? isPremium
//                     ? "bg-yellow-500"
//                     : "bg-blue-500"
//                   : "bg-red-500";

//             const barClass = `h-1.5 rounded-full ${barColor}`;

//             const sessionTextClass =
//               "text-xs " +
//               (isActive
//                 ? isPremium
//                   ? "text-yellow-600"
//                   : "text-blue-600"
//                 : "text-gray-500");

//             const statusTextClass =
//               "text-xs mt-1 " +
//               (isActive
//                 ? isPremium
//                   ? "text-yellow-500"
//                   : "text-blue-500"
//                 : "text-gray-400");

//             return (
//               <Pressable
//                 key={index}
//                 disabled={!remainingSessions}
//                 onPress={() => setselectMyTariffs(myMembership.id)}
//                 className={baseCardClass}
//               >
//                 <View className="flex-row items-center gap-3">
//                   <View className={iconBoxClass}>
//                     {isPremium ? <Crown size={22} /> : <Star size={20} />}
//                   </View>

//                   <View className="flex-1">
//                     <View className="flex-row items-center gap-2">
//                       <Text className={titleTextClass}>
//                         {myMembership.tariff.name_uz || t("myMembershipPlan")}
//                       </Text>

//                       {isExpiringSoon && (
//                         <Text className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
//                           {t("expiringSoon")}
//                         </Text>
//                       )}
//                     </View>

//                     <View className="flex-row items-center gap-2 mt-1">
//                       <View className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
//                         <View
//                           className={barClass}
//                           style={{
//                             width: `${Math.min(
//                               100,
//                               (remainingSessions / myMembership.tariff.sessionLimit) * 100
//                             )}%`,
//                           }}
//                         />
//                       </View>

//                       <Text className={sessionTextClass}>
//                         {remainingSessions}/{myMembership.tariff.sessionLimit} {t("sessions")}
//                       </Text>
//                     </View>

//                     <Text className={statusTextClass}>
//                       {isActive
//                         ? `${t("activeUntil")} ${new Date(myMembership.endDate).toLocaleDateString()}`
//                         : `${t("expiredOn")} ${new Date(myMembership.endDate).toLocaleDateString()}`}
//                     </Text>
//                   </View>
//                 </View>
//               </Pressable>
//             );
//           })}

//           <Button
//             className={`w-full mt-2 ${loading ? "opacity-70" : ""}`}
//             onPress={() => {
//               if (selectMyTariffs) {
//                 handleBooking(selectMyTariffs);
//               } else if (myTariffs.length) {
//                 handleBooking(myTariffs[0].id);
//               }
//             }}
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" /> : <Check size={16} />}
//             {loading ? `${t("book_this_pod")} ...` : t("book_this_pod")}
//           </Button>
//         </ScrollView>
//       </Sheet.Frame>
//     </Sheet>