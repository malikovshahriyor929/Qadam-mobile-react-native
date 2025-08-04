import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trans, useTranslation } from "react-i18next";

import { Myasxios } from "@/shared/generics";
import { registerSchema } from "@/utils/schemas";
import { ArrowLeft, CheckIcon, Eye, EyeOff } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { Checkbox, Input, Label, XStack } from "tamagui";
// Zod schema for validation

type FormData = z.infer<typeof registerSchema>;
type CheckedState = boolean | "indeterminate";
const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [, setIslaoding] = useState(false);
  const [eye, seteye] = useState(false);
  const [eyecom, seteyeCom] = useState(false);

  const [checked, setChecked] = useState<CheckedState>(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: "+998",
    },
  });
  const phoneNumber = watch("phoneNumber");

  React.useEffect(() => {
    if (!phoneNumber.startsWith("+998")) {
      setValue("phoneNumber", "+998");
    }
  }, [phoneNumber, setValue]);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    if (!checked) {
      Toast.show({
        type: "error",
        text1: t("terms.mustAgree"),
      });
      return;
    }
    setIslaoding(true);
    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phoneNumber: data.phoneNumber,
        password: data.password,
      };
      await Myasxios.post("/auth/register", payload);
      Toast.show({
        type: "success",
        text1: t("signup.successMessage"),
      });
      router.push(`/auth/otp/phoneNumber=${data.phoneNumber}`);
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error?.response?.data?.message || t("signup.errorMessage");
        Toast.show({
          type: "success",
          text1: message,
        });
      }
    } finally {
      setIslaoding(false);
    }
  };
  // const isFormFilled =
  //   !!watch("firstName") &&
  //   !!watch("lastName") &&
  //   !!watch("phoneNumber") &&
  //   !!watch("password") &&
  //   !!watch("confirmPassword") &&
  //   checked;
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
    <View className="relative min-h-screen">
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
            <View className="absolute" style={ {
              top: 50, left: 20
            } }>
              <Link href={ "/auth/login" }>
                <Text>
                  <ArrowLeft />
                </Text>
              </Link>
            </View>
            <View className="flex-1 flex  justify-center px-6 mb-6 ">
              <View className="sm:mx-auto sm:w-full sm:max-w-sm mb-6">
                <Text className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
                  { t("signup.title") }
                </Text>
              </View>

              <View className="mb-6">
                <View className="mt-2">
                  <Controller
                    control={ control }
                    name="firstName"
                    rules={ { required: true } }
                    render={ ({ field: { value, onChange } }) => (
                      <View>
                        <Text className="text-base font-semibold mb-1">{ t("signup.firstName") }</Text>
                        <Input
                          placeholder={ t("signup.firstNamePlaceholder") }
                          value={ value }
                          onChangeText={ onChange }
                          aria-invalid={ !!errors.firstName }
                          aria-describedby="firstName-error"
                        />
                        { errors.firstName && (
                          <Text className="text-red-500 mt-1">{ errors.firstName.message }</Text>
                        ) }
                      </View>
                    ) }
                  />
                </View>
              </View>

              <View className="mb-6">
                <View className="mt-2">
                  <Controller
                    control={ control }
                    name="lastName"
                    rules={ { required: true } }
                    render={ ({ field: { value, onChange } }) => (
                      <View>
                        <Text className="text-base font-semibold mb-1">{ t("signup.lastName") }</Text>
                        <Input
                          placeholder={ t("signup.lastNamePlaceholder") }
                          value={ value }
                          onChangeText={ onChange }
                          aria-invalid={ !!errors.lastName }
                          aria-describedby="lastName-error"
                        />
                        { errors.lastName && (
                          <Text className="text-red-500 mt-1">{ errors.lastName.message }</Text>
                        ) }
                      </View>
                    ) }
                  />
                </View>
              </View>

              <View className="mb-6">
                <View className="mt-2">
                  <Controller
                    control={ control }
                    name="phoneNumber"
                    rules={ { required: true } }
                    render={ ({ field: { value } }) => (
                      <View>
                        <Text className="text-base font-semibold mb-1">{ t("signup.phoneNumber") }</Text>
                        <Input
                          placeholder={ t("signup.phoneNumberPlaceholder") }
                          value={ value }
                          onChangeText={ handlePhoneChange }
                          aria-invalid={ !!errors.phoneNumber }
                          aria-describedby="phoneNumber-error"
                          defaultValue="+998"
                        />
                        { errors.lastName && (
                          <Text className="text-red-500 mt-1">{ errors.lastName.message }</Text>
                        ) }
                      </View>
                    ) }
                  />
                </View>
              </View>

              <View className="mb-6">
                <View className="mt-2">
                  <View className="relative w-full ">
                    <Controller
                      control={ control }
                      name="password"
                      rules={ { required: true } }
                      render={ ({ field: { value, onChange } }) => (
                        <View>
                          <Text className="text-base font-semibold mb-1">{ t("signup.password") }</Text>
                          <View>
                            <Input
                              placeholder={ t("signup.passwordPlaceholder") }
                              value={ value }
                              onChangeText={ onChange }
                              aria-invalid={ !!errors.password }
                              secureTextEntry={ eye }
                              aria-describedby="password-error"
                              editable={ !isSubmitting }
                              pr={ 15 }
                            />
                            <XStack
                              position="absolute"
                              right={ 15 }
                              top={ 12 }
                              onPress={ () => seteye(!eye) }
                            >
                              <View>
                                { eye ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                              </View>
                            </XStack>
                          </View>
                          { errors.lastName && (
                            <Text className="text-red-500 mt-1">{ errors.lastName.message }</Text>
                          ) }
                        </View>
                      ) }
                    />
                  </View>
                </View>
              </View>

              <View className="mb-6">
                <View className="mt-2">
                  <View className="relative w-full ">
                    <Controller
                      control={ control }
                      name="confirmPassword"
                      rules={ { required: true } }
                      render={ ({ field: { value, onChange } }) =>
                        <View >
                          <Text className="text-base font-semibold mb-1">{ t("signup.confirmPassword") }</Text>
                          <View className="relative">
                            <Input
                              className="border border-gray-300 rounded-md p-3 text-base"
                              secureTextEntry={ eyecom }
                              placeholder={ t("signup.confirmPasswordPlaceholder") }
                              value={ value }
                              onChangeText={ onChange }
                              editable={ !isSubmitting }
                              aria-invalid={ !!errors.confirmPassword }
                              aria-describedby="confirmPassword-error"
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
                            { errors.confirmPassword && (
                              <Text className="text-red-500 mt-1">{ errors.confirmPassword.message }</Text>
                            ) }
                          </View>
                        </View>
                      }
                    />
                  </View>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <Checkbox checked={ checked } onCheckedChange={ (val) => setChecked(val) }>
                  <Checkbox.Indicator>
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label htmlFor="terms">
                  <Text className=" font-medium text-[14px] leading-5 ">
                    <Trans
                      i18nKey="terms.agree"
                      components={ {
                        1: (
                          <Link
                            href="/auth/term"
                            className="text-blue-500 underline"
                          >
                          </Link>
                        ),
                      } }
                    />
                  </Text>
                </Label>
              </View>
              <View className="mt-6">
                <Pressable
                  onPress={ handleSubmit(onSubmit) }
                  className="bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4"
                  disabled={ isSubmitting }
                >
                  <Text className="text-primary-foreground font-bold">
                    { isSubmitting
                      ? t("signup.signingUpButton")
                      : t("signup.signUpButton") }
                  </Text>
                </Pressable>
              </View>

              {/* <p className="mt-10 text-center text-sm text-muted-foreground">
            {t("signup.alreadyHaveAccount")}{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold leading-6 text-gym-500 hover:text-gym-400"
              type="button"
              >
              {t("signup.signIn")}
              </button>
              </p> */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SignUp;
