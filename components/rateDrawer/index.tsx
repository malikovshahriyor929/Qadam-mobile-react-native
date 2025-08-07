// import React, { useState } from "react";
// import { Star } from "lucide-react-native";
// import clsx from "clsx";
// import { Myasxios } from "@/shared/generics";
// import { useTranslation } from "react-i18next";
// import { Sheet, TextArea } from "tamagui";
// import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
// import Toast from "react-native-toast-message";

// type RateDrawerProps = {
//   rateOpen: boolean;
//   setRateOpen: (open: boolean) => void;
//   sessionId: string;
//   refetch: () => void;
// };

// const RateDrawer: React.FC<RateDrawerProps> = ({
//   rateOpen,
//   setRateOpen,
//   sessionId,
//   refetch,
// }) => {
//   const { t } = useTranslation();
//   const [amount, setAmount] = useState<number>(0);
//   const [comment, setComment] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [snap, setSnap] = useState<number>(40);
//   const handleSubmit = async () => {
//     if (amount === 0) {
//       Toast.show({
//         type: "error",
//         text1: (t("rateValidation")),
//       })
//       return;
//     }

//     setLoading(true);
//     try {
//       await Myasxios.post(`/tariffs/sessions/${sessionId}/rate`, {
//         amount,
//         comment,
//       });
//       Toast.show({
//         type: "success",
//         text1: (t("rateSuccess")),
//       })
//       setRateOpen(false);
//       setAmount(0);
//       setComment("");
//       refetch();
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: (t("rateError")),
//       })
//     } finally {
//       setLoading(false);
//       setRateOpen(false);
//       setAmount(0);
//       setComment("");
//       setSnap(40)
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={ { flex: 1, backgroundColor: "#fff" } }
//       behavior={ Platform.OS === "ios" ? "padding" : "padding" }
//       keyboardVerticalOffset={ Platform.OS === "ios" ? 60 : 0 }
//     >
//       <Sheet open={ rateOpen }
//         onOpenChange={ (open: boolean) => {
//           setRateOpen(open);
//           if (!open) setSnap(40); // reset on close
//         } }
//         snapPoints={ [snap] }
//         modal>
//         <Sheet.Overlay />
//         <Sheet.Handle />
//         <Sheet.Frame padding={ 16 } backgroundColor="#fff" borderTopLeftRadius={ 16 } borderTopRightRadius={ 16 }>
//           <TouchableWithoutFeedback onPress={ Keyboard.dismiss } >
//             <ScrollView
//               keyboardShouldPersistTaps="handled"
//               contentContainerStyle={ { flexGrow: 1 } }
//             >
//               <Text className="text-primary text-center mb-4 text-lg">
//                 { t("rateTitle") }
//               </Text>
//               <View className="flex-row justify-center gap-2 mb-4">
//                 { [1, 2, 3, 4, 5].map((star, i) => (
//                   <Pressable
//                     key={ i }
//                     onPress={ () => setAmount(star) }
//                   // onMagicTap={ () => setHovered(null) }
//                   >
//                     {/* <Star
//                 key={ star }
//                 size={ 32 }
//                 className={ clsx(
//                   "cursor-pointer transition-colors ",
//                   (hovered ?? amount) >= star ? "text-[#facc15]" : "text-gray-300"
//                   ) }
//                   strokeWidth={ 1.5 }
//                   fill={ amount >= star ? "#facc15" : "none" }
//               /> */}
//                     <Star
//                       size={ 32 }
//                       strokeWidth={ 1.5 }
//                       color={ amount >= star ? "#facc15" : "#d1d5db" } // tailwind: yellow-400 or gray-300
//                       fill={ amount >= star ? "#facc15" : "none" }
//                     />
//                   </Pressable>
//                 )) }
//               </View>

//               <TextArea
//                 placeholder={ t("ratePlaceholder") }
//                 value={ comment }
//                 onChangeText={ setComment }
//                 className="mb-4"
//                 onFocus={ () => setSnap(80) }
//                 onPointerEnter={ () => setSnap(80) }
//                 onPointerLeave={ () => setSnap(40) }
//               />

