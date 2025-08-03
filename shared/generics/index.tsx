// import { BASE_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export const BASE_URL = "https://backend.qadam.app"
export const Myasxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
Myasxios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
      // React Native-da redirect yo'q, router.push ishlatiladi
      // Buni tashqarida (hook yoki context) handle qilish kerak
    }
    return config;
  },
  (error) => Promise.reject(error)
);


