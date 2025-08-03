import { Myasxios } from '@/shared/generics'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { t } from 'i18next'
import { ArrowLeft } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Input, ScrollView } from 'tamagui'
import * as z from 'zod'
import "../global.css"
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(12, t("phoneRequired"))
    .regex(/^\+998\d{9}$/, t("invalidPhoneFormat")),
});
const ForgotPassword = () => {
  const router = useRouter()
  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "+998",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await Myasxios.post("/auth/password-reset/request", {
        phoneNumber: values.phoneNumber,
      })
        .then(() => {
          router.push({ pathname: "/auth/forgot/[phoneNumber]", params: { phoneNumber: values.phoneNumber } });
          // toast.success(t("sendSms"));
        })
        .catch((err) => {
          if (err.status === 405) {
            Toast.show({
              type: "error",
              text1: t("tooManyAttempts"),
            });
          } else {
            Toast.show({
              type: "error",
              text1: t("phoneNotFound"),
            });
          }
        });
    } catch (error) {
      console.error("Error sending reset request:", error);
    }
  };
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
  return (
    <View>
      <View className="flex flex-col min-h-screen relative">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              <View className="absolute" style={{
                top: 40, left: 20
              }}>
                <Link href={"/auth/login"}>
                  <Text>
                    <ArrowLeft />
                  </Text>
                </Link>
              </View>
              <View className="flex-1 flex flex-col justify-center px-4 py-12">
                <View className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <Text className="mt-10 text-center text-2xl font-bold tracking-tight">
                    {t("resetPassword")}
                  </Text>
                </View>

                <View
                  className="mt- mx-auto  w-full  max-w-[400px]"
                >
                  <View className="px-4 py-8 space-y-5">
                    <Controller
                      control={control}
                      name="phoneNumber"
                      rules={{ required: true }}
                      render={({ field: { value } }) => (
                        <View>
                          <Text className="text-base font-semibold mb-1">{t("phoneNumber")}</Text>
                          <Input
                            className="border border-gray-300 rounded-md p-3 text-base"
                            placeholder="+998 XX XXX XX XX"
                            value={value}
                            onChangeText={handlePhoneChange}
                            keyboardType="phone-pad"
                          />
                          {errors.phoneNumber && (
                            <Text className="text-red-500 mt-1">{errors.phoneNumber.message}</Text>
                          )}
                        </View>
                      )}
                    />

                    <Pressable
                      onPress={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className={`bg-primary mt-6 hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4 
                          ${isSubmitting ? "opacity-50" : ""} `}
                    >
                      {isSubmitting ? (
                        <Text>
                          <ActivityIndicator color="#fff" />
                        </Text>
                      ) : (
                        <Text className="text-primary-foreground  text-base font-semibold">{t("sendSms")}</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push({ pathname: `/auth/forgot/[phoneNumber]`, params: { phoneNumber: "+998936295502" } })}
                >
                  <Text>
                    go without
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </View >
  )
}

export default ForgotPassword