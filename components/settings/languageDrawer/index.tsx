// // components/LanguageDrawer.tsx
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { Button } from "@/components/ui/button";
// import { languageMenu } from "@/shared/config/i18";
// import i18next from "i18next";
// import { useEffect, useState } from "react";
// import { t } from "i18next";

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// const LanguageDrawer: React.FC<Props> = ({ open, onClose }) => {
//   const [selectedLang, setSelectedLang] = useState("en");

//   useEffect(() => {
//     const lang = localStorage.getItem("language") || "en";
//     setSelectedLang(lang);
//   }, []);

//   const changeLanguage = (code: string) => {
//     i18next.changeLanguage(code);
//     localStorage.setItem("language", code);
//     setSelectedLang(code);
//     onClose();
//   };

//   return (
//     <Drawer open={open} onClose={onClose}>
//       <DrawerContent className="p-4 pb-6 z-[9999]">
//         <DrawerHeader>
//           <DrawerTitle>{t("choose_language")}</DrawerTitle>
//         </DrawerHeader>
//         <div className="grid gap-3 mt-2">
//           {languageMenu.map((lang) => (
//             <Button
//               key={lang.code}
//               variant={lang.code === selectedLang ? "default" : "outline"}
//               onClick={() => changeLanguage(lang.code)}
//               className="flex justify-start gap-3 text-lg"
//             >
//               <img
//                 loading="lazy"
//                 src={lang.img}
//                 alt={lang.title}
//                 className="w-6 h-6 rounded-full"
//               />
//               {lang.title}
//             </Button>
//           ))}
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default LanguageDrawer;

// components/LanguageSheet.tsx
import { useEffect, useState } from "react"
import { Sheet } from "tamagui"
import { Button, Text, YStack } from "tamagui"
import AsyncStorage from "@react-native-async-storage/async-storage"
import i18next from "i18next"

import { languageMenu } from "@/shared/config/i18"
import { t } from "i18next"
import { Image, Pressable } from "react-native"

interface Props {
  open: boolean
  onClose: () => void
}

const LanguageSheet: React.FC<Props> = ({ open, onClose }) => {
  const [selectedLang, setSelectedLang] = useState("en")

  useEffect(() => {
    const loadLang = async () => {
      const lang = (await AsyncStorage.getItem("language")) || "en"
      setSelectedLang(lang)
    }
    loadLang()
  }, [])

  const changeLanguage = async (code: string) => {
    i18next.changeLanguage(code)
    await AsyncStorage.setItem("language", code)
    setSelectedLang(code)
    onClose()
  }

  return (
    <Sheet
      modal
      open={ open }
      onOpenChange={ onClose }
      snapPoints={ [40] }
      dismissOnSnapToBottom
      animation="medium"
    >
      <Sheet.Overlay />
      <Sheet.Handle />

      <Sheet.Frame padding="$4" gap={ 10 }>
        <Text fontSize={ 18 } fontWeight="bold" textAlign="center" >
          { t("choose_language") }
        </Text>

        <YStack space="$3" marginTop="$2">
          { languageMenu.map((lang) => (
            <Pressable
              key={ lang.code }
              // theme={ lang.code === selectedLang ? "active" : "gray" }
              className={ ` flex-row items-center gap-4 rounded-xl   px-4 py-4 ${lang.code === selectedLang ? "bg-[#2a2f35] " : "bg-white"}` }
              onPress={ () => changeLanguage(lang.code) }
            >
              <Image
                source={ lang.img }
                alt="langimg"
                style={ { width: 30, height: 30, borderRadius: 100 } }

              />
              <Text style={ {
                color: lang.code === selectedLang ? "#D5FA48" : "#2A2F35",
                fontWeight: "bold",
                fontSize: 16
              } }
                className={ `text-lg font-bold ${lang.code === selectedLang ? "text-primary-foreground" : "text-primary"}` }>
                { lang.title }
              </Text>
            </Pressable>
          )) }
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}

export default LanguageSheet
