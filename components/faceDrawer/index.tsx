import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Myasxios } from "@/shared/generics";
import {  Sheet, Avatar, AvatarFallback, AvatarImage } from "tamagui";
import { isAxiosError } from "axios";

interface Props {
  open: boolean;
  setFaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FaceDrawer: React.FC<Props> = ({ open, setFaceOpen }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { refetch } = useQuery({
    queryKey: ["face"],
    enabled: open,
    queryFn: async () => {
      const res = await Myasxios.get("/face");
      if (res.data?.file?.filename) {
        setPreviewUrl(`${process.env.EXPO_PUBLIC_BASE_URL}/files/${res.data.file.filename}`);
      }
      return res.data;
    },
  });

  useEffect(() => {
    if (open) refetch();
  }, [open]);

  const requestPermissions = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!camera.granted || !media.granted) {
      Toast.show({ type: "error", text1: t("Permission denied") });
      return false;
    }
    return true;
  };

  const pickImage = async (fromCamera: boolean) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1, allowsEditing: false, exif: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 1, allowsEditing: false, exif: true });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      // 🛠️ Konvertatsiya + orientatsiyani to‘g‘rilash
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const uri = manipulated.uri;
      const name = `face_${Date.now()}.jpg`;
      const type = "image/jpeg";

      const formData = new FormData();
      formData.append("file", {
        uri,
        name,
        type,
      } as any);

      await upload(formData);
    }
  };

  const upload = async (formData: FormData) => {
    try {
      setLoading(true);

      const res = await Myasxios.post("/files/face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileId = res.data?.file?.id;
      if (fileId) {
        await Myasxios.post("/face", { fileId });
        Toast.show({ type: "success", text1: t("faceId.success") });
        refetch();
        setFaceOpen(false);
      }

      if (res.data?.file?.filename) {
        setPreviewUrl(`${process.env.EXPO_PUBLIC_BASE_URL}/files/${res.data.file.filename}`);
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 406) {
        Toast.show({ type: "error", text1: t("face406") });
      } else {
        Toast.show({ type: "error", text1: t("faceId.error") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={ open } onOpenChange={ setFaceOpen } snapPoints={ [60] } modal>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding={ 16 } backgroundColor="#fff" borderTopLeftRadius={ 16 } borderTopRightRadius={ 16 }>
        <View className="items-center">
          <Text style={ styles.title }
            className="mt-3"
          >{ t("faceId.title") }</Text>

          <View style={ { marginVertical: 10 } }>
            <Avatar size={ 150 } borderWidth={ 2 } borderRadius={"100%"} borderColor="#ccc">
              { previewUrl ? (
                <AvatarImage source={ { uri: previewUrl } } />
              ) : (
                <AvatarFallback>
                  <Text>{ t("faceId.label") }</Text>
                </AvatarFallback>
              ) }
              { loading && (
                <View style={ styles.loadingOverlay }>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) }
            </Avatar>
          </View>

          <Text style={ styles.description }>{ t("faceId.description") }</Text>

          <View style={ styles.buttonContainer }>
            <Pressable className="bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4"
              onPress={ () => pickImage(true) } >
              <Text className="text-primary-foreground font-bold">{ t("takePhoto") }</Text>
            </Pressable>
            <Pressable className="bg-primary  hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium  px-4 py-4"
              onPress={ () => pickImage(false) }>
              <Text className="text-primary-foreground font-bold">{ t("Choose from Gallery") }</Text>
            </Pressable>
          </View>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: "auto",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
    gap: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
});

export default FaceDrawer;
