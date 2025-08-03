
import { Myasxios } from '@/shared/generics';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { t } from 'i18next';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input, XStack } from 'tamagui';
import * as z from 'zod';

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(12, t("phoneRequired"))
    .regex(/^\+998\d{9}$/, t("invalidPhoneFormat")),
  otp: z
    .string()
    .length(4, t("otpMustBe6Digits"))
    .regex(/^\d+$/, t("otpMustBeNumbersOnly")),
});

const formSchema2 = z
  .object({
    newPassword: z.string().min(8, { message: t("validation.passwordMin") }),
    confirmPassword: z
      .string()
      .min(8, { message: t("validation.passwordMin") }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.passwordsMismatch"),
    path: ["confirmPassword"],
  });


export default function Forgot() {
  const [resetTokens, setResetTokens] = useState();
  const [IsOpen, setIsOpen] = useState(false);
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const router = useRouter();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [eyecom, seteyeCom] = useState(false);
  const [eyecom2, seteyeCom2] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  // const [code, setCode] = useState("");
  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: phoneNumber || "+998",
      otp: "",
    },
  });
  // const form2 = useForm<z.infer<typeof formSchema2>>({
  //   resolver: zodResolver(formSchema2),
  //   defaultValues: {
  //     newPassword: "",
  //     confirmPassword: "",
  //   },
  // });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await Myasxios.post("/auth/password-reset/verify-code", {
        phoneNumber: values.phoneNumber,
        code: values.otp,
      })
        .then((res) => {
          setIsOpen(true);
          setResetTokens(res.data.resetToken);
        })
        .catch((err) => err.status === 400 && Toast.show({ type: "error", text1: t("codeErrorRetry") }))
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // useEffect(() => {
  //   if (IsOpen) {
  //     form2.reset({
  //       newPassword: "",
  //       confirmPassword: "",
  //     }); 
  //   }
  // }, [IsOpen]);
  // const wasOpen = useRef(false);

  // useEffect(() => {

  //   if (IsOpen && !wasOpen.current) {
  //     form2.reset({
  //       newPassword: "",
  //       confirmPassword: "",
  //     });
  //     wasOpen.current = true;
  //   } else if (!IsOpen) {
  //     wasOpen.current = false;
  //   }
  // }, [IsOpen]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);
  const resendOTP = async () => {
    Myasxios.post("/auth/password-reset/request", { phoneNumber }).then(
      () => {
        setTimer(60);
        // toast.success(t("toast.otpResent"));
      }
    );
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
  const { control: control2, handleSubmit: handleSubmit2, formState: { errors: errors2, isSubmitting: isSubmitting2 } } = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit2 = async (values2: z.infer<typeof formSchema2>) => {
    try {
      await Myasxios.post("/auth/password-reset/confirm", {
        resetToken: resetTokens,
        newPassword: values2.newPassword,
      }).then(() => {
        router.push("/auth/login");
        Toast.show({
          type: "success",
          text1: t("passwordResetSuccess"),
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <View className=' relative flex flex-col min-h-screen '>
      <TouchableWithoutFeedback onPress={ Keyboard.dismiss }  >
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
            <View className="absolute" style={ {
              top: 40, left: 20
            } }>
              <Link href={ "/auth/login" }>
                <Text>
                  <ArrowLeft />
                </Text>
              </Link>
            </View>
            <View className="flex-1 flex flex-col justify-center px-6 py-12">
              <View className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Text className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                  { t("resetPassword") }
                </Text>
                <Text className="mt-2 text-center text-sm text-gray-600">
                  { t("enterOtpSentToPhone") }
                </Text>
              </View>

              <View className="mt-6 mx-auto w-full max-w-sm space-y-6">
                { !IsOpen ? (
                  <View key="password-form" className='gap-5'>
                    <Controller
                      control={ control }
                      rules={ { required: true } }
                      name="phoneNumber"
                      render={ ({ field: { value } }) => (
                        <View className={ `${phoneNumber && "hidden"}` }>
                          <Text className="text-base font-semibold mb-1">{ t("phoneNumber") }</Text>
                          <Input
                            className="border border-gray-300 rounded-md p-3 text-base"
                            placeholder="+998 XX XXX XX XX"
                            value={ value }
                            onChangeText={ handlePhoneChange }
                            keyboardType="phone-pad"
                          />
                          <View> { errors.phoneNumber && (
                            <Text className="text-red-500 mt-1">{ errors.phoneNumber.message }</Text>
                          ) }
                          </View>
                        </View>
                      ) }
                    />
                    <Controller
                      control={ control }
                      name="otp"
                      render={ ({ field: { value, onChange } }) => {
                        const handleOtpChange = (text: string, index: number) => {
                          const otpArray = value.split('');
                          otpArray[index] = text;
                          const newOtp = otpArray.join('').slice(0, 4);
                          onChange(newOtp);

                          if (text && inputRefs.current[index + 1]) {
                            inputRefs.current[index + 1].focus();
                          }
                        };
                        const handleKeyPress = (e: any, index: number) => {
                          if (e.nativeEvent.key === 'Backspace' && !value[index] && inputRefs.current[index - 1]) {
                            inputRefs.current[index - 1].focus();
                          }
                        };
                        const otpArray = value.split('');
                        return (
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
                        );
                      } }
                    />
                    <Pressable
                      className="bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4"
                      disabled={ isSubmitting }
                      onPress={ handleSubmit(onSubmit) }
                    >
                      { isSubmitting ? (
                        <View>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <Text>
                            { t("verifying") }...
                          </Text>
                        </View>
                      ) : (
                        <Text className='text-primary-foreground'>{ t("verifyAndReset") }</Text>
                      ) }
                    </Pressable>

                  </View>
                ) : (
                  <View key="otp-form" className='gap-5'>
                    <Controller
                      control={ control2 }
                      rules={ { required: true } }
                      name="newPassword"
                      render={ ({ field: { value, onChange } }) => (
                        <View >
                          <Text className="text-base font-semibold mb-1">{ t("signup.password") }</Text>
                          <View className="relative">
                            <Input
                              className="border border-gray-300 rounded-md p-3 text-base"
                              // type={`${eyecom ? "text" : "password"}`}
                              // secureTextEntry={ !eyecom }
                              placeholder="********"
                              value={ value }
                              onChangeText={ onChange }
                            // keyboardType="phone-pad"
                            // disabled={form2.formState.isSubmitting}
                            // editable={ !isSubmitting2 }
                            />
                            <XStack
                              position="absolute"
                              right={ 15 }
                              top={ 12 }
                              onPress={ () => seteyeCom(!eyecom) }
                            >
                              <View>
                                { eyecom ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                              </View>
                            </XStack>
                          </View>
                          <View>
                            { errors2.newPassword ? (
                              <Text className="text-red-500 mt-1">{ errors2.newPassword.message }</Text>
                            ) : "" }
                          </View>
                        </View>
                      ) }
                    />
                    <Controller
                      control={ control2 }
                      name="confirmPassword"
                      rules={ { required: true } }
                      render={ ({ field: { value, onChange } }) =>
                        <View>
                          <Text className="text-base font-semibold mb-1">{ t("confirmPassword") }</Text>
                          <View className="relative">
                            <Input
                              className="border border-gray-300 rounded-md p-3 text-base"
                              secureTextEntry={ !eyecom2 } // <-- fix here
                              placeholder="********"
                              value={ value }
                              onChangeText={ onChange }
                              editable={ !isSubmitting2 }
                            />
                            <XStack
                              position="absolute"
                              right={ 15 }
                              top={ 12 }
                              onPress={ () => seteyeCom2(!eyecom2) }
                            >
                              <View>
                                { eyecom2 ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                              </View>
                            </XStack>
                          </View>
                        </View>
                      }
                    />
                    <Pressable
                      className="bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4"
                      disabled={ isSubmitting2 }
                      onPress={ handleSubmit2(onSubmit2) }
                    >
                      { isSubmitting2 ? (
                        <View className='flex flex-row'>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <Text>
                            { t("verifying") }...
                          </Text>
                        </View>
                      ) : (
                        <Text className='text-primary-foreground'>{ t("verifyAndReset") }</Text>
                      ) }
                    </Pressable>

                  </View>
                ) }
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView >
      </TouchableWithoutFeedback >
    </View>
  );
}
