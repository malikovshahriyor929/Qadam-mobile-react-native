// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import i18next from "i18next";
// // import LanguageDetector from "i18next-browser-languagedetector";
// // import { initReactI18next } from "react-i18next";
// // import translationEN from "./locale/en/resources.json";
// // import translationRU from "./locale/ru/resources.json";
// // import translationUZ from "./locale/uz/resources.json";

// // const resources = {
// //   en: {
// //     translation: translationEN,
// //   },
// //   ru: {
// //     translation: translationRU,
// //   },
// //   uz: {
// //     translation: translationUZ,
// //   },
// // };
// // const savedLanguage = (await AsyncStorage.getItem("language")) || "uz";

// // i18next.use(LanguageDetector).use(initReactI18next).init({
// //   lng: savedLanguage,
// //   resources,
// //   debug: false,
// //   fallbackLng: "uz",
// // });

// // export const languageMenu = [
// //   {
// //     id: 1,
// //     title: "English",
// //     shortTitle: "En",
// //     code: "en",
// //     img: "/United-kingdom_flag_icon_round.svg.png",
// //   },
// //   {
// //     id: 2,
// //     title: "Uzbekistan",
// //     shortTitle: "Uz",
// //     code: "uz",
// //     img: "/kisspng-flag-of-uzbekistan-flags-of-asia-national-flag-uzbekistan-state-university-of-world-languages-s-1713881749464.webp",
// //   },
// //   {
// //     id: 3,
// //     title: "Russian",
// //     shortTitle: "Ru",
// //     code: "ru",
// //     img: "/ru-circle-01.png",
// //   },
// // ];

// // //   let [check, setCheck] = useState(false);
// // // let changelang = (code) => {
// // //   i18next.changeLanguage(code);
// // //   localStorage.setItem("language", code);
// // // };

// // {
// //   /* <div className="relative pt-2 ">
// //   <button
// //     onClick={() => setCheck(!check)}
// //     className="px-2 py-1 rounded-lg border "
// //   >
// //     {t("language")}
// //   </button>
// //   <div
// //     className={` ${
// //       check ? "scale-100" : "scale-0"
// //     }  -bottom-24  absolute  rounded-lg p-2 bg-white shadow-2xl duration-400  w-[120px]  `}
// //   >
// //     {languageMenu.map((value) => (
// //       <div
// //         onClick={() => {
// //           changelang(value.code);
// //           setCheck(!check);
// //         }}
// //         key={value.id}
// //         className="border-b duration-500 border-gray-300 *:py-1 flex items-center "
// //       >
// //         <img
// //           src={value.img}
// //           className="h-7 w-7 object-contain rounded-full"
// //           alt=""
// //         />
// //         <p className="text-[14px]">{value.title}</p>
// //       </div>
// //     ))}
// //   </div>
// // </div>; */
// // }
// // export default i18next;

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Localization from "expo-localization";
// import i18n, { Callback, InitOptions, Module } from "i18next";
// import { initReactI18next } from "react-i18next";

// import translationEN from "./locale/en/resources.json";
// import translationRU from "./locale/ru/resources.json";
// import translationUZ from "./locale/uz/resources.json";

// // bu asosiy tip
// export type TranslationSchema = typeof translationEN;
// export type TranslationSchemaRu = typeof translationEN;
// // Tiplar
// type Language = "en" | "ru" | "uz";

// type Resource = {
//   translation: typeof translationEN;
// };

// const resources: Record<Language, Resource> = {
//   en: { translation: translationEN },
//   ru: { translation: translationRU as TranslationSchemaRu },
//   uz: { translation: translationUZ as TranslationSchema },
// };

// // Custom language detector (type-safe)
// const languageDetector: Module = {
//   type: "languageDetector",
//   // init: () => {},
//   detect: async (callback: Callback) => {
//     try {
//       const savedLang = await AsyncStorage.getItem("language");
//       if (savedLang) {
//         callback(savedLang);
//       } else {
//         const locale = Localization.locale.split("-")[0];
//         callback((locale as Language) || "uz");
//       }
//     } catch (e) {
//       callback("uz");
//     }
//   },
//   cacheUserLanguage: (lng: string) => {
//     AsyncStorage.setItem("language", lng);
//   },
// };

// i18n
//   .use(languageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     fallbackLng: "uz",
//     interpolation: {
//       escapeValue: false,
//     },
//     compatibilityJSON: "v3",
//   } satisfies InitOptions);

// export default i18n;

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import type { InitOptions } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// JSON tarjimalar
import { LanguageOption } from "@/types";
import translationEN from "./locale/en/resources.json";
import translationRU from "./locale/ru/resources.json";
import translationUZ from "./locale/uz/resources.json";

// Qo‘llab-quvvatlanadigan tillar
export type Language = "en" | "ru" | "uz";

// Til resurslari
const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  uz: { translation: translationUZ },
} as const;

// Custom language detector — faqat React Native uchun
let lang = "";
const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: (callback: (lang: Language) => void) => {
    AsyncStorage.getItem("language")
      .then((lang) => {
        if (lang) {
          callback(lang as Language);
          lang = lang;
        } else {
          const deviceLang = Localization.getLocales()[0]
            ?.languageCode as Language;
          callback(deviceLang || "uz");
          lang = deviceLang;
        }
      })
      .catch(() => {
        callback("uz");
        lang = "uz";
      });
  },
  init: () => {}, // optional, typega qo‘shilishi uchun kerak
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem("language", lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    lng: lang,
    fallbackLng: "uz",
    resources,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  } satisfies InitOptions);

export const languageMenu: LanguageOption[] = [
  {
    id: 1,
    title: "English",
    shortTitle: "En",
    code: "en",
    img: require("../../assets/images/uk.png"),
  },
  {
    id: 2,
    title: "Uzbekistan",
    shortTitle: "Uz",
    code: "uz",
    img: require("../../assets/images/uz.webp"),
  },
  {
    id: 3,
    title: "Russian",
    shortTitle: "Ru",
    code: "ru",
    img: require("../../assets/images/ru.png"),
  },
];
export default i18n;
