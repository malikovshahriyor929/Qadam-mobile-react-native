
import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} >
    <Stack screenOptions={{ headerShown: false }} />
    // </SafeAreaView>
  )
}
