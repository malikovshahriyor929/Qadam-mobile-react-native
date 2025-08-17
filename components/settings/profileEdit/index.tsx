import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableWithoutFeedback } from "react-native"
import { Sheet, YStack, XStack, Input, Label, Text } from "tamagui"
import { t } from "i18next"
import { Myasxios } from "@/shared/generics"
import { userType } from "@/types"
import Toast from "react-native-toast-message"

const userSchema = z.object({
  firstName: z.string().min(1, t("First name is required")),
  lastName: z.string().min(1, t("Last name is required")),
  phoneNumber: z
    .string()
    .min(13, { message: t("validation.phoneMin") })
    .transform((val) => val.replace(/[\s-]/g, ""))
  // .refine((val) => /^\d{14}$/.test(val), {
  //   message: t("validation.phoneFormat"),
  // })
});
export type UserType = z.infer<typeof userSchema>;

type EditProfileProps = {
  setEditUser: React.Dispatch<React.SetStateAction<userType | undefined>>
  EditUser: userType
  setEditOpener: React.Dispatch<React.SetStateAction<boolean>>
  EditOpener: boolean
  refetch: () => void
}

const EditProfile = ({ setEditUser, setEditOpener, EditOpener, EditUser, refetch }: EditProfileProps) => {
  const [OtpOpener, setOtpOpener] = useState(false)
  const [OTPValue, setOTPValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [snapPoints, setSnapPoints] = useState<number[]>(OtpOpener?[35]:[55]);
  const [snapIndex, setSnapIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: EditUser,
  })

  const onSubmit = async (data: UserType) => {
    setLoading(true)
    setEditUser(data)
    const nameChanged = data.firstName !== EditUser.firstName || data.lastName !== EditUser.lastName
    const phoneChanged = `+998${data.phoneNumber}` != EditUser.phoneNumber
    console.log(phoneChanged, `${data.phoneNumber}`, EditUser.phoneNumber);

    if (nameChanged && phoneChanged) {
      await Myasxios.put("/users/update-name", {
        firstName: data.firstName,
        lastName: data.lastName,
      })
      await Myasxios.post("/confirmation/request-new-phone", {
        newPhoneNumber: `+998${data.phoneNumber}`,
      })
      setEditOpener(false)
      setOtpOpener(true)
    }
    if (phoneChanged) {
      await Myasxios.post("/confirmation/request-new-phone", {
        newPhoneNumber: data.phoneNumber.trim()
      }).then(res => console.log(res)).catch(rej => console.log(rej)
      )

      console.log("axios worked ");
      setEditOpener(false)
      setOtpOpener(true)
      setLoading(false)
    } else if (nameChanged) {
      await Myasxios.put("/users/update-name", {
        firstName: data.firstName,
        lastName: data.lastName,
      })
      setEditOpener(false)
    } else {
      setEditOpener(false)
      setLoading(false)
    }

    setLoading(false)
    reset()
    refetch()
  }

  const onSubmitOTP = async () => {
    try {
      await Myasxios.post("/confirmation/confirm-new-phone", { code: OTPValue })
      Toast.show({
        type: "success",
        text1: (t("toast.otpSuccess"))
      })
      refetch()
    } catch (error) {
      Toast.show({
        type: "error",
        text1: (t("toast.otpError"))
      })
    } finally {
      setOtpOpener(false)
      setOTPValue("")
    }
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      // setSnapIndex(1)
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      // setSnapIndex(0)
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (EditOpener&& !OtpOpener) {
      if (keyboardVisible) {
        setSnapPoints([95])
        setSnapIndex(1)
      } else {
        setSnapPoints([55])
        setSnapIndex(0)
      }
    } else {
      if (keyboardVisible) {
        setSnapPoints([75])
        setSnapIndex(1)
      } else {
        setSnapPoints([35])
        setSnapIndex(0)
      }
    }
  }, [keyboardVisible, snapIndex]);

  return (
    <>
      {/* Edit Profile Sheet */ }
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
      >
        <Sheet
          key={ snapIndex }
          open={ EditOpener }
          onOpenChange={ (open: boolean) => {
            setEditOpener(open);
            if (!open) setSnapPoints([55]);
            if (!open) setSnapIndex(0);
          } }
          // onOpenChange={ setEditOpener }
          snapPoints={ snapPoints }
          dismissOnSnapToBottom
          dismissOnOverlayPress
          animation={ "medium" }
          modal
        >
          <Sheet.Overlay />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" gap={ 10 }>
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={ { flexGrow: 1 } }
              >
                <Text fontSize={ 18 } fontWeight="bold" textAlign="center">
                  { t("Edit Profile") }
                </Text>

                <YStack marginTop="$3">
                  {/* First Name */ }
                  <YStack>
                    <Text style={ { fontWeight: "bold", marginBottom: 10 } }>{ t("First Name") }</Text>
                    <Controller
                      control={ control }
                      name="firstName"
                      render={ ({ field: { onChange, onBlur, value } }) => (
                        <Input
                          value={ value }
                          onChangeText={ onChange }
                          onBlur={ onBlur }
                        />
                      ) }
                    />
                    { errors.firstName && <Text color="red">{ errors.firstName.message }</Text> }
                  </YStack>

                  {/* Last Name */ }
                  <YStack>
                    <Label>{ t("Last Name") }</Label>
                    <Controller
                      control={ control }
                      name="lastName"
                      render={ ({ field: { onChange, onBlur, value } }) => (
                        <Input
                          value={ value }
                          onChangeText={ onChange }
                          onBlur={ onBlur }
                        />
                      ) }
                    />
                    { errors.lastName && <Text color="red">{ errors.lastName.message }</Text> }
                  </YStack>

                  {/* Phone Number */ }
                  <YStack>
                    <Label>{ t("Phone Number") }</Label>
                    <XStack>
                      <Controller
                        control={ control }
                        name="phoneNumber"
                        render={ ({ field: { onChange, onBlur, value } }) => (
                          <Input
                            keyboardType="numeric"
                            value={ value }
                            onChangeText={ onChange }
                            onBlur={ onBlur }
                            // defaultValue={ EditUser?.phoneNumber.replace(/^\+998/, "") }
                            maxLength={ 13 }
                            flex={ 1 }
                          />
                        ) }
                      />
                    </XStack>
                    { errors.phoneNumber && <Text color="red">{ errors.phoneNumber.message }</Text> }
                  </YStack>
                </YStack>

                {/* Save button */ }
                <YStack marginTop="$4">
                  <Pressable
                    className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-4 py-4"
                    onPress={ handleSubmit(onSubmit) }
                  >
                    {
                      loading ?
                        <Text style={ { color: "#D5FA48", fontWeight: "bold" } }>
                          { t("Save changes") }...
                        </Text>
                        : <Text style={ { color: "#D5FA48", fontWeight: "bold" } }>
                          { t("Save changes") }
                        </Text>
                    }
                  </Pressable>
                </YStack>
              </ScrollView>
            </TouchableWithoutFeedback>
          </Sheet.Frame>
        </Sheet>
      </KeyboardAvoidingView>

      {/* OTP Sheet */ }
      {/* <Sheet modal open={ OtpOpener } onOpenChange={ setOtpOpener } snapPoints={ [40] } dismissOnSnapToBottom>
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" space="$3">
          <Sheet.Handle />
          <Text fontSize={ 18 } fontWeight="700" textAlign="center">
            { t("enterSmsCode") }
          </Text>

          <YStack space="$4" marginTop="$3">
            <Input
              value={ OTPValue }
              onChangeText={ setOTPValue }
              keyboardType="numeric"
              maxLength={ 6 }
              placeholder="Enter code"
            />
            <Pressable
              className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-4 py-4"
              onPress={ onSubmitOTP }
            >
              <Text className="text-primary-foreground font-bold text-sm">{ t("Save changes") }</Text>
            </Pressable>
          </YStack>
        </Sheet.Frame>
      </Sheet> */}
      <Sheet
        key={ snapIndex }
        modal
        open={ OtpOpener }
        onOpenChange={ (open: boolean) => {
          setOtpOpener(open);
          if (!open) {
            setSnapPoints([30]);
            setSnapIndex(0);
          }
        } }
        snapPoints={ snapPoints }
        dismissOnSnapToBottom
        dismissOnOverlayPress
        animation="medium"
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" space="$3" zIndex={ 999 }>
          <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={ { flexGrow: 1 } }
            >
              <Text fontSize={ 18 } fontWeight="700" textAlign="center">
                { t("enterSmsCode") }
              </Text>

              <YStack space="$4" marginTop="$3">
                <Input
                  value={ OTPValue }
                  onChangeText={ setOTPValue }
                  keyboardType="numeric"
                  maxLength={ 6 }
                  placeholder="Enter code"
                  onFocus={ () => {
                    setSnapPoints([75]);
                    setSnapIndex(1);
                  } }
                />
                <Pressable
                  className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-4 py-4"
                  onPress={ onSubmitOTP }
                >
                  <Text color={"#D5FA48"} className="text-primary-foreground font-bold text-sm">
                    { t("Save changes") }
                  </Text>
                </Pressable>
              </YStack>
            </ScrollView>
          </TouchableWithoutFeedback>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

export default EditProfile

