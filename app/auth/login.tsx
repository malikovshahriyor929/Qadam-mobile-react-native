
import { Myasxios } from "@/shared/generics";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Toast from "react-native-toast-message";
import { Input, XStack } from "tamagui";
import * as z from "zod";
import "../global.css"
// export const loginSchema = z.object({
//   phoneNumber: z
//     .string()
//     .min(9, { message: t("validation.phoneMin") })
//     .transform((val) => val.replace(/[\s-]/g, ""))
//     .refine((val) => /^\+998\d{9}$/.test(val), {
//       message: t("validation.phoneFormat"),
//     }),
//   password: z.string().min(6, { message: t("validation.passwordMin") }),
// });

const Login = () => {
  const [, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [eye, setEye] = useState(false);
  const router = useRouter();


  const loginSchema = useMemo(() => z.object({
    phoneNumber: z.string()
      .min(9, { message: t("validation.phoneMin") })
      .transform((val) => val.replace(/[\s-]/g, ""))
      .refine((val) => /^\+998\d{9}$/.test(val), {
        message: t("validation.phoneFormat"),
      }),
    password: z.string().min(6, { message: t("validation.passwordMin") }),
  }), [t]);
  type LoginFormValues = z.infer<typeof loginSchema>;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "+998",
      password: "",
    },
  });

  const handlePhoneChange = (input: string) => {
    const prefix = "+998";
    if (!input.startsWith(prefix)) {
      setValue("phoneNumber", prefix);
      return;
    }
    const numbers = input
      .replace(/\D/g, "")
      .replace(/^998/, "")
      .substring(0, 9);

    setValue("phoneNumber", prefix + numbers);
  };
  // const onSubmit = async (data: LoginFormValues) => {
  //   console.log(data);

  //   try {
  //     const response = await Myasxios.post("/auth/login", data);

  //     if (response.data.statusCode === 210) {
  //       await Myasxios.post("https://your-api.com/auth/resend-code", {
  //         phoneNumber: data.phoneNumber,
  //       });
  //       router.push(`/auth/otp?phoneNumber=${data.phoneNumber}`);
  //     } else {
  //       await AsyncStorage.setItem("access_token", response.data.access_token);
  //       await AsyncStorage.setItem("role", response.data.role);
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     // (t("loginFail"), t("invalidCreds"));
  //   }
  // };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await Myasxios.post("/auth/login", data);
      if (response.data.statusCode === 210) {
        Myasxios.post("/auth/resend-code", {
          phoneNumber: data.phoneNumber,
        });
        router.push(`/auth/otp/phoneNumber=${data.phoneNumber}`);
        Toast.show({
          type: "error",
          text1: t("loginFail") + ": " + t("invalidCreds")
        })
      } else {
        Toast.show({ type: "success", text1: t("loginSuccess") });
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem("role", response.data.role);
      }
      if (response.status === 200) {
        router.push("/(tabs)");
      }
    } catch {
      Toast.show({
        type: "error",
        text1: t("loginFail") + ": " + t("invalidCreds")
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <View className="justify-center items-center  px-4 flex-1 mb-14  bg-white " >
            <View className="flex-1 max-w-[400px] w-full rounded-lg gap-5  justify-center px-4 h-full">
              <View className="sm:mx-auto sm:w-full sm:max-w-sm mb-10">
                <Text className="mt-10 text-center text-2xl font-bold tracking-tight"  >
                  { t("signIn") }
                </Text>
              </View>

              {/* Phone Input */ }
              <View className="mb-4">
                <Text className="mb-4">{ t("phone") }</Text>
                <Controller
                  control={ control }
                  name="phoneNumber"
                  render={ ({ field: { value } }) => (
                    <Input
                      placeholder="+998 XX XXX XX XX"
                      value={ value }
                      onChangeText={ handlePhoneChange }
                      keyboardType="phone-pad"
                    />
                  ) }
                />
                { errors.phoneNumber && (
                  <Text className="text-red-500 mt-1" >{ errors.phoneNumber.message }</Text>
                ) }
              </View>

              {/* Password Input */ }
              <View className="mb-4">
                <XStack jc="space-between" mb="$2">
                  <Text>{ t("password") }</Text>
                  <Pressable
                    className="text-sm font-medium mr-1 "
                    onPress={ () => router.push("/auth/forgot-password") }>
                    <Text> { t("forgot") }</Text>
                  </Pressable>
                </XStack>
                <Controller
                  control={ control }
                  name="password"
                  render={ ({ field: { value, onChange } }) => (
                    <View className="relative">
                      <Input
                        placeholder="******"
                        secureTextEntry={ !eye }
                        value={ value }
                        onChangeText={ onChange }
                        pr={ 40 }
                      />
                      <XStack
                        position="absolute"
                        right={ 15 }
                        top={ 12 }
                        onPress={ () => setEye(!eye) }
                      >
                        { eye ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                      </XStack>
                    </View>
                  ) }
                />
                { errors.password && (
                  <Text className="text-red-500 mt-1" >{ errors.password.message }</Text>
                ) }
              </View>

              {/* Submit Button */ }
              <TouchableOpacity
                onPress={ handleSubmit(onSubmit) }
                disabled={ isSubmitting }
                className="bg-primary focus:!opacity-100  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4 "
              >
                { isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="!text-primary-foreground font-bold">{ t("login") }</Text>
                ) }
              </TouchableOpacity>
              <TouchableOpacity
                onPress={ () => router.push("/auth/register") }
                className="border-primary border hover:border-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4 "
              >
                <Text className="!text-primary font-bold">{ t("signup.signUpButton") }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
