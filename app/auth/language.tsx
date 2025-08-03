import { languageMenu } from "@/shared/config/i18";
import { GetStorage, SetStorage } from "@/shared/getStorage";
import { useRouter } from "expo-router";
import { t, changeLanguage } from "i18next";
import { Check, Globe } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Language = () => {
  const [selectedLang, setSelectedLang] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    const fetchLang = async () => {
      const lang = await GetStorage("language");
      if (lang) setSelectedLang(lang);
    };
    fetchLang();
  }, []);

  const changelang = async (code: string) => {
    changeLanguage(code);
    await SetStorage("language", code);
    setSelectedLang(code);
    setIsSelected(true);
  };
  const router = useRouter();
  const check = async () => {
    if (!isSelected) {
      await SetStorage("language", "en");
    }
    const token = await GetStorage("access_token");
    if (!token) {
      return router.push("/auth/login");
    } else {
      return router.push("/");
    }
  };
  console.log(selectedLang, isSelected);

  return (
    <View className="flex justify-center items-center min-h-screen w-full bg-[#faf8fb]">
      <View className="w-full max-w-md p-6 bg-background border-none ">
        <View className="flex flex-col gap-2 items-center mb-8">
          <View className="p-2 bg-primary/10 rounded-full">
            <Globe size={ 40 } className="text-primary" />
          </View>
          <Text className="text-2xl font-bold    ">{ t("languageh1") }</Text>
          <Text className="text-gray-500">{ t("languagep") }</Text>
        </View>
        <View className="">
          { languageMenu.map((lang) => (
            <Pressable
              key={ lang.id }
              className={ `flex items-center flex-row justify-between space-x-4 p-4 rounded-[10px] border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors border-2 mb-4  ${selectedLang === lang.code && " !border-primary "
                } ` }
              onPress={ () => {
                changelang(lang.code);
                setIsSelected(true);
              } }
            >
              <View className="flex items-center gap-3 flex-row">
                <Image
                  // loading="lazy"
                  source={ lang.img }
                  alt={ lang.title }
                  className="h-10 w-10 object-contain rounded-full"
                />
                <Text className="text-lg font-medium">{ lang.title }</Text>
              </View>
              {
                selectedLang === lang.code ?
                  <View
                    className="h-7 w-7 border-2 rounded-[100px] bg-primary border-primary flex items-center justify-center"
                  >
                    <Check size={ 15 } color={ "#D5FA48" } className="text-primary-foreground text-sm" />
                  </View> :
                  <View
                    className="h-7 w-7 rounded-[100px] border-2 border-gray-300 flex items-center justify-center "
                  >
                    {/* <Check size={15} color={"#D5FA48"} className="text-primary-foreground text-sm" /> */ }
                  </View>
              }
            </Pressable>
          )) }
        </View>
        <View className=" className={`w-full mt-6 py-4 text-center bg-primary opacity-100 rounded-[10px] hover:bg-primary/80   transition-colors`}">
          <Pressable
            onPress={ check }
            disabled={ selectedLang === "" }

            style={ {
              pointerEvents: selectedLang === "" ? "none" : "auto"
            } }
          >

            <Text className="text-center text-primary-foreground  text-lg">
              { t("languagebtn") }
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Language;
