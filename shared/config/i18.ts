import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import type { InitOptions } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LanguageOption } from "@/types";
import translationEN from "./locale/en/resources.json";
import translationRU from "./locale/ru/resources.json";
import translationUZ from "./locale/uz/resources.json";
export type Language = "en" | "ru" | "uz";
const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  uz: { translation: translationUZ },
} as const;
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
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
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