//               <View className="mt-4">
//                 <Pressable className="w-full bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4" onPress={ handleSubmit } disabled={ loading }>
//                   <Text className="text-primary-foreground font-bold">
//                     { loading ? t("rateSubmitting") : t("rateSubmit") }
//                   </Text>
//                 </Pressable>
//               </View>
//             </ScrollView>
//           </TouchableWithoutFeedback>
//         </Sheet.Frame>
//       </Sheet>
//     </KeyboardAvoidingView>
//   );
// };

// export default RateDrawer;
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react-native";
import { Myasxios } from "@/shared/generics";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  TextArea,
} from "tamagui";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type RateDrawerProps = {
  rateOpen: boolean;
  setRateOpen: (open: boolean) => void;
  sessionId: string;
  refetch: () => void;
};

const RateDrawer: React.FC<RateDrawerProps> = ({
  rateOpen,
  setRateOpen,
  sessionId,
  refetch,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [snapPoints, setSnapPoints] = useState<number[]>([40]);
  const [snapIndex, setSnapIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const handleSubmit = async () => {
    if (amount === 0) {
      Toast.show({
        type: "error",
        text1: t("rateValidation"),
      });
      return;
    }

    setLoading(true);
    try {
      await Myasxios.post(`/tariffs/sessions/${sessionId}/rate`, {
        amount,
        comment,
      });

      Toast.show({
        type: "success",
        text1: t("rateSuccess"),
      });

      setRateOpen(false);
      setAmount(0);
      setComment("");
      setSnapPoints([40]); // reset
      refetch();
    } catch {
      Toast.show({
        type: "error",
        text1: t("rateError"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  useEffect(() => {
    if (keyboardVisible) {
      setSnapPoints([85])
      setSnapIndex(1)
    } else {
      setSnapPoints([40])
      setSnapIndex(0)
    }
  }, [keyboardVisible]);


  return (
    <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === "ios" ? "padding" : undefined }
      keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
    >
      <Sheet
        key={ snapIndex }
        open={ rateOpen }
        onOpenChange={ (open: boolean) => {
          setRateOpen(open);
          if (!open) setSnapPoints([40]);
          if (!open) setSnapIndex(0);
        } }
        snapPoints={ snapPoints }
        dismissOnSnapToBottom
        dismissOnOverlayPress
        animation={ "quick" }
        modal
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame
          padding={ 16 }
          backgroundColor="#fff"
          borderTopLeftRadius={ 16 }
          borderTopRightRadius={ 16 }
        >
          <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={ { flexGrow: 1 } }
            >
              <Text className="text-primary text-center mb-4 text-lg">
                { t("rateTitle") }
              </Text>

              <View className="flex-row justify-center gap-2 mb-4">
                { [1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={ star } onPress={ () => setAmount(star) }>
                    <Star
                      size={ 32 }
                      strokeWidth={ 1.5 }
                      color={ amount >= star ? "#facc15" : "#d1d5db" }
                      fill={ amount >= star ? "#facc15" : "none" }
                    />
                  </Pressable>
                )) }
              </View>

              <TextArea
                placeholder={ t("ratePlaceholder") }
                value={ comment }
                onChangeText={ setComment }
                className="mb-4"
                onFocus={ () => { setSnapPoints([85]); setSnapIndex(1) } }
                onPress={ () => {
                  setSnapIndex(1);
                  setSnapPoints([85])
                } }
              />

              <View className="mt-4">
                <Pressable
                  className="w-full bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-medium px-4 py-4"
                  onPress={ handleSubmit }
                  disabled={ loading }
                >
                  <Text className="text-primary-foreground font-bold">
                    { loading ? t("rateSubmitting") : t("rateSubmit") }
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </Sheet.Frame>
      </Sheet>
    </KeyboardAvoidingView>
  );
};

export default RateDrawer;
