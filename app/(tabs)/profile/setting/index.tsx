import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { Myasxios } from "@/shared/generics";
import { userType } from "@/types";

// components
import Header from "@/components/headerforAll";
import FaceDrawer from "@/components/faceDrawer";
import LanguageSheet from "@/components/settings/languageDrawer";
import EditProfile from "@/components/settings/profileEdit";
import * as ImageManipulator from "expo-image-manipulator";
import { shadowLg } from "@/utils/shadow";
import { Camera, Globe, ScanFace, VenusAndMars } from "lucide-react-native";

const Setting = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState<userType>();
  const [EditUser, setEditUser] = useState<userType>();
  const [EditOpener, setEditOpener] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [faceOpen, setFaceOpen] = useState(false);
  const [token, setToken] = useState("");
  const [genderValue, setGenderValue] = useState(userData?.gender || "erkak");
  const [genderChanged, setGenderChanged] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const tokens = await AsyncStorage.getItem("access_token");
      if (tokens) setToken(tokens);
    };
    fetchToken();
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await Myasxios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          params: { populate: "balance" },
        });
        // setEditUser(response.data)
        return response.data;
      } catch {
        return null;
      }
    },
    retry: false,
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      setUserData(data);
      refetch();
    }
  }, [data, refetch]);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1, allowsEditing: false, exif: true });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const uri = manipulated.uri;
      const name = `avatar_${Date.now()}.jpg`;
      const type = "image/jpeg";
      const formData = new FormData();
      formData.append("file", {
        uri,
        name,
        type,
      } as any);

      try {
        const response = await Myasxios.patch("/users/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);

        Toast.show({ type: "success", text1: t("avatar_updated") });
        if (userData) {
          setUserData({ ...userData, avatarUrl: response.data.url });
        }
      } catch {
        Toast.show({ type: "error", text1: t("upload_failed") });
      }
    }
  };

  const handleGenderChange = (value: string) => {
    setGenderValue(value);
    setGenderChanged(true);
  };

  const saveGender = async () => {
    try {
      await Myasxios.patch(
        "/users/gender",
        { gender: genderValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Toast.show({ type: "success", text1: t("gender_updated") });
      setGenderChanged(false);
    } catch {
      Toast.show({ type: "error", text1: t("update_failed") });
    }
  };

  return (
    <View style={ { flex: 1 } } className="">
      <Header title={ t("settings") } showBackButton={ "/(tabs)/profile" } />
      <View className="mx-4">

        {/* Avatar */ }
        <View style={ { alignItems: "center", marginVertical: 25 } }>
          <TouchableOpacity
            onPress={ pickImage }>
            { userData?.avatarUrl ? (
              <View className="relative w-[120px] h-[120px] ">
                <Image
                  source={ { uri: process.env.EXPO_PUBLIC_BASE_URL + userData.avatarUrl } }
                  style={ { width: 120, height: 120, borderRadius: 60 } }
                  className="border-2 border-border"
                />
                <View
                  style={ {
                    position: "absolute",
                    bottom: -5,
                    right: 0,
                    backgroundColor: "white",
                    padding: 6,
                    borderRadius: 50,
                  } }
                  className="!w-fit bg-white p-2 rounded-full"
                >
                  <Camera size={ 30 } />
                </View>
              </View>
            ) : (
              <View
                style={ {
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                } }
              >
                <Text style={ { fontSize: 24, fontWeight: "bold" } }>
                  { (userData?.firstName?.[0] || "").toUpperCase() }
                  { (userData?.lastName?.[0] || "").toUpperCase() }
                </Text>
              </View>
            ) }

          </TouchableOpacity>
        </View>

        {/* User Info Card */ }
        <View
          style={ shadowLg }
          className="bg-white rounded-xl p-4 flex-row justify-between items-center mb-4   shadow border border-[#E4E4E7]"
        >
          { userData ? (
            <View className="">
              <Text style={ { fontSize: 18, fontWeight: "600" } } className="max-w-[180px] truncate line-clamp-1">
                { userData.firstName + " " + userData.lastName }
              </Text>
              <Text style={ { color: "#666" } }>{ userData.phoneNumber }</Text>
            </View>
          ) : (
            <Text>{ t("loading") }</Text>
          ) }

          <TouchableOpacity
            className=" border border-border rounded-xl p-2 bg-muted"
            onPress={ () => {
              setEditUser(userData);
              setEditOpener(true);
            } }
          >
            <Text className="font-medium ">{ t("edit") }</Text>
          </TouchableOpacity>
        </View>

        {/* Language Card */ }
        <View
          style={ shadowLg }
          className="bg-white rounded-xl p-4 flex-row justify-between items-center mb-4   shadow border border-[#E4E4E7]"
        >
          <View className="items-center flex-row gap-2 ">
            <Globe size={ 24 } />
            <Text style={ { fontSize: 16, fontWeight: "500" } }>{ t("language") }</Text>
          </View>
          <TouchableOpacity
            onPress={ () => setDrawerOpen(true) }
            className="border border-border rounded-xl p-2 bg-muted"
          >
            <Text className="font-medium ">{ t("change") }</Text>
          </TouchableOpacity>
        </View>

        {/* Face ID Card */ }
        <View
          style={ shadowLg }
          className="bg-white rounded-xl p-4 flex-row justify-between items-center mb-4   shadow border border-[#E4E4E7]" >
          <View className="items-center flex-row gap-2 ">
            <ScanFace size={ 24 } />
            <Text style={ { fontSize: 16, fontWeight: "500" } }>
              { t("faceId.label") }
            </Text>
          </View>
          <TouchableOpacity
            className="border border-border rounded-xl p-2 bg-muted"
            onPress={ () => setFaceOpen(true) }
          >
            <Text className="font-medium ">{ t("change") }</Text>
          </TouchableOpacity>
        </View>

        {/* Gender Selector */ }
        <View
          style={ shadowLg }
          className="bg-white rounded-xl p-4 w-full justify-between items-center  mb-4   shadow border border-[#E4E4E7]"
        >
          <View className="flex-row justify-between w-full">
            <View className=" items-center flex-row gap-2">
              <VenusAndMars />
              <Text className="capitalize" style={ { fontSize: 16, fontWeight: "500", marginBottom: 6 } }>
                { t("gender") }
              </Text>
            </View>

            <View style={ { flexDirection: "row", gap: 10 } }>
              <TouchableOpacity
                onPress={ () => handleGenderChange("erkak") }
                style={ {
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    genderValue === "erkak" ? "#2a2f35" : "transparent",
                  borderWidth: 1,
                  borderColor: "#2a2f35",
                } }
                className="!border-2 px-4"
              >
                <Text
                  style={ {
                    color: genderValue === "erkak" ? "#d5fa48" : "#2a2f35",
                  } }
                  className="font-medium"
                >
                  { t("male") }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={ () => handleGenderChange("ayol") }
                style={ {
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    genderValue === "ayol" ? "#2a2f35" : "transparent",
                  borderWidth: 1,
                  borderColor: "#2a2f35",
                } }
                className="!border-2 px-4"
              >
                <Text
                  style={ {
                    color: genderValue === "ayol" ? "#d5fa48" : "#2a2f35",
                  } }
                  className="font-medium"
                >
                  { t("female") }
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          { genderChanged && (
            <TouchableOpacity
              onPress={ saveGender }
              style={ {
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
                backgroundColor: "#2a2f35",
              } }
              className=" w-full"
            >
              <Text style={ { color: "#d5fa48", textAlign: "center" } }>
                { t("save") }
              </Text>
            </TouchableOpacity>
          ) }
        </View>
      </View>

      {/* Sheets / Drawers */ }
      <LanguageSheet open={ drawerOpen } onClose={ () => setDrawerOpen(false) } />
      <FaceDrawer open={ faceOpen } setFaceOpen={ setFaceOpen } />
      { EditUser && <EditProfile
        setEditOpener={ setEditOpener }
        EditOpener={ EditOpener }
        setEditUser={ setEditUser }
        EditUser={ EditUser }
        refetch={ refetch }
      /> }
    </View>
  );
};

export default Setting;
