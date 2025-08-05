import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { Loader2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { TamaguiProvider } from 'tamagui';
import i18next from "../shared/config/i18";
import tamaguiConfig from '../tamagui.config';
import "./global.css";
import { toastConfig } from "@/components/toastConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");
      if (!alreadyLaunched) {
        await AsyncStorage.setItem("alreadyLaunched", "true");
        router.replace("/auth/language");
      }
      setIsReady(true);
    };
    checkFirstLaunch();
  }, [router]);

  if (!isReady)
    return (
      <View className="flex items-center justify-center h-screen w-full animate-spin ">
        <Loader2 size={ 40 } color={ "#2A2F35" } />
      </View>
    )

  return (
    <TamaguiProvider config={ tamaguiConfig }>
      <QueryClientProvider client={ queryClient }>
        <I18nextProvider i18n={ i18next }>
          <SafeAreaView style={ { flex: 1, backgroundColor: '#fff' } } edges={ ['top', 'left', 'right'] }>
            <SafeAreaProvider>
              <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
              <Stack >
                <Stack.Screen name="(tabs)" options={ { headerShown: false } } />
                <Stack.Screen name="auth" options={ { headerShown: false } } />
              </Stack >
              <Toast config={ toastConfig } />
            </SafeAreaProvider>
          </SafeAreaView>
        </I18nextProvider>
      </QueryClientProvider>
    </TamaguiProvider >
  )
}
