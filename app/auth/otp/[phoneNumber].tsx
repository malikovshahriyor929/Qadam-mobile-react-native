
import { Myasxios } from "@/shared/generics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Toast from "react-native-toast-message";
import { ScrollView } from "tamagui";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  // const params = useSearchParams();
  const { phoneNumber } = useLocalSearchParams();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await Myasxios.post("/auth/verify-phone", {
        phoneNumber: phoneNumber.slice(12),
        code: otp,
      })

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: response.data.message
        })
      }
      await AsyncStorage.setItem("access_token", response.data.access_token,);
      await AsyncStorage.setItem("role", "user",);
      router.push("/(tabs)");
      Toast.show({
        type: "success",
        text1: t("toast.otpSuccess")
      })
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        // Assuming 400 means invalid OTP
        Toast.show({
          type: "error",
          text1: t("toast.otpError")
        })
      } else {
        Toast.show({
          type: "error",
          text1: t("toast.otpRequestError")
        })
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push("/auth/register");
  };
  // const resendOTP = () => {
  //   Myasxios.post("/auth/resend-code", { phoneNumber });
  // };
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const goBack = () => {
    return router.back();
  };
  const resendOTP = async () => {
    if (!canResend) return;

    try {
      await Myasxios.post("/auth/resend-code", {
        phoneNumber: phoneNumber.slice(12)
      });
      Toast.show({
        type: "error",
        text1: t("toast.otpResent")
      })
      setTimer(60);
    } catch {
      Toast.show({
        type: "error",
        text1: t("toast.otpResendFailed")
      })
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const otpArray = otp.split('');
    otpArray[index] = text;
    const newOtp = otpArray.join('').slice(0, 4);
    setOtp(newOtp);

    if (text && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };
  const otpArray = otp.split('');
  return (
    <View className="relative h-screen w-full ">
      <TouchableWithoutFeedback onPress={ Keyboard.dismiss } >
        <KeyboardAvoidingView
          style={ { flex: 1, backgroundColor: "#fff" } }
          behavior={ Platform.OS === "ios" ? "padding" : "padding" }
          keyboardVerticalOffset={ Platform.OS === "ios" ? 60 : 0 }
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={ {
              flexGrow: 1,
            } }
          >
            <View className="  flex flex-col h-full bg-white">
              <View className="flex-1 flex flex-col justify-center px-6 py-12">
                <View className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <Text className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
                    { t("otp.title") }
                  </Text>
                </View>

                <View className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <View className="space-y-6">
                    <View>
                      <View>
                        <View className="flex items-center justify-between gap-3 flex-row mb-3 ">
                          <View>
                            <Text className="block font-medium text-gray-700">
                              { t("verificationCode") }
                            </Text>
                          </View>
                          { canResend ? (
                            <Pressable
                              onPress={ resendOTP }
                              className="text-primary text-sm font-medium leading-6 hover:underline"
                            >
                              <View>
                                <Text>
                                  { t("resendOtp") }
                                </Text>
                              </View>
                            </Pressable>
                          ) : (
                            <View>
                              <Text className="text-muted-foreground ">
                                { timer }s { t("resendOtp") }
                              </Text>
                            </View>
                          ) }
                        </View>
                        <View className="flex-row justify-between gap-3  " style={ { marginTop: 10 } }>
                          { [0, 1, 2, 3].map((index) => (
                            <TextInput
                              key={ index }
                              ref={ (ref) => { inputRefs.current[index] = ref!; } }
                              className="border  border-gray-300 text-xl text-center rounded-[20px]"
                              maxLength={ 1 }
                              style={ { height: 56, width: "20%", borderRadius: 12 } }
                              keyboardType="number-pad"
                              value={ otpArray[index] || '' }
                              onChangeText={ (text) => handleOtpChange(text, index) }
                              onKeyPress={ (e) => handleKeyPress(e, index) }
                            />
                          )) }
                        </View>
                      </View>
                    </View>
                    <View className="mt-5">
                      <Pressable
                        onPress={ handleLogin }
                        className="w-full bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4  "
                        disabled={ isLoading }
                      >
                        <Text className="text-primary-foreground font-bold"> { isLoading ? t("otp.signingIn") : t("otp.signin") }</Text>
                      </Pressable>
                    </View>
                  </View>
                  {/* <View>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("otp.signingIn") : t("otp.signin")}
                </Button>
              </View> */}

                  <View className="mt-10  text-sm text-muted-foreground">
                    <Pressable
                      onPress={ navigateToSignup }
                      className=""
                    >
                      <Text className="font-semibold text-center  leading-6 !text-primary hover:text-gym-400">
                        { t("otp.signup") }
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              <Pressable onPress={ () => goBack() } className="absolute top-6 left-5 ">
                <ArrowLeft />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback >
    </View>
  );
};

export default Otp;
