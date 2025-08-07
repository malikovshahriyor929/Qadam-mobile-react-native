import { useEffect, useState } from "react";
import InputDrawer from "../inputDrawer";
import { t } from "i18next";
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, Sheet } from "tamagui";

interface props {
  amountForPayment: number | string;
  setAmountForPayment: React.Dispatch<React.SetStateAction<number | string>>;
  setOpenForPayment: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenForTypePayment: React.Dispatch<React.SetStateAction<boolean>>;
  openForTypePayment: boolean;
  openForPayment: boolean;
}
const PaymentType = ({
  amountForPayment,
  setAmountForPayment,
  openForPayment,
  setOpenForPayment,
  openForTypePayment,
  setOpenForTypePayment,
}: props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [snapPoints, setSnapPoints] = useState<number[]>([40]);
  const [snapIndex, setSnapIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const data = [
    {
      name: "click",
      img: "../../../../click_icon.96ed983.svg",
    },
  ];
  const handleSelect = () => {
    setOpenForTypePayment(false);
    setOpenForPayment(true);
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
    <>
      <KeyboardAvoidingView
        style={ { flex: 1 } }
        behavior={ Platform.OS === "ios" ? "padding" : undefined }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        <Sheet
          key={ snapIndex }
          open={ openForTypePayment }
          onOpenChange={ (open: boolean) => {
            setOpenForTypePayment(open);
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
                <Text className="text-lg font-bold">
                  { t("payment.chooseMethod") }
                </Text>
                <Text>{ t("payment.selectProvider") }</Text>
                <View className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  { data.map((value, i) => (
                    <Pressable
                      key={ i }
                      onPress={ handleSelect }
                      className="cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition  hover:border-primary"
                    >
                      <Image
                        src={ value.img }
                        alt={ value.name }
                        className="size-28 object-contain  mb-2"
                      />
                      <Text className="text-sm font-medium text-center">
                        { value.name.toUpperCase() }
                      </Text>
                    </Pressable>
                  )) }
                </View>
                {/* 
                <InputDrawer
                  setAmountForPayment={ setAmountForPayment }
                  amountForPayment={ amountForPayment }
                  setOpenForPayment={ setOpenForPayment }
                  openForPayment={ openForPayment }
                /> */}
              </ScrollView>
            </TouchableWithoutFeedback>
          </Sheet.Frame>
        </Sheet>
      </KeyboardAvoidingView>
    </ >
  );
};

export default PaymentType;
